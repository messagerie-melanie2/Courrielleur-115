/* -*- Mode: Objective-C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is 
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Josh Aas <josh@mozilla.com>
 *   Colin Barrett <cbarrett@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

#include "nsCocoaWindow.h"

#include "nsCOMPtr.h"
#include "nsWidgetsCID.h"
#include "nsGUIEvent.h"
#include "nsIRollupListener.h"
#include "nsCocoaUtils.h"
#include "nsChildView.h"
#include "nsIAppShell.h"
#include "nsIAppShellService.h"
#include "nsIBaseWindow.h"
#include "nsIInterfaceRequestorUtils.h"
#include "nsIXULWindow.h"
#include "nsIPrefService.h"
#include "nsIPrefBranch.h"
#include "nsToolkit.h"
#include "nsPrintfCString.h"

PRInt32 gXULModalLevel = 0;

// defined in nsMenuBarX.mm
extern NSMenu* sApplicationMenu; // Application menu shared by all menubars

// defined in nsChildView.mm
extern nsIRollupListener * gRollupListener;
extern nsIWidget         * gRollupWidget;
extern BOOL                gSomeMenuBarPainted;

#define NS_APPSHELLSERVICE_CONTRACTID "@mozilla.org/appshell/appShellService;1"

#define POPUP_DEFAULT_TRANSPARENCY 0.95

NS_IMPL_ISUPPORTS_INHERITED1(nsCocoaWindow, Inherited, nsPIWidgetCocoa)


// A note on testing to see if your object is a sheet...
// |mWindowType == eWindowType_sheet| is true if your gecko nsIWidget is a sheet
// widget - whether or not the sheet is showing. |[mWindow isSheet]| will return
// true *only when the sheet is actually showing*. Choose your test wisely.


// roll up any popup windows
static void RollUpPopups()
{
  if (gRollupListener && gRollupWidget)
    gRollupListener->Rollup(nsnull);
}


nsCocoaWindow::nsCocoaWindow()
: mParent(nsnull)
, mWindow(nil)
, mDelegate(nil)
, mSheetWindowParent(nil)
, mPopupContentView(nil)
, mIsResizing(PR_FALSE)
, mWindowMadeHere(PR_FALSE)
, mVisible(PR_FALSE)
, mSheetNeedsShow(PR_FALSE)
, mModal(PR_FALSE)
{

}


nsCocoaWindow::~nsCocoaWindow()
{
  // notify the children that we're gone
  for (nsIWidget* kid = mFirstChild; kid; kid = kid->GetNextSibling()) {
    nsCocoaWindow* childWindow = static_cast<nsCocoaWindow*>(kid);
    childWindow->mParent = nsnull;
  }

  if (mWindow && mWindowMadeHere) {
    // we want to unhook the delegate here because we don't want events
    // sent to it after this object has been destroyed
    [mWindow setDelegate:nil];
    [mWindow autorelease];
    [mDelegate autorelease];
  }

  NS_IF_RELEASE(mPopupContentView);

  // Deal with the possiblity that we're being destroyed while running modal.
  NS_ASSERTION(!mModal, "Widget destroyed while running modal!");
  if (mModal) {
    --gXULModalLevel;
    NS_ASSERTION(gXULModalLevel >= 0, "Wierdness setting modality!");
  }
}


static nsIWidget* GetHiddenWindowWidget()
{
  nsCOMPtr<nsIAppShellService> appShell(do_GetService(NS_APPSHELLSERVICE_CONTRACTID));
  if (!appShell) {
    NS_WARNING("Couldn't get AppShellService in order to get hidden window ref");
    return nsnull;
  }
  
  nsCOMPtr<nsIXULWindow> hiddenWindow;
  appShell->GetHiddenWindow(getter_AddRefs(hiddenWindow));
  if (!hiddenWindow) {
    // Don't warn, this happens during shutdown, bug 358607.
    return nsnull;
  }
  
  nsCOMPtr<nsIBaseWindow> baseHiddenWindow;
  baseHiddenWindow = do_GetInterface(hiddenWindow);
  if (!baseHiddenWindow) {
    NS_WARNING("Couldn't get nsIBaseWindow from hidden window (nsIXULWindow)");
    return nsnull;
  }
  
  nsCOMPtr<nsIWidget> hiddenWindowWidget;
  if (NS_FAILED(baseHiddenWindow->GetMainWidget(getter_AddRefs(hiddenWindowWidget)))) {
    NS_WARNING("Couldn't get nsIWidget from hidden window (nsIBaseWindow)");
    return nsnull;
  }

  return hiddenWindowWidget;
}


static nsIMenuBar* GetHiddenWindowMenuBar()
{
  nsIWidget* hiddenWindowWidgetNoCOMPtr = GetHiddenWindowWidget();
  if (hiddenWindowWidgetNoCOMPtr)
    return static_cast<nsCocoaWindow*>(hiddenWindowWidgetNoCOMPtr)->GetMenuBar();
  else
    return nsnull;
}


// Very large windows work in Cocoa, but can take a long time to
// process (multiple minutes), during which time the system is
// unresponsive and seems hung. Although it's likely that windows
// much larger than screen size are bugs, be conservative and only
// intervene if the values are so large as to hog the cpu.
#define SIZE_LIMIT 100000
static bool WindowSizeAllowed(PRInt32 aWidth, PRInt32 aHeight)
{
  if (aWidth > SIZE_LIMIT) {
    NS_ERROR(nsPrintfCString(256, "Requested Cocoa window width of %d is too much, max allowed is %d\n",
                             aWidth, SIZE_LIMIT).get());
    return false;
  }
  if (aHeight > SIZE_LIMIT) {
    NS_ERROR(nsPrintfCString(256, "Requested Cocoa window height of %d is too much, max allowed is %d\n",
                             aHeight, SIZE_LIMIT).get());
    return false;
  }
  return true;
}


// Utility method for implementing both Create(nsIWidget ...) and
// Create(nsNativeWidget...)
nsresult nsCocoaWindow::StandardCreate(nsIWidget *aParent,
                        const nsRect &aRect,
                        EVENT_CALLBACK aHandleEventFunction,
                        nsIDeviceContext *aContext,
                        nsIAppShell *aAppShell,
                        nsIToolkit *aToolkit,
                        nsWidgetInitData *aInitData,
                        nsNativeWidget aNativeWindow)
{
  if (!WindowSizeAllowed(aRect.width, aRect.height))
    return NS_ERROR_FAILURE;

  Inherited::BaseCreate(aParent, aRect, aHandleEventFunction, aContext, aAppShell,
                        aToolkit, aInitData);
  
  mParent = aParent;
  
  // create a window if we aren't given one, always create if this should be a popup
  if (!aNativeWindow || (aInitData && aInitData->mWindowType == eWindowType_popup)) {
    // decide on a window type
    PRBool allOrDefault = PR_FALSE;
    if (aInitData) {
      allOrDefault = aInitData->mBorderStyle == eBorderStyle_all ||
                     aInitData->mBorderStyle == eBorderStyle_default;
      mWindowType = aInitData->mWindowType;
      // if a toplevel window was requested without a titlebar, use a dialog
      if (mWindowType == eWindowType_toplevel &&
          (aInitData->mBorderStyle == eBorderStyle_none ||
           !allOrDefault &&
           !(aInitData->mBorderStyle & eBorderStyle_title)))
        mWindowType = eWindowType_dialog;
    }
    else {
      allOrDefault = PR_TRUE;
      mWindowType = eWindowType_toplevel;
    }

    // Some applications like Camino use native popup windows
    // (native context menus, native tooltips)
    nsCOMPtr<nsIPrefBranch> prefs = do_GetService(NS_PREFSERVICE_CONTRACTID);
    if (prefs) {
      PRBool useNativeContextMenus;
      nsresult rv = prefs->GetBoolPref("ui.use_native_popup_windows", &useNativeContextMenus);
      if (NS_SUCCEEDED(rv) && useNativeContextMenus && mWindowType == eWindowType_popup)
        return NS_OK;
    }

    // we default to NSBorderlessWindowMask, add features if needed
    unsigned int features = NSBorderlessWindowMask;
    
    // Configure the window we will create based on the window type
    switch (mWindowType)
    {
      case eWindowType_invisible:
      case eWindowType_child:
        break;
      case eWindowType_dialog:
        if (aInitData) {
          switch (aInitData->mBorderStyle)
          {
            case eBorderStyle_none:
              break;
            case eBorderStyle_default:
              features |= NSTitledWindowMask;
              break;
            case eBorderStyle_all:
              features |= NSClosableWindowMask;
              features |= NSTitledWindowMask;
              features |= NSResizableWindowMask;
              features |= NSMiniaturizableWindowMask;
              break;
            default:
              if (aInitData->mBorderStyle & eBorderStyle_title) {
                features |= NSTitledWindowMask;
                features |= NSMiniaturizableWindowMask;
              }
              if (aInitData->mBorderStyle & eBorderStyle_resizeh)
                features |= NSResizableWindowMask;
              if (aInitData->mBorderStyle & eBorderStyle_close)
                features |= NSClosableWindowMask;
              break;
          }
        }
        else {
          features |= NSTitledWindowMask;
          features |= NSMiniaturizableWindowMask;
        }
        break;
      case eWindowType_sheet:
        if (aInitData) {
          nsWindowType parentType;
          aParent->GetWindowType(parentType);
          if (parentType != eWindowType_invisible &&
              aInitData->mBorderStyle & eBorderStyle_resizeh) {
            features = NSResizableWindowMask;
          }
          else {
            features = NSMiniaturizableWindowMask;
          }
        }
        else {
          features = NSMiniaturizableWindowMask;
        }
        features |= NSTitledWindowMask;
        break;
      case eWindowType_popup:
        features |= NSBorderlessWindowMask;
        break;
      case eWindowType_toplevel:
        features |= NSTitledWindowMask;
        features |= NSMiniaturizableWindowMask;
        if (allOrDefault || aInitData->mBorderStyle & eBorderStyle_close)
          features |= NSClosableWindowMask;
        if (allOrDefault || aInitData->mBorderStyle & eBorderStyle_resizeh)
          features |= NSResizableWindowMask;
        break;
      default:
        NS_ERROR("Unhandled window type!");
        return NS_ERROR_FAILURE;
    }

    /* Apple's docs on NSWindow styles say that "a window's style mask should
     * include NSTitledWindowMask if it includes any of the others [besides
     * NSBorderlessWindowMask]".  This implies that a borderless window
     * shouldn't have any other styles than NSBorderlessWindowMask.
     */
    if (!(features & NSTitledWindowMask))
      features = NSBorderlessWindowMask;
    
    /* 
     * We pass a content area rect to initialize the native Cocoa window. The
     * content rect we give is the same size as the size we're given by gecko.
     * The origin we're given for non-popup windows is moved down by the height
     * of the menu bar so that an origin of (0,100) from gecko puts the window
     * 100 pixels below the top of the available desktop area. We also move the
     * origin down by the height of a title bar if it exists. This is so the
     * origin that gecko gives us for the top-left of  the window turns out to
     * be the top-left of the window we create. This is how it was done in
     * Carbon. If it ought to be different we'll probably need to look at all
     * the callers.
     *
     * Note: This means that if you put a secondary screen on top of your main
     * screen and open a window in the top screen, it'll be incorrectly shifted
     * down by the height of the menu bar. Same thing would happen in Carbon.
     *
     * Note: If you pass a rect with 0,0 for an origin, the window ends up in a
     * weird place for some reason. This stops that without breaking popups.
     */
    NSRect rect = nsCocoaUtils::GeckoRectToCocoaRect(aRect);
    
    // compensate for difference between frame and content area height (e.g. title bar)
    NSRect newWindowFrame = [NSWindow frameRectForContentRect:rect styleMask:features];

    rect.origin.y -= (newWindowFrame.size.height - rect.size.height);
    
    if (mWindowType != eWindowType_popup)
      rect.origin.y -= ::GetMBarHeight();

    // NSLog(@"Top-level window being created at Cocoa rect: %f, %f, %f, %f\n",
    //       rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);

    Class windowClass = [NSWindow class];
    // If we have a titlebar on a top-level window, we want to be able to control the 
    // titlebar color (for unified windows), so use the special ToolbarWindow class. 
    // Note that we need to check the window type because we mark sheets sheets as 
    // having titlebars.
    if (mWindowType == eWindowType_toplevel &&
        (features & NSTitledWindowMask))
      windowClass = [ToolbarWindow class];
    // If we're a popup window we need to use the PopupWindow class.
    else if (mWindowType == eWindowType_popup)
      windowClass = [PopupWindow class];
    // If we're a non-popup borderless window we need to use the
    // BorderlessWindow class.
    else if (features == NSBorderlessWindowMask)
      windowClass = [BorderlessWindow class];

    // Create the window
    mWindow = [[windowClass alloc] initWithContentRect:rect styleMask:features 
                                   backing:NSBackingStoreBuffered defer:YES];
    
    if (mWindowType == eWindowType_popup) {
      [mWindow setAlphaValue:POPUP_DEFAULT_TRANSPARENCY];
      [mWindow setLevel:NSPopUpMenuWindowLevel];
      [mWindow setHasShadow:YES];

      // we need to make our content view a ChildView
      mPopupContentView = new nsChildView();
      if (mPopupContentView) {
        NS_ADDREF(mPopupContentView);

        nsIWidget* thisAsWidget = static_cast<nsIWidget*>(this);
        mPopupContentView->StandardCreate(thisAsWidget, aRect, aHandleEventFunction,
                                          aContext, aAppShell, aToolkit, nsnull, nsnull);

        ChildView* newContentView = (ChildView*)mPopupContentView->GetNativeData(NS_NATIVE_WIDGET);
        [mWindow setContentView:newContentView];
      }
    }
    else if (mWindowType == eWindowType_invisible) {
      [mWindow setLevel:kCGDesktopWindowLevelKey];
    }

    [mWindow setBackgroundColor:[NSColor whiteColor]];
    [mWindow setContentMinSize:NSMakeSize(60, 60)];
    [mWindow setReleasedWhenClosed:NO];

    // setup our notification delegate. Note that setDelegate: does NOT retain.
    mDelegate = [[WindowDelegate alloc] initWithGeckoWindow:this];
    [mWindow setDelegate:mDelegate];
    
    mWindowMadeHere = PR_TRUE;
  }
  else {
    mWindow = (NSWindow*)aNativeWindow;
    mVisible = PR_TRUE;
  }
  
  return NS_OK;
}


// Create a nsCocoaWindow using a native window provided by the application
NS_IMETHODIMP nsCocoaWindow::Create(nsNativeWidget aNativeWindow,
                      const nsRect &aRect,
                      EVENT_CALLBACK aHandleEventFunction,
                      nsIDeviceContext *aContext,
                      nsIAppShell *aAppShell,
                      nsIToolkit *aToolkit,
                      nsWidgetInitData *aInitData)
{
  return(StandardCreate(nsnull, aRect, aHandleEventFunction, aContext,
                        aAppShell, aToolkit, aInitData, aNativeWindow));
}


NS_IMETHODIMP nsCocoaWindow::Create(nsIWidget* aParent,
                      const nsRect &aRect,
                      EVENT_CALLBACK aHandleEventFunction,
                      nsIDeviceContext *aContext,
                      nsIAppShell *aAppShell,
                      nsIToolkit *aToolkit,
                      nsWidgetInitData *aInitData)
{
  return(StandardCreate(aParent, aRect, aHandleEventFunction, aContext,
                        aAppShell, aToolkit, aInitData, nsnull));
}


NS_IMETHODIMP nsCocoaWindow::Destroy()
{
  if (mPopupContentView)
    mPopupContentView->Destroy();

  nsBaseWidget::OnDestroy();
  nsBaseWidget::Destroy();

  return NS_OK;
}


void* nsCocoaWindow::GetNativeData(PRUint32 aDataType)
{
  void* retVal = nsnull;
  
  switch (aDataType) {
    // to emulate how windows works, we always have to return a NSView
    // for NS_NATIVE_WIDGET
    case NS_NATIVE_WIDGET:
    case NS_NATIVE_DISPLAY:
      retVal = [mWindow contentView];
      break;
      
    case NS_NATIVE_WINDOW:
      retVal = mWindow;
      break;
      
    case NS_NATIVE_GRAPHIC:
      // There isn't anything that makes sense to return here,
      // and it doesn't matter so just return nsnull.
      NS_ASSERTION(0, "Requesting NS_NATIVE_GRAPHIC on a top-level window!");
      break;
  }

  return retVal;
}


NS_IMETHODIMP nsCocoaWindow::IsVisible(PRBool & aState)
{
  aState = mVisible;
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::SetModal(PRBool aState)
{
  mModal = aState;
  if (aState) {
    ++gXULModalLevel;
  } else {
    --gXULModalLevel;
    NS_ASSERTION(gXULModalLevel >= 0, "Mismatched call to nsCocoaWindow::SetModal(PR_FALSE)!");
  }
  return NS_OK;
}


// Hide or show this window
NS_IMETHODIMP nsCocoaWindow::Show(PRBool bState)
{
  nsIWidget* parentWidget = mParent;
  nsCOMPtr<nsPIWidgetCocoa> piParentWidget(do_QueryInterface(parentWidget));
  NSWindow* nativeParentWindow = (parentWidget) ?
    (NSWindow*)parentWidget->GetNativeData(NS_NATIVE_WINDOW) : nil;
  
  if (bState && !mBounds.IsEmpty()) {
    if (mWindowType == eWindowType_sheet) {
      // bail if no parent window (its basically what we do in Carbon)
      if (!nativeParentWindow || !piParentWidget)
        return NS_ERROR_FAILURE;

      NSWindow* topNonSheetWindow = nativeParentWindow;
      
      // If this sheet is the child of another sheet, hide the parent so that
      // this sheet can be displayed. Leave the parent mSheetNeedsShow alone,
      // that is only used to handle sibling sheet contention. The parent will
      // return once there are no more child sheets.
      PRBool parentIsSheet = PR_FALSE;
      if (NS_SUCCEEDED(piParentWidget->GetIsSheet(&parentIsSheet)) &&
          parentIsSheet) {
        piParentWidget->GetSheetWindowParent(&topNonSheetWindow);
        [NSApp endSheet:nativeParentWindow];
        [nativeParentWindow setAcceptsMouseMovedEvents:NO];
      }

      nsCocoaWindow* sheetShown = nsnull;
      if (NS_SUCCEEDED(piParentWidget->GetChildSheet(PR_TRUE, &sheetShown)) &&
          (!sheetShown || sheetShown == this)) {
        // If this sheet is already the sheet actually being shown, don't
        // tell it to show again. Otherwise the number of calls to
        // [NSApp beginSheet...] won't match up with [NSApp endSheet...].
        if (![mWindow isSheet]) {
          mVisible = PR_TRUE;
          mSheetNeedsShow = PR_FALSE;
          mSheetWindowParent = topNonSheetWindow;
          [[mSheetWindowParent delegate] sendFocusEvent:NS_LOSTFOCUS];
          [[mSheetWindowParent delegate] sendFocusEvent:NS_DEACTIVATE];
          [mWindow setAcceptsMouseMovedEvents:YES];
          [NSApp beginSheet:mWindow
             modalForWindow:mSheetWindowParent
              modalDelegate:mDelegate
             didEndSelector:@selector(didEndSheet:returnCode:contextInfo:)
                contextInfo:mSheetWindowParent];
          [[mWindow delegate] sendFocusEvent:NS_GOTFOCUS];
          [[mWindow delegate] sendFocusEvent:NS_ACTIVATE];
          SendSetZLevelEvent();
        }
      }
      else {
        // A sibling of this sheet is active, don't show this sheet yet.
        // When the active sheet hides, its brothers and sisters that have
        // mSheetNeedsShow set will have their opportunities to display.
        mSheetNeedsShow = PR_TRUE;
      }
    }
    else if (mWindowType == eWindowType_popup) {
      mVisible = PR_TRUE;
      // If a popup window is shown after being hidden, it needs to be "reset"
      // for it to receive any mouse events aside from mouse-moved events
      // (because it was removed from the "window cache" when it was hidden
      // -- see below).  Setting the window number to -1 and then back to its
      // original value seems to accomplish this.  The idea was "borrowed"
      // from the Java Embedding Plugin.
      int windowNumber = [mWindow windowNumber];
      [mWindow _setWindowNumber:-1];
      [mWindow _setWindowNumber:windowNumber];
      [mWindow setAcceptsMouseMovedEvents:YES];
      [mWindow orderFront:nil];
      SendSetZLevelEvent();
      // If our popup window is a non-native context menu, tell the OS (and
      // other programs) that a menu has opened.  This is how the OS knows to
      // close other programs' context menus when ours open.
      if ([mWindow isKindOfClass:[PopupWindow class]] &&
          [(PopupWindow*) mWindow isContextMenu]) {
        [[NSDistributedNotificationCenter defaultCenter]
          postNotificationName:@"com.apple.HIToolbox.beginMenuTrackingNotification"
                        object:@"org.mozilla.gecko.PopupWindow"];
      }

      // if a parent was supplied, set its child window. This will cause the
      // child window to appear above the parent and move when the parent
      // does. Setting this needs to happen after the _setWindowNumber calls
      // above, otherwise the window doesn't focus properly.
      if (nativeParentWindow)
        [nativeParentWindow addChildWindow:mWindow
                            ordered:NSWindowAbove];
    }
    else {
      mVisible = PR_TRUE;
      [mWindow setAcceptsMouseMovedEvents:YES];
      [mWindow makeKeyAndOrderFront:nil];
      SendSetZLevelEvent();
    }
  }
  else {
    // roll up any popups if a top-level window is going away
    if (mWindowType == eWindowType_toplevel)
      RollUpPopups();

    // now get rid of the window/sheet
    if (mWindowType == eWindowType_sheet) {
      if (mVisible) {
        mVisible = PR_FALSE;

        // get sheet's parent *before* hiding the sheet (which breaks the linkage)
        NSWindow* sheetParent = mSheetWindowParent;
        
        // hide the sheet
        [NSApp endSheet:mWindow];
        
        [mWindow setAcceptsMouseMovedEvents:NO];

        [[mWindow delegate] sendFocusEvent:NS_LOSTFOCUS];
        [[mWindow delegate] sendFocusEvent:NS_DEACTIVATE];

        nsCocoaWindow* siblingSheetToShow = nsnull;
        PRBool parentIsSheet = PR_FALSE;
        
        if (nativeParentWindow && piParentWidget &&
            NS_SUCCEEDED(piParentWidget->GetChildSheet(PR_FALSE, &siblingSheetToShow)) &&
            siblingSheetToShow) {
          // First, give sibling sheets an opportunity to show.
          siblingSheetToShow->Show(PR_TRUE);
        }
        else if (nativeParentWindow && piParentWidget &&
                 NS_SUCCEEDED(piParentWidget->GetIsSheet(&parentIsSheet)) &&
                 parentIsSheet) {
          // If there are no sibling sheets, but the parent is a sheet, restore
          // it.  It wasn't sent any deactivate events when it was hidden, so
          // don't call through Show, just let the OS put it back up.
          [nativeParentWindow setAcceptsMouseMovedEvents:YES];
          [NSApp beginSheet:nativeParentWindow
             modalForWindow:sheetParent
              modalDelegate:[nativeParentWindow delegate]
             didEndSelector:@selector(didEndSheet:returnCode:contextInfo:)
                contextInfo:sheetParent];
        }
        else {
          // Sheet, that was hard.  No more siblings or parents, going back
          // to a real window.
          [sheetParent makeKeyAndOrderFront:nil];
          [sheetParent setAcceptsMouseMovedEvents:YES];
        }
        SendSetZLevelEvent();
      }
      else if (mSheetNeedsShow) {
        // This is an attempt to hide a sheet that never had a chance to
        // be shown. There's nothing to do other than make sure that it
        // won't show.
        mSheetNeedsShow = PR_FALSE;
      }
    }
    else {
      // If the window is a popup window with a parent window we need to
      // unhook it here before ordering it out. When you order out the child
      // of a window it hides the parent window.
      if (mWindowType == eWindowType_popup && nativeParentWindow)
        [nativeParentWindow removeChildWindow:mWindow];

      [mWindow orderOut:nil];
      // Unless it's explicitly removed from NSApp's "window cache", a popup
      // window will keep receiving mouse-moved events even after it's been
      // "ordered out" (instead of the browser window that was underneath it,
      // until you click on that window).  This is bmo bug 378645, but it's
      // surely an Apple bug.  The "window cache" is an undocumented subsystem,
      // all of whose methods are included in the NSWindowCache category of
      // the NSApplication class (in header files generated using class-dump).
      // This workaround was "borrowed" from the Java Embedding Plugin (which
      // uses it for a different purpose).
      if (mWindowType == eWindowType_popup)
        [NSApp _removeWindowFromCache:mWindow];

      // it's very important to turn off mouse moved events when hiding a window, otherwise
      // the windows' tracking rects will interfere with each other. (bug 356528)
      [mWindow setAcceptsMouseMovedEvents:NO];
      mVisible = PR_FALSE;
      // If our popup window is a non-native context menu, tell the OS (and
      // other programs) that a menu has closed.
      if ([mWindow isKindOfClass:[PopupWindow class]] &&
          [(PopupWindow*) mWindow isContextMenu]) {
        [[NSDistributedNotificationCenter defaultCenter]
          postNotificationName:@"com.apple.HIToolbox.endMenuTrackingNotification"
                        object:@"org.mozilla.gecko.PopupWindow"];
      }
    }
  }
  
  if (mPopupContentView)
      mPopupContentView->Show(bState);

  return NS_OK;
}


void nsCocoaWindow::MakeBackgroundTransparent(PRBool aTransparent)
{
  BOOL currentTransparency = ![mWindow isOpaque];
  if (aTransparent != currentTransparency) {
    // Popups have an alpha value we need to toggle.
    if (mWindowType == eWindowType_popup) {
      [mWindow setAlphaValue:(aTransparent ? 1.0 : POPUP_DEFAULT_TRANSPARENCY)];
    }
    [mWindow setOpaque:!aTransparent];
    [mWindow setBackgroundColor:(aTransparent ? [NSColor clearColor] : [NSColor whiteColor])];
    [mWindow setHasShadow:!aTransparent];
  }
}


NS_IMETHODIMP nsCocoaWindow::GetHasTransparentBackground(PRBool& aTransparent)
{
  aTransparent = ![mWindow isOpaque];   
  return NS_OK;
}


// This is called from nsMenuPopupFrame when making a popup transparent.
// For other window types, nsChildView::SetHasTransparentBackground is used.
NS_IMETHODIMP nsCocoaWindow::SetHasTransparentBackground(PRBool aTransparent)
{
  BOOL currentTransparency = ![mWindow isOpaque];
  if (aTransparent != currentTransparency) {
    // Take care of window transparency
    MakeBackgroundTransparent(aTransparent);
    // Make sure our content view is also transparent
    if (mPopupContentView) {
      ChildView *childView = (ChildView*)mPopupContentView->GetNativeData(NS_NATIVE_WIDGET);
      if (childView) {
        [childView setTransparent:aTransparent];
      }
    }
  }
  return NS_OK;
}


NS_METHOD nsCocoaWindow::AddMouseListener(nsIMouseListener * aListener)
{
  nsBaseWidget::AddMouseListener(aListener);

  if (mPopupContentView)
    mPopupContentView->AddMouseListener(aListener);

  return NS_OK;
}


NS_METHOD nsCocoaWindow::AddEventListener(nsIEventListener * aListener)
{
  nsBaseWidget::AddEventListener(aListener);

  if (mPopupContentView)
    mPopupContentView->AddEventListener(aListener);

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Enable(PRBool aState)
{
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::IsEnabled(PRBool *aState)
{
  if (aState)
    *aState = PR_TRUE;
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::ConstrainPosition(PRBool aAllowSlop,
                                               PRInt32 *aX, PRInt32 *aY)
{
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Move(PRInt32 aX, PRInt32 aY)
{
  if (!mWindow || (mBounds.x == aX && mBounds.y == aY))
    return NS_OK;

  // The point we have is in Gecko coordinates (origin top-left). Convert
  // it to Cocoa ones (origin bottom-left).
  NSPoint coord = {aX, nsCocoaUtils::FlippedScreenY(aY)};
  [mWindow setFrameTopLeftPoint:coord];

  return NS_OK;
}


// Position the window behind the given window
NS_METHOD nsCocoaWindow::PlaceBehind(nsTopLevelWidgetZPlacement aPlacement,
                                     nsIWidget *aWidget, PRBool aActivate)
{
  return NS_OK;
}


// Note bug 278777, we need to update state when the window is unminimized
// from the dock by users.
NS_METHOD nsCocoaWindow::SetSizeMode(PRInt32 aMode)
{
  PRInt32 previousMode;
  nsBaseWidget::GetSizeMode(&previousMode);

  nsresult rv = nsBaseWidget::SetSizeMode(aMode);
  NS_ENSURE_SUCCESS(rv, rv);

  if (aMode == nsSizeMode_Normal) {
    if (previousMode == nsSizeMode_Maximized && [mWindow isZoomed])
      [mWindow zoom:nil];
  }
  else if (aMode == nsSizeMode_Minimized) {
    if (![mWindow isMiniaturized])
      [mWindow miniaturize:nil];
  }
  else if (aMode == nsSizeMode_Maximized) {
    if ([mWindow isMiniaturized])
      [mWindow deminiaturize:nil];
    if (![mWindow isZoomed])
      [mWindow zoom:nil];
  }

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Resize(PRInt32 aX, PRInt32 aY, PRInt32 aWidth, PRInt32 aHeight, PRBool aRepaint)
{
  if (!WindowSizeAllowed(aWidth, aHeight))
    return NS_ERROR_FAILURE;

  nsRect windowBounds(nsCocoaUtils::CocoaRectToGeckoRect([mWindow frame]));
  BOOL isMoving = (windowBounds.x != aX || windowBounds.y != aY);
  BOOL isResizing = (windowBounds.width != aWidth || windowBounds.height != aHeight);

  if (IsResizing() || !mWindow || (!isMoving && !isResizing))
    return NS_OK;

  nsRect geckoRect(aX, aY, aWidth, aHeight);
  NSRect newFrame = nsCocoaUtils::GeckoRectToCocoaRect(geckoRect);

  // We have to report the size event -first-, to make sure that content
  // repositions itself.  Cocoa views are anchored at the bottom left,
  // so if we don't do this our child view will end up being stuck in the
  // wrong place during a resize.
  if (isResizing)
    ReportSizeEvent(&newFrame);

  StartResizing();
  // We ignore aRepaint -- we have to call display:YES, otherwise the
  // title bar doesn't immediately get repainted and is displayed in
  // the wrong place, leading to a visual jump.
  [mWindow setFrame:newFrame display:YES];
  StopResizing();

  // now, check whether we got the frame that we wanted
  NSRect actualFrame = [mWindow frame];
  if (newFrame.size.width != actualFrame.size.width || newFrame.size.height != actualFrame.size.height) {
    // We didn't; the window must have been too big or otherwise invalid.
    // Report -another- resize in this case, to make sure things are in
    // the right place.  This will cause some visual jitter, but
    // shouldn't happen often.
    ReportSizeEvent();
  }

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Resize(PRInt32 aWidth, PRInt32 aHeight, PRBool aRepaint)
{
  if (!WindowSizeAllowed(aWidth, aHeight))
    return NS_ERROR_FAILURE;

  nsRect windowBounds(nsCocoaUtils::CocoaRectToGeckoRect([mWindow frame]));
  return Resize(windowBounds.x, windowBounds.y, aWidth, aHeight, aRepaint);
}


NS_IMETHODIMP nsCocoaWindow::GetScreenBounds(nsRect &aRect)
{
  nsRect windowFrame = nsCocoaUtils::CocoaRectToGeckoRect([mWindow frame]);
  aRect.x = windowFrame.x;
  aRect.y = windowFrame.y;
  aRect.width = windowFrame.width;
  aRect.height = windowFrame.height;
  // printf("GetScreenBounds: output: %d,%d,%d,%d\n", aRect.x, aRect.y, aRect.width, aRect.height);
  return NS_OK;
}


PRBool nsCocoaWindow::OnPaint(nsPaintEvent &event)
{
  return PR_TRUE; // don't dispatch the update event
}


NS_IMETHODIMP nsCocoaWindow::SetTitle(const nsAString& aTitle)
{
  const nsString& strTitle = PromiseFlatString(aTitle);
  NSString* title = [NSString stringWithCharacters:strTitle.get() length:strTitle.Length()];
  [mWindow setTitle:title];

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Invalidate(const nsRect & aRect, PRBool aIsSynchronous)
{
  if (mPopupContentView)
    return mPopupContentView->Invalidate(aRect, aIsSynchronous);

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Invalidate(PRBool aIsSynchronous)
{
  if (mPopupContentView)
    return mPopupContentView->Invalidate(aIsSynchronous);

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::Update()
{
  if (mPopupContentView)
    return mPopupContentView->Update();

  return NS_OK;
}


// Pass notification of some drag event to Gecko
//
// The drag manager has let us know that something related to a drag has
// occurred in this window. It could be any number of things, ranging from 
// a drop, to a drag enter/leave, or a drag over event. The actual event
// is passed in |aMessage| and is passed along to our event hanlder so Gecko
// knows about it.
PRBool nsCocoaWindow::DragEvent(unsigned int aMessage, Point aMouseGlobal, UInt16 aKeyModifiers)
{
  return PR_FALSE;
}


NS_IMETHODIMP nsCocoaWindow::SendSetZLevelEvent()
{
  nsZLevelEvent event(PR_TRUE, NS_SETZLEVEL, this);

  event.refPoint.x = mBounds.x;
  event.refPoint.y = mBounds.y;
  event.time = PR_IntervalNow();

  event.mImmediate = PR_TRUE;

  nsEventStatus status = nsEventStatus_eIgnore;
  DispatchEvent(&event, status);

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::GetChildSheet(PRBool aShown, nsCocoaWindow** _retval)
{
  nsIWidget* child = GetFirstChild();

  while (child) {
    // find out if this is a top-level window
    nsCOMPtr<nsPIWidgetCocoa> piChildWidget(do_QueryInterface(child));
    if (piChildWidget) {
      // if it implements nsPIWidgetCocoa, it must be an nsCocoaWindow
      nsCocoaWindow* window = static_cast<nsCocoaWindow*>(child);
      nsWindowType type;
      if (NS_SUCCEEDED(window->GetWindowType(type)) &&
          type == eWindowType_sheet) {
        // if it's a sheet, it must be an nsCocoaWindow
        nsCocoaWindow* cocoaWindow = static_cast<nsCocoaWindow*>(window);
        if ((aShown && cocoaWindow->mVisible) ||
            (!aShown && cocoaWindow->mSheetNeedsShow)) {
          *_retval = cocoaWindow;
          return NS_OK;
        }
      }
    }
    child = child->GetNextSibling();
  }

  *_retval = nsnull;

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::GetMenuBar(nsIMenuBar** menuBar)
{
  *menuBar = mMenuBar;
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::GetIsSheet(PRBool* isSheet)
{
  mWindowType == eWindowType_sheet ? *isSheet = PR_TRUE : *isSheet = PR_FALSE;
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::GetSheetWindowParent(NSWindow** sheetWindowParent)
{
  *sheetWindowParent = mSheetWindowParent;
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::ResetInputState()
{
  return NS_OK;
}


// Invokes callback and ProcessEvent methods on Event Listener object
NS_IMETHODIMP 
nsCocoaWindow::DispatchEvent(nsGUIEvent* event, nsEventStatus& aStatus)
{
  aStatus = nsEventStatus_eIgnore;

  nsIWidget* aWidget = event->widget;
  NS_IF_ADDREF(aWidget);

  if (mEventCallback)
    aStatus = (*mEventCallback)(event);

  // Dispatch to event listener if event was not consumed
  if (mEventListener && aStatus != nsEventStatus_eConsumeNoDefault)
    aStatus = mEventListener->ProcessEvent(*event);

  NS_IF_RELEASE(aWidget);

  return NS_OK;
}


void
nsCocoaWindow::ReportSizeEvent(NSRect *r)
{
  NSRect windowFrame;
  if (r)
    windowFrame = [mWindow contentRectForFrameRect:(*r)];
  else
    windowFrame = [mWindow contentRectForFrameRect:[mWindow frame]];
  mBounds.width  = nscoord(windowFrame.size.width);
  mBounds.height = nscoord(windowFrame.size.height);

  nsSizeEvent sizeEvent(PR_TRUE, NS_SIZE, this);
  sizeEvent.time = PR_IntervalNow();

  sizeEvent.windowSize = &mBounds;
  sizeEvent.mWinWidth  = mBounds.width;
  sizeEvent.mWinHeight = mBounds.height;

  nsEventStatus status = nsEventStatus_eIgnore;
  DispatchEvent(&sizeEvent, status);
}


NS_IMETHODIMP nsCocoaWindow::SetMenuBar(nsIMenuBar *aMenuBar)
{
  if (mMenuBar)
    mMenuBar->SetParent(nsnull);
  mMenuBar = aMenuBar;
  
  // We paint the hidden window menu bar if no other menu bar has been painted
  // yet so that some reasonable menu bar is displayed when the app starts up.
  if (!gSomeMenuBarPainted && mMenuBar && (GetHiddenWindowMenuBar() == mMenuBar))
    mMenuBar->Paint();
  
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::SetFocus(PRBool aState)
{
  if (mPopupContentView)
    mPopupContentView->SetFocus(aState);

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::ShowMenuBar(PRBool aShow)
{
  return NS_ERROR_FAILURE;
}


NS_IMETHODIMP nsCocoaWindow::WidgetToScreen(const nsRect& aOldRect, nsRect& aNewRect)
{
  nsRect r = nsCocoaUtils::CocoaRectToGeckoRect([mWindow contentRectForFrameRect:[mWindow frame]]);

  aNewRect.x = r.x + aOldRect.x;
  aNewRect.y = r.y + aOldRect.y;
  aNewRect.width = aOldRect.width;
  aNewRect.height = aOldRect.height;

  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::ScreenToWidget(const nsRect& aOldRect, nsRect& aNewRect)
{
  nsRect r = nsCocoaUtils::CocoaRectToGeckoRect([mWindow contentRectForFrameRect:[mWindow frame]]);

  aNewRect.x = aOldRect.x - r.x;
  aNewRect.y = aOldRect.y - r.y;
  aNewRect.width = aOldRect.width;
  aNewRect.height = aOldRect.height;

  return NS_OK;
}


nsIMenuBar* nsCocoaWindow::GetMenuBar()
{
  return mMenuBar;
}


NS_IMETHODIMP nsCocoaWindow::CaptureRollupEvents(nsIRollupListener * aListener, 
                                                 PRBool aDoCapture, 
                                                 PRBool aConsumeRollupEvent)
{
  NS_IF_RELEASE(gRollupListener);
  NS_IF_RELEASE(gRollupWidget);
  
  if (aDoCapture) {
    gRollupListener = aListener;
    NS_ADDREF(aListener);
    gRollupWidget = this;
    NS_ADDREF(this);
    // Sometimes more than one popup window can be visible at the same time
    // (e.g. nested non-native context menus, or the test case (attachment
    // 276885) for bmo bug 392389, which displays a non-native combo-box in
    // a non-native popup window).  In these cases the "active" popup window
    // (the one that corresponds to the current gRollupWidget) should be the
    // topmost -- the (nested) context menu the mouse is currently over, or
    // the combo-box's drop-down list (when it's displayed).  But (among
    // windows that have the same "level") OS X makes topmost the window that
    // last received a mouse-down event, which may be incorrect (in the combo-
    // box case, it makes topmost the window containing the combo-box).  So
    // here we fiddle with a non-native popup window's level to make sure the
    // "active" one is always above any other non-native popup windows that
    // may be visible.
    if (mWindow && (mWindowType == eWindowType_popup))
      [mWindow setLevel:NSPopUpMenuWindowLevel];
  } else {
    if (mWindow && (mWindowType == eWindowType_popup))
      [mWindow setLevel:NSModalPanelWindowLevel];
  }
  
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::GetAttention(PRInt32 aCycleCount)
{
  [NSApp requestUserAttention:NSInformationalRequest];
  return NS_OK;
}


NS_IMETHODIMP nsCocoaWindow::SetWindowTitlebarColor(nscolor aColor)
{
  // If our cocoa window isn't a ToolbarWindow, something is wrong.
  if (![mWindow isKindOfClass:[ToolbarWindow class]]) {
    // Don't output a warning for the hidden window.
    NS_WARN_IF_FALSE(SameCOMIdentity(GetHiddenWindowWidget(), (nsIWidget*)this),
                     "Calling SetWindowTitlebarColor on window that isn't of the ToolbarWindow class.");
    return NS_ERROR_FAILURE;
  }

  // If they pass a color with a complete transparent alpha component, use the
  // native titlebar appearance.
  if (NS_GET_A(aColor) == 0) {
    [(ToolbarWindow*)mWindow setTitlebarColor:nil]; 
  } else {
    [(ToolbarWindow*)mWindow setTitlebarColor:[NSColor colorWithDeviceRed:NS_GET_R(aColor)/255.0
                                                                    green:NS_GET_G(aColor)/255.0
                                                                     blue:NS_GET_B(aColor)/255.0
                                                                    alpha:NS_GET_A(aColor)/255.0]];
  }
  return NS_OK;
}


gfxASurface* nsCocoaWindow::GetThebesSurface()
{
  if (mPopupContentView)
    return mPopupContentView->GetThebesSurface();
  return nsnull;
}


NS_IMETHODIMP nsCocoaWindow::BeginSecureKeyboardInput()
{
  nsresult rv = nsBaseWidget::BeginSecureKeyboardInput();
  if (NS_SUCCEEDED(rv))
    ::EnableSecureEventInput();
  return rv;
}


NS_IMETHODIMP nsCocoaWindow::EndSecureKeyboardInput()
{
  nsresult rv = nsBaseWidget::EndSecureKeyboardInput();
  if (NS_SUCCEEDED(rv))
    ::DisableSecureEventInput();
  return rv;
}


@implementation WindowDelegate


// We try to find a gecko menu bar to paint. If one does not exist, just paint
// the application menu by itself so that a window doesn't have some other
// window's menu bar.
+ (void)paintMenubarForWindow:(NSWindow*)aWindow
{  
  // make sure we only act on windows that have this kind of
  // object as a delegate
  id windowDelegate = [aWindow delegate];
  if ([windowDelegate class] != [self class])
    return;

  nsCocoaWindow* geckoWidget = [windowDelegate geckoWidget];
  NS_ASSERTION(geckoWidget, "Window delegate not returning a gecko widget!");
  
  nsIMenuBar* geckoMenuBar = geckoWidget->GetMenuBar();
  if (geckoMenuBar) {
    geckoMenuBar->Paint();
  }
  else {
    // sometimes we don't have a native application menu early in launching
    if (!sApplicationMenu)
      return;

    NSMenu* mainMenu = [NSApp mainMenu];
    NS_ASSERTION([mainMenu numberOfItems] > 0, "Main menu does not have any items, something is terribly wrong!");

    // create a new menu bar
    NSMenu* newMenuBar = [[NSMenu alloc] initWithTitle:@"MainMenuBar"];

    // move the application menu from the existing menu bar to the new one
    NSMenuItem* firstMenuItem = [[mainMenu itemAtIndex:0] retain];
    [mainMenu removeItemAtIndex:0];
    [newMenuBar insertItem:firstMenuItem atIndex:0];
    [firstMenuItem release];

    // set our new menu bar as the main menu
    [NSApp setMainMenu:newMenuBar];
    [newMenuBar release];
  }
}


- (id)initWithGeckoWindow:(nsCocoaWindow*)geckoWind
{
  [super init];
  mGeckoWindow = geckoWind;
  return self;
}


- (NSSize)windowWillResize:(NSWindow *)sender toSize:(NSSize)proposedFrameSize
{
  RollUpPopups();
  
  return proposedFrameSize;
}


- (void)windowDidResize:(NSNotification *)aNotification
{
  if (!mGeckoWindow || mGeckoWindow->IsResizing())
    return;

  mGeckoWindow->ReportSizeEvent();
}


- (void)windowDidBecomeMain:(NSNotification *)aNotification
{
  RollUpPopups();

  NSWindow* window = [aNotification object];
  if (window)
    [WindowDelegate paintMenubarForWindow:window];
}


- (void)windowDidResignMain:(NSNotification *)aNotification
{
  RollUpPopups();
  
  nsCOMPtr<nsIMenuBar> hiddenWindowMenuBar = GetHiddenWindowMenuBar();
  if (hiddenWindowMenuBar) {
    // printf("painting hidden window menu bar due to window losing main status\n");
    hiddenWindowMenuBar->Paint();
  }
}


- (void)windowDidBecomeKey:(NSNotification *)aNotification
{
  NSWindow* window = [aNotification object];
  if ([window isSheet])
    [WindowDelegate paintMenubarForWindow:window];
}


- (void)windowDidResignKey:(NSNotification *)aNotification
{
  // If a sheet just resigned key then we should paint the menu bar
  // for whatever window is now main.
  NSWindow* window = [aNotification object];
  if ([window isSheet])
    [WindowDelegate paintMenubarForWindow:[NSApp mainWindow]];
}


- (void)windowWillMove:(NSNotification *)aNotification
{
  RollUpPopups();
}


- (void)windowDidMove:(NSNotification *)aNotification
{
  // Dispatch the move event to Gecko
  nsGUIEvent guiEvent(PR_TRUE, NS_MOVE, mGeckoWindow);
  nsRect rect;
  mGeckoWindow->GetScreenBounds(rect);
  guiEvent.refPoint.x = rect.x;
  guiEvent.refPoint.y = rect.y;
  guiEvent.time = PR_IntervalNow();
  nsEventStatus status = nsEventStatus_eIgnore;
  mGeckoWindow->DispatchEvent(&guiEvent, status);
}


- (BOOL)windowShouldClose:(id)sender
{
  // We only want to send NS_XUL_CLOSE and let gecko close the window
  nsGUIEvent guiEvent(PR_TRUE, NS_XUL_CLOSE, mGeckoWindow);
  guiEvent.time = PR_IntervalNow();
  nsEventStatus status = nsEventStatus_eIgnore;
  mGeckoWindow->DispatchEvent(&guiEvent, status);
  return NO; // gecko will do it
}


- (void)windowWillClose:(NSNotification *)aNotification
{
  RollUpPopups();
}


- (void)windowWillMiniaturize:(NSNotification *)aNotification
{
  RollUpPopups();
}


- (void)sendFocusEvent:(PRUint32)eventType
{
  if (!mGeckoWindow)
    return;

  nsEventStatus status = nsEventStatus_eIgnore;
  nsGUIEvent focusGuiEvent(PR_TRUE, eventType, mGeckoWindow);
  focusGuiEvent.time = PR_IntervalNow();
  mGeckoWindow->DispatchEvent(&focusGuiEvent, status);
}


- (void)didEndSheet:(NSWindow*)sheet returnCode:(int)returnCode contextInfo:(void*)contextInfo
{
  // Note: 'contextInfo' is the window that is the parent of the sheet,
  // we set that in nsCocoaWindow::Show. 'contextInfo' is always the top-level
  // window, not another sheet itself.
  [[sheet delegate] sendFocusEvent:NS_LOSTFOCUS];
  [[sheet delegate] sendFocusEvent:NS_DEACTIVATE];
  [sheet orderOut:self];
  [[(NSWindow*)contextInfo delegate] sendFocusEvent:NS_GOTFOCUS];
  [[(NSWindow*)contextInfo delegate] sendFocusEvent:NS_ACTIVATE];
}


- (nsCocoaWindow*)geckoWidget
{
  return mGeckoWindow;
}

@end


// Category on NSWindow so callers can use the same method on both ToolbarWindows
// and NSWindows for accessing the background color.
@implementation NSWindow(ToolbarWindowCompat)

- (NSColor*)windowBackgroundColor
{
  return [self backgroundColor];
}

@end


// This class allows us to have a "unified toolbar" style window. It works like this:
// 1) We set the window's style to textured.
// 2) Because of this, the background color applies to the entire window, including
//     the titlebar area. For normal textured windows, the default pattern is a 
//    "brushed metal" image.
// 3) We set the background color to a custom NSColor subclass that knows how tall the window is.
//    When -set is called on it, it sets a pattern (with a draw callback) as the fill. In that callback,
//    it paints the the titlebar and background colrs in the correct areas of the context its given,
//    which will fill the entire window (CG will tile it horizontally for us).
//
// This class also provides us with a pill button to show/hide the toolbar.
@implementation ToolbarWindow

- (id)initWithContentRect:(NSRect)aContentRect styleMask:(unsigned int)aStyle backing:(NSBackingStoreType)aBufferingType defer:(BOOL)aFlag
{
  aStyle = aStyle | NSTexturedBackgroundWindowMask;
  if ((self = [super initWithContentRect:aContentRect styleMask:aStyle backing:aBufferingType defer:aFlag])) {
    mColor = [[TitlebarAndBackgroundColor alloc] initWithTitlebarColor:nil
                                                    andBackgroundColor:[NSColor whiteColor]
                                                             forWindow:self];
    // Call the superclass's implementation, to avoid our guard method below.
    [super setBackgroundColor:mColor];

    // setBottomCornerRounded: is a private API call, so we check to make sure
    // we respond to it just in case.
    if ([self respondsToSelector:@selector(setBottomCornerRounded:)])
      [self setBottomCornerRounded:NO];
  }
  return self;
}


- (void)dealloc
{
  [mColor release];
  [super dealloc];
}


// We don't provide our own implementation of -backgroundColor because NSWindow
// looks at it, apparently. This is here to keep someone from messing with our
// custom NSColor subclass.
- (void)setBackgroundColor:(NSColor*)aColor
{
  [mColor setBackgroundColor:aColor];
}


// If you need to get at the background color of the window (in the traditional
// sense) use this method instead.
- (NSColor*)windowBackgroundColor
{
  return [mColor backgroundColor];
}


// Pass nil here to get the default appearance.
- (void)setTitlebarColor:(NSColor*)aColor
{
  [mColor setTitlebarColor:aColor];
}


- (NSColor*)titlebarColor
{
  return [mColor titlebarColor];
}


// Always show the toolbar pill button.
- (BOOL)_hasToolbar
{
  return YES;
}


// Dispatch a toolbar pill button clicked message to Gecko.
- (void)_toolbarPillButtonClicked:(id)sender
{
  nsCocoaWindow *geckoWindow = [[self delegate] geckoWidget];
  nsEventStatus status = nsEventStatus_eIgnore;
  nsGUIEvent guiEvent(PR_TRUE, NS_OS_TOOLBAR, geckoWindow);
  guiEvent.time = PR_IntervalNow();
  geckoWindow->DispatchEvent(&guiEvent, status);
}

// Retain and release "self" to avoid crashes when our widget (and its native
// window) is closed as a result of processing a key equivalent (e.g.
// Command+w or Command+q).  This workaround is only needed for a window
// that can become key.
- (BOOL)performKeyEquivalent:(NSEvent*)theEvent
{
  NSWindow *nativeWindow = [self retain];
  BOOL retval = [super performKeyEquivalent:theEvent];
  [nativeWindow release];
  return retval;
}

@end


// Custom NSColor subclass where most of the work takes place for drawing in
// the titlebar area.
@implementation TitlebarAndBackgroundColor

- (id)initWithTitlebarColor:(NSColor*)aTitlebarColor 
         andBackgroundColor:(NSColor*)aBackgroundColor
                  forWindow:(NSWindow*)aWindow
{
  if ((self = [super init])) {
    mTitlebarColor = [aTitlebarColor retain];
    mBackgroundColor = [aBackgroundColor retain];
    mWindow = aWindow; // weak ref to avoid a cycle
    NSRect frameRect = [aWindow frame];

    // We cant just use a static because the height can vary by window, and we don't
    // want to recalculate this every time we draw. A member is the best solution.
    mTitlebarHeight = frameRect.size.height - [aWindow contentRectForFrameRect:frameRect].size.height;
  }
  return self;
}


- (void)dealloc
{
  [mTitlebarColor release];
  [mBackgroundColor release];
  [super dealloc];
}

// Our pattern width is 1 pixel. CoreGraphics can cache and tile for us.
static const float sPatternWidth = 1.0f;

// These are the start and end greys for the default titlebar gradient.
static const float sLeopardHeaderStartGrey = 196/255.0f;
static const float sLeopardHeaderEndGrey = 149/255.0f;
static const float sLeopardHeaderBackgroundStartGrey = 232/255.0f;
static const float sLeopardHeaderBackgroundEndGrey = 207/255.0f;
static const float sTigerHeaderStartGrey = 239/255.0f;
static const float sTigerHeaderEndGrey = 202/255.0f;

// This is the grey for the border at the bottom of the titlebar.
static const float sLeopardTitlebarBorderGrey = 64/255.0f;
static const float sLeopardTitlebarBackgroundBorderGrey = 134/255.0f;
static const float sTigerTitlebarBorderGrey = 140/255.0f;

// Callback used by the default titlebar shading.
static void headerShading(void* aInfo, const float* aIn, float* aOut)
{
  float startGrey, endGrey;
  BOOL isMain = *(BOOL*)aInfo;
  if (nsToolkit::OnLeopardOrLater()) {
    startGrey = isMain ? sLeopardHeaderStartGrey : sLeopardHeaderBackgroundStartGrey;
    endGrey = isMain ? sLeopardHeaderEndGrey : sLeopardHeaderBackgroundEndGrey;
  }
  else {
    startGrey = sTigerHeaderStartGrey;
    endGrey = sTigerHeaderEndGrey;
  }
  float result = (*aIn) * startGrey + (1.0f - *aIn) * endGrey;
  aOut[0] = result;
  aOut[1] = result;
  aOut[2] = result;
  aOut[3] = 1.0f;
}


// Callback where all of the drawing for this color takes place.
void patternDraw(void* aInfo, CGContextRef aContext)
{
  TitlebarAndBackgroundColor *color = (TitlebarAndBackgroundColor*)aInfo;
  NSColor *titlebarColor = [color titlebarColor];
  NSColor *backgroundColor = [color backgroundColor];
  NSWindow *window = [color window];
  BOOL isMain = [window isMainWindow];

  // Remember: this context is NOT flipped, so the origin is in the bottom left.
  float titlebarHeight = [color titlebarHeight];
  float titlebarOrigin = [window frame].size.height - titlebarHeight;

  [NSGraphicsContext saveGraphicsState];
  [NSGraphicsContext setCurrentContext:[NSGraphicsContext graphicsContextWithGraphicsPort:aContext flipped:NO]];

  // If the titlebar color is nil, draw the default titlebar shading.
  if (!titlebarColor) {
    // On Tiger when the window is not main, we want to draw a pinstripe pattern instead.
    if (!nsToolkit::OnLeopardOrLater() && !isMain) {
      [[NSColor windowBackgroundColor] set];
      NSRectFill(NSMakeRect(0.0f, titlebarOrigin, 1.0f, titlebarOrigin + titlebarHeight));
    } else {
      // Otherwise, create and draw a CGShading that uses headerShading() as its callback.
      CGFunctionCallbacks callbacks = {0, headerShading, NULL};
      CGFunctionRef function = CGFunctionCreate(&isMain, 1, NULL, 4, NULL, &callbacks);
      CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
      CGShadingRef shading = CGShadingCreateAxial(colorSpace, CGPointMake(0.0f, titlebarOrigin),
                                                  CGPointMake(0.0f, titlebarOrigin + titlebarHeight),
                                                  function, NO, NO);
      CGColorSpaceRelease(colorSpace);
      CGFunctionRelease(function);
      CGContextDrawShading(aContext, shading);
      CGShadingRelease(shading);
    }

    // Draw the one pixel border at the bottom of the titlebar.
    float borderGrey = !nsToolkit::OnLeopardOrLater() ? sTigerTitlebarBorderGrey :
      (isMain ? sLeopardTitlebarBorderGrey : sLeopardTitlebarBackgroundBorderGrey);
    [[NSColor colorWithDeviceWhite:borderGrey alpha:1.0f] set];
    NSRectFill(NSMakeRect(0.0f, titlebarOrigin, sPatternWidth, 1.0f));
  } else {
    // if the titlebar color is not nil, just set and draw it normally.
    [titlebarColor set];
    NSRectFill(NSMakeRect(0.0f, titlebarOrigin, sPatternWidth, titlebarHeight));
  }

  // Draw the background color of the window everywhere but where the titlebar is.
  [backgroundColor set];
  NSRectFill(NSMakeRect(0.0f, 0.0f, 1.0f, titlebarOrigin));

  [NSGraphicsContext restoreGraphicsState];
}


- (void)setFill
{
  CGContextRef context = (CGContextRef)[[NSGraphicsContext currentContext] graphicsPort];

  // Set up the pattern to be as tall as our window, and one pixel wide.
  // CoreGraphics can cache and tile us quickly.
  CGPatternCallbacks callbacks = {0, &patternDraw, NULL};
  CGPatternRef pattern = CGPatternCreate(self, CGRectMake(0.0f, 0.0f, sPatternWidth, [mWindow frame].size.height), 
                                         CGAffineTransformIdentity, 1, [mWindow frame].size.height,
                                         kCGPatternTilingConstantSpacing, true, &callbacks);

  // Set the pattern as the fill, which is what we were asked to do. All our
  // drawing will take place in the patternDraw callback.
  CGColorSpaceRef patternSpace = CGColorSpaceCreatePattern(NULL);
  CGContextSetFillColorSpace(context, patternSpace);
  CGColorSpaceRelease(patternSpace);
  float component = 1.0f;
  CGContextSetFillPattern(context, pattern, &component);
  CGPatternRelease(pattern);
}


// Pass nil here to get the default appearance.
- (void)setTitlebarColor:(NSColor*)aColor
{
  [mTitlebarColor autorelease];
  mTitlebarColor = [aColor retain];
}


- (NSColor*)titlebarColor
{
  return mTitlebarColor;
}


- (void)setBackgroundColor:(NSColor*)aColor
{
  [mBackgroundColor autorelease];
  mBackgroundColor = [aColor retain];
}


- (NSColor*)backgroundColor
{
  return mBackgroundColor;
}


- (NSWindow*)window
{
  return mWindow;
}


- (NSString*)colorSpaceName
{
  return NSDeviceRGBColorSpace;
}


- (void)set
{
  [self setFill];
}


- (float)titlebarHeight
{
  return mTitlebarHeight;
}

@end


// This is an internal Apple class, which we need to work around a bug in. It is
// the class responsible for drawing the titlebar for metal windows. It actually
// is a few levels deep in the inhertiance graph, but we don't need to know about
// all its superclasses.
@interface NSGrayFrame : NSObject
+ (void)drawBevel:(NSRect)bevel inFrame:(NSRect)frame topCornerRounded:(BOOL)top;
+ (void)drawBevel:(NSRect)bevel inFrame:(NSRect)frame topCornerRounded:(BOOL)top bottomCornerRounded:(BOOL)bottom;
@end

@implementation NSGrayFrame(DrawingBugWorkaround)

// Work around a bug in this method -- it draws a strange 1px border on the left and
// right edges of a window. We don't want that, so call the similar method defined
// in the superclass.
+ (void)drawBevel:(NSRect)bevel inFrame:(NSRect)frame topCornerRounded:(BOOL)top bottomCornerRounded:(BOOL)bottom
{
  if ([self respondsToSelector:@selector(drawBevel:inFrame:topCornerRounded:)])
    [self drawBevel:bevel inFrame:frame topCornerRounded:top];
}

@end


@implementation PopupWindow

// The OS treats our custom popup windows very strangely -- many mouse events
// sent to them never reach their target NSView objects.  (That these windows
// are borderless and of level NSPopUpMenuWindowLevel may have something to do
// with it.)  The best solution is to pre-empt the OS, as follows.  (All
// events for a given NSWindow object go through its sendEvent: method.)
- (void)sendEvent:(NSEvent *)anEvent
{
  NSView *target = nil;
  NSView *contentView = nil;
  NSEventType type = [anEvent type];
  NSPoint windowLocation = NSZeroPoint;
  switch (type) {
    case NSScrollWheel:
    case NSLeftMouseDown:
    case NSLeftMouseUp:
    case NSRightMouseDown:
    case NSRightMouseUp:
    case NSOtherMouseDown:
    case NSOtherMouseUp:
    case NSMouseMoved:
    case NSLeftMouseDragged:
    case NSRightMouseDragged:
    case NSOtherMouseDragged:
      if ((contentView = [self contentView])) {
        // Since [anEvent window] might not be us, we can't use [anEvent locationInWindow].
        windowLocation = nsCocoaUtils::EventLocationForWindow(anEvent, self);
        target = [contentView hitTest:[contentView convertPoint:windowLocation fromView:nil]];
        // If the hit test failed, the event is targeted here but is not over the window.
        // Target it at the first responder.
        if (!target)
          target = (NSView*)[self firstResponder];
      }
      break;
    default:
      break;
  }
  if (target) {
    switch (type) {
      case NSScrollWheel:
        [target scrollWheel:anEvent];
        break;
      case NSLeftMouseDown:
        [target mouseDown:anEvent];
        // If we're in a context menu we don't want the OS to send the coming
        // NSLeftMouseUp event to NSApp via the window server, but we do want
        // our ChildView to receive an NSLeftMouseUp event (and to send a Gecko
        // NS_MOUSE_BUTTON_UP event to the corresponding nsChildView object).
        // If our NSApp isn't active (i.e. if we're in a context menu raised
        // by a right mouse down event) when it receives the coming NSLeftMouseUp
        // via the window server, our app will (in effect) become partially
        // activated, which has strange side effects:  For example, if another
        // app's window had the focus, that window will lose the focus and the
        // other app's main menu will be completely disabled (though it will
        // continue to be displayed).
        // A side effect of not allowing the coming NSLeftMouseUp event to be
        // sent to NSApp via the window server is that our custom context
        // menus will roll up whenever the user left-clicks on them, whether
        // or not the left-click hit an active menu item.  This is how native
        // context menus behave, but wasn't how our custom context menus
        // behaved previously (on the trunk or e.g. in Firefox 2.0.0.4).
        // If our ChildView's corresponding nsChildView object doesn't
        // dispatch an NS_MOUSE_BUTTON_UP event, none of our active menu items
        // will "work" on an NSLeftMouseUp.
        if (mIsContextMenu && ![NSApp isActive]) {
          NSEvent *newEvent = [NSEvent mouseEventWithType:NSLeftMouseUp
                                                 location:windowLocation
                                            modifierFlags:[anEvent modifierFlags]
                                                timestamp:GetCurrentEventTime()
                                             windowNumber:[self windowNumber]
                                                  context:nil
                                              eventNumber:0
                                               clickCount:1
                                                 pressure:0.0];
          [target mouseUp:newEvent];
          RollUpPopups();
        }
        break;
      case NSLeftMouseUp:
        [target mouseUp:anEvent];
        break;
      case NSRightMouseDown:
        [target rightMouseDown:anEvent];
        break;
      case NSRightMouseUp:
        [target rightMouseUp:anEvent];
        break;
      case NSOtherMouseDown:
        [target otherMouseDown:anEvent];
        break;
      case NSOtherMouseUp:
        [target otherMouseUp:anEvent];
        break;
      case NSMouseMoved:
        [target mouseMoved:anEvent];
        break;
      case NSLeftMouseDragged:
        [target mouseDragged:anEvent];
        break;
      case NSRightMouseDragged:
        [target rightMouseDragged:anEvent];
        break;
      case NSOtherMouseDragged:
        [target otherMouseDragged:anEvent];
        break;
      default:
        [super sendEvent:anEvent];
        break;
    }
  } else {
    [super sendEvent:anEvent];
  }
}


- (id)initWithContentRect:(NSRect)contentRect styleMask:(unsigned int)styleMask
      backing:(NSBackingStoreType)bufferingType defer:(BOOL)deferCreation
{
  mIsContextMenu = false;
  return [super initWithContentRect:contentRect styleMask:styleMask
          backing:bufferingType defer:deferCreation];
}


- (BOOL)isContextMenu
{
  return mIsContextMenu;
}


- (void)setIsContextMenu:(BOOL)flag
{
  mIsContextMenu = flag;
}

@end

// According to Apple's docs on [NSWindow canBecomeKeyWindow] and [NSWindow
// canBecomeMainWindow], windows without a title bar or resize bar can't (by
// default) become key or main.  But if a window can't become key, it can't
// accept keyboard input (bmo bug 393250).  And it should also be possible for
// an otherwise "ordinary" window to become main.  We need to override these
// two methods to make this happen.
@implementation BorderlessWindow

- (BOOL)canBecomeKeyWindow
{
  return YES;
}

// Apple's doc on this method says that the NSWindow class's default is not to
// become main if the window isn't "visible" -- so we should replicate that
// behavior here.  As best I can tell, the [NSWindow isVisible] method is an
// accurate test of what Apple means by "visibility".
- (BOOL)canBecomeMainWindow
{
  if (![self isVisible])
    return NO;
  return YES;
}

// Retain and release "self" to avoid crashes when our widget (and its native
// window) is closed as a result of processing a key equivalent (e.g.
// Command+w or Command+q).  This workaround is only needed for a window
// that can become key.
- (BOOL)performKeyEquivalent:(NSEvent*)theEvent
{
  NSWindow *nativeWindow = [self retain];
  BOOL retval = [super performKeyEquivalent:theEvent];
  [nativeWindow release];
  return retval;
}

@end
