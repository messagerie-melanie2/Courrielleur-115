# -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is mozilla.org code.
#
# The Initial Developer of the Original Code is
# Netscape Communications Corporation.
# Portions created by the Initial Developer are Copyright (C) 1998
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#   Alec Flett <alecf@netscape.com>
#   Ehsan Akhgari <ehsan.akhgari@gmail.com>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****

/**
 * Communicator Shared Utility Library
 * for shared application glue for the Communicator suite of applications
 **/

var goPrefWindow = 0;
var gBidiUI = false;

function getBrowserURL()
{
  return "chrome://browser/content/browser.xul";
}

function goToggleToolbar( id, elementID )
{
  var toolbar = document.getElementById(id);
  var element = document.getElementById(elementID);
  if (toolbar)
  {
    var isHidden = toolbar.hidden;
    toolbar.hidden = !isHidden;
    document.persist(id, 'hidden');
    if (element) {
      element.setAttribute("checked", isHidden ? "true" : "false");
      document.persist(elementID, 'checked');
    }
  }
}

function getTopWin()
{
  var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
                                .getService(Components.interfaces.nsIWindowMediator);
  return windowManager.getMostRecentWindow("navigator:browser");
}

function openTopWin( url )
{
  openUILink(url, {})
}

function getBoolPref ( prefname, def )
{
  try { 
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
                       .getService(Components.interfaces.nsIPrefBranch);
    return pref.getBoolPref(prefname);
  }
  catch(er) {
    return def;
  }
}

// Change focus for this browser window to |aElement|, without focusing the
// window itself.
function focusElement(aElement) {
  // This is a redo of the fix for jag bug 91884
  var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                     .getService(Components.interfaces.nsIWindowWatcher);
  if (window == ww.activeWindow)
    aElement.focus();
  else {
    // set the element in command dispatcher so focus will restore properly
    // when the window does become active
    var cmdDispatcher = document.commandDispatcher;
    if (aElement instanceof Window) {
      cmdDispatcher.focusedWindow = aElement;
      cmdDispatcher.focusedElement = null;
    }
    else if (aElement instanceof Element) {
      cmdDispatcher.focusedWindow = aElement.ownerDocument.defaultView;
      cmdDispatcher.focusedElement = aElement;
    }
  }
}

// openUILink handles clicks on UI elements that cause URLs to load.
function openUILink( url, e, ignoreButton, ignoreAlt, allowKeywordFixup, postData, referrerUrl )
{
  var where = whereToOpenLink(e, ignoreButton, ignoreAlt);
  openUILinkIn(url, where, allowKeywordFixup, postData, referrerUrl);
}


/* whereToOpenLink() looks at an event to decide where to open a link.
 *
 * The event may be a mouse event (click, double-click, middle-click) or keypress event (enter).
 *
 * On Windows, the modifiers are:
 * Ctrl        new tab, selected
 * Shift       new window
 * Ctrl+Shift  new tab, in background
 * Alt         save
 *
 * You can swap Ctrl and Ctrl+shift by toggling the hidden pref
 * browser.tabs.loadBookmarksInBackground (not browser.tabs.loadInBackground, which
 * is for content area links).
 *
 * Middle-clicking is the same as Ctrl+clicking (it opens a new tab) and it is
 * subject to the shift modifier and pref in the same way.
 *
 * Exceptions: 
 * - Alt is ignored for menu items selected using the keyboard so you don't accidentally save stuff.  
 *    (Currently, the Alt isn't sent here at all for menu items, but that will change in bug 126189.)
 * - Alt is hard to use in context menus, because pressing Alt closes the menu.
 * - Alt can't be used on the bookmarks toolbar because Alt is used for "treat this as something draggable".
 * - The button is ignored for the middle-click-paste-URL feature, since it's always a middle-click.
 */
function whereToOpenLink( e, ignoreButton, ignoreAlt )
{
  if (!e)
    e = { shiftKey:false, ctrlKey:false, metaKey:false, altKey:false, button:0 };

  var shift = e.shiftKey;
  var ctrl =  e.ctrlKey;
  var meta =  e.metaKey;
  var alt  =  e.altKey && !ignoreAlt;

  // ignoreButton allows "middle-click paste" to use function without always opening in a new window.
  var middle = !ignoreButton && e.button == 1;
  var middleUsesTabs = getBoolPref("browser.tabs.opentabfor.middleclick", true);

  // Don't do anything special with right-mouse clicks.  They're probably clicks on context menu items.

#ifdef XP_MACOSX
  if (meta || (middle && middleUsesTabs)) {
#else
  if (ctrl || (middle && middleUsesTabs)) {
#endif
    if (shift)
      return "tabshifted";
    else
      return "tab";
  }
  else if (alt) {
    return "save";
  }
  else if (shift || (middle && !middleUsesTabs)) {
    return "window";
  }
  else {
    return "current";
  }
}

/* openUILinkIn opens a URL in a place specified by the parameter |where|.
 *
 * |where| can be:
 *  "current"     current tab            (if there aren't any browser windows, then in a new window instead)
 *  "tab"         new tab                (if there aren't any browser windows, then in a new window instead)
 *  "tabshifted"  same as "tab" but in background if default is to select new tabs, and vice versa
 *  "window"      new window
 *  "save"        save to disk (with no filename hint!)
 *
 * allowThirdPartyFixup controls whether third party services such as Google's
 * I Feel Lucky are allowed to interpret this URL. This parameter may be
 * undefined, which is treated as false.
 */
function openUILinkIn( url, where, allowThirdPartyFixup, postData, referrerUrl )
{
  if (!where || !url)
    return;

  if (where == "save") {
    saveURL(url, null, null, true, null, referrerUrl);
    return;
  }

  var w = getTopWin();

  if (!w || where == "window") {
    openDialog(getBrowserURL(), "_blank", "chrome,all,dialog=no", url,
               null, referrerUrl, postData, allowThirdPartyFixup);
    return;
  }

  var loadInBackground = getBoolPref("browser.tabs.loadBookmarksInBackground", false);

  switch (where) {
  case "current":
    w.loadURI(url, referrerUrl, postData, allowThirdPartyFixup);
    break;
  case "tabshifted":
    loadInBackground = !loadInBackground;
    // fall through
  case "tab":
    var browser = w.getBrowser();
    browser.loadOneTab(url, referrerUrl, null, postData, loadInBackground,
                       allowThirdPartyFixup || false);
    break;
  }

  // Call focusElement(w.content) instead of w.content.focus() to make sure
  // that we don't raise the old window, since the URI we just loaded may have
  // resulted in a new frontmost window (e.g. "javascript:window.open('');").
  focusElement(w.content);
}

// Used as an onclick handler for UI elements with link-like behavior.
// e.g. onclick="checkForMiddleClick(this, event);"
function checkForMiddleClick(node, event)
{
  // We should be using the disabled property here instead of the attribute,
  // but some elements that this function is used with don't support it (e.g.
  // menuitem).
  if (node.getAttribute("disabled") == "true")
    return; // Do nothing

  if (event.button == 1) {
    /* Execute the node's oncommand.
     *
     * XXX: we should use node.oncommand(event) once bug 246720 is fixed.
     */
    var fn = new Function("event", node.getAttribute("oncommand"));
    fn.call(node, event);

    // If the middle-click was on part of a menu, close the menu.
    // (Menus close automatically with left-click but not with middle-click.)
    closeMenus(event.target);
  }
}

// Closes all popups that are ancestors of the node.
function closeMenus(node)
{
  if ("tagName" in node) {
    if (node.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    && (node.tagName == "menupopup" || node.tagName == "popup"))
      node.hidePopup();

    closeMenus(node.parentNode);
  }
}

// Gather all descendent text under given document node.
function gatherTextUnder ( root ) 
{
  var text = "";
  var node = root.firstChild;
  var depth = 1;
  while ( node && depth > 0 ) {
    // See if this node is text.
    if ( node.nodeType == Node.TEXT_NODE ) {
      // Add this text to our collection.
      text += " " + node.data;
    } else if ( node instanceof HTMLImageElement) {
      // If it has an alt= attribute, use that.
      var altText = node.getAttribute( "alt" );
      if ( altText && altText != "" ) {
        text = altText;
        break;
      }
    }
    // Find next node to test.
    // First, see if this node has children.
    if ( node.hasChildNodes() ) {
      // Go to first child.
      node = node.firstChild;
      depth++;
    } else {
      // No children, try next sibling.
      if ( node.nextSibling ) {
        node = node.nextSibling;
      } else {
        // Last resort is our next oldest uncle/aunt.
        node = node.parentNode.nextSibling;
        depth--;
      }
    }
  }
  // Strip leading whitespace.
  text = text.replace( /^\s+/, "" );
  // Strip trailing whitespace.
  text = text.replace( /\s+$/, "" );
  // Compress remaining whitespace.
  text = text.replace( /\s+/g, " " );
  return text;
}

function getShellService()
{
  var shell = null;
  try {
    shell = Components.classes["@mozilla.org/browser/shell-service;1"]
      .getService(Components.interfaces.nsIShellService);
  } catch (e) {dump("*** e = " + e + "\n");}
  return shell;
}

function isBidiEnabled() {
  var rv = false;

  try {
    var localeService = Components.classes["@mozilla.org/intl/nslocaleservice;1"]
                                  .getService(Components.interfaces.nsILocaleService);
    var systemLocale = localeService.getSystemLocale().getCategory("NSILOCALE_CTYPE").substr(0,3);

    switch (systemLocale) {
      case "ar-":
      case "he-":
      case "fa-":
      case "ur-":
      case "syr":
        rv = true;
    }
  } catch (e) {}

  // check the overriding pref
  if (!rv)
    rv = getBoolPref("bidi.browser.ui");

  return rv;
}

function openAboutDialog()
{
#ifdef XP_MACOSX
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("Browser:About");
  if (win)
    win.focus();
  else {
    // XXXmano: define minimizable=no although it does nothing on OS X
    // (see Bug 287162); remove this comment once Bug 287162 is fixed...
    window.open("chrome://browser/content/aboutDialog.xul", "About",
                "chrome, resizable=no, minimizable=no");
  }
#else
  window.openDialog("chrome://browser/content/aboutDialog.xul", "About", "modal,centerscreen,chrome,resizable=no");
#endif
}

function openPreferences(paneID)
{
  var instantApply = getBoolPref("browser.preferences.instantApply", false);
  var features = "chrome,titlebar,toolbar,centerscreen" + (instantApply ? ",dialog=no" : ",modal");

  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("Browser:Preferences");
  if (win) {
    win.focus();
    if (paneID) {
      var pane = win.document.getElementById(paneID);
      win.document.documentElement.showPane(pane);
    }
  }
  else
    openDialog("chrome://browser/content/preferences/preferences.xul",
               "Preferences", features, paneID);
}

/**
 * Opens the release notes page for this version of the application.
 * @param   event
 *          The DOM Event that caused this function to be called, used to
 *          determine where the release notes page should be displayed based
 *          on modifiers (e.g. Ctrl = new tab)
 */
function openReleaseNotes(event)
{
  var formatter = Components.classes["@mozilla.org/toolkit/URLFormatterService;1"]
                            .getService(Components.interfaces.nsIURLFormatter);
  var relnotesURL = formatter.formatURLPref("app.releaseNotesURL");
  
  openUILink(relnotesURL, event, false, true);
}
  
/**
 * Opens the update manager and checks for updates to the application.
 */
function checkForUpdates()
{
  var um = 
      Components.classes["@mozilla.org/updates/update-manager;1"].
      getService(Components.interfaces.nsIUpdateManager);
  var prompter = 
      Components.classes["@mozilla.org/updates/update-prompt;1"].
      createInstance(Components.interfaces.nsIUpdatePrompt);

  // If there's an update ready to be applied, show the "Update Downloaded"
  // UI instead and let the user know they have to restart the browser for
  // the changes to be applied. 
  if (um.activeUpdate && um.activeUpdate.state == "pending")
    prompter.showUpdateDownloaded(um.activeUpdate, false);
  else
    prompter.checkForUpdates();
}

function buildHelpMenu()
{
  // Enable/disable the "Report Web Forgery" menu item.  safebrowsing object
  // may not exist in OSX
  if (typeof safebrowsing != "undefined")
    safebrowsing.setReportPhishingMenu();

  var updates = 
      Components.classes["@mozilla.org/updates/update-service;1"].
      getService(Components.interfaces.nsIApplicationUpdateService);
  var um = 
      Components.classes["@mozilla.org/updates/update-manager;1"].
      getService(Components.interfaces.nsIUpdateManager);

  // Disable the UI if the update enabled pref has been locked by the 
  // administrator or if we cannot update for some other reason
  var checkForUpdates = document.getElementById("checkForUpdates");
  var canUpdate = updates.canUpdate;
  checkForUpdates.setAttribute("disabled", !canUpdate);
  if (!canUpdate)
    return; 

  var strings = document.getElementById("bundle_browser");
  var activeUpdate = um.activeUpdate;
  
  // If there's an active update, substitute its name into the label
  // we show for this item, otherwise display a generic label.
  function getStringWithUpdateName(key) {
    if (activeUpdate && activeUpdate.name)
      return strings.getFormattedString(key, [activeUpdate.name]);
    return strings.getString(key + "Fallback");
  }
  
  // By default, show "Check for Updates..."
  var key = "default";
  if (activeUpdate) {
    switch (activeUpdate.state) {
    case "downloading":
      // If we're downloading an update at present, show the text:
      // "Downloading Firefox x.x..." otherwise we're paused, and show
      // "Resume Downloading Firefox x.x..."
      key = updates.isDownloading ? "downloading" : "resume";
      break;
    case "pending":
      // If we're waiting for the user to restart, show: "Apply Downloaded
      // Updates Now..."
      key = "pending";
      break;
    }
  }
  checkForUpdates.label = getStringWithUpdateName("updatesItem_" + key);
  if (um.activeUpdate && updates.isDownloading)
    checkForUpdates.setAttribute("loading", "true");
  else
    checkForUpdates.removeAttribute("loading");
}

function isElementVisible(aElement)
{
  if (!aElement)
    return false;

  // If aElement or a direct or indirect parent is hidden or collapsed,
  // height, width or both will be 0.
  var bo = aElement.boxObject;
  return (bo.height > 0 && bo.width > 0);
}

function makeURLAbsolute(aBase, aUrl)
{
  // Note:  IO.newURI(aUri) will throw if aUri is not a valid URI
  return IO.newURI(aUrl, null, IO.newURI(aBase)).spec;
}

function getBrowserFromContentWindow(aContentWindow)
{
  var browsers = gBrowser.browsers;
  for (var i = 0; i < browsers.length; i++) {
    if (browsers[i].contentWindow == aContentWindow)
      return browsers[i];
  }
  return null;
}


/**
 * openNewTabWith: opens a new tab with the given URL.
 *
 * @param aURL
 *        The URL to open (as a string).
 * @param aDocument
 *        The document from which the URL came, or null. This is used to set the
 *        referrer header and to do a security check of whether the document is
 *        allowed to reference the URL. If null, there will be no referrer
 *        header and no security check.
 * @param aPostData
 *        Form POST data, or null.
 * @param aEvent
 *        The triggering event (for the purpose of determining whether to open
 *        in the background), or null.
 * @param aAllowThirdPartyFixup
 *        If true, then we allow the URL text to be sent to third party services
 *        (e.g., Google's I Feel Lucky) for interpretation. This parameter may
 *        be undefined in which case it is treated as false.
 * @param [optional] aReferrer
 *        If aDocument is null, then this will be used as the referrer.
 *        There will be no security check.
 */ 
function openNewTabWith(aURL, aDocument, aPostData, aEvent,
                        aAllowThirdPartyFixup, aReferrer)
{
  if (aDocument)
    urlSecurityCheck(aURL, aDocument.nodePrincipal);

  var prefSvc = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
  prefSvc = prefSvc.getBranch(null);

  // should we open it in a new tab?
  var loadInBackground = true;
  try {
    loadInBackground = prefSvc.getBoolPref("browser.tabs.loadInBackground");
  }
  catch(ex) {
  }

  if (aEvent && aEvent.shiftKey)
    loadInBackground = !loadInBackground;

  // As in openNewWindowWith(), we want to pass the charset of the
  // current document over to a new tab. 
  var wintype = document.documentElement.getAttribute("windowtype");
  var originCharset;
  if (wintype == "navigator:browser")
    originCharset = window.content.document.characterSet;

  // open link in new tab
  var referrerURI = aDocument ? aDocument.documentURIObject : aReferrer;
  var browser = top.document.getElementById("content");
  browser.loadOneTab(aURL, referrerURI, originCharset, aPostData,
                     loadInBackground, aAllowThirdPartyFixup || false);
}

function openNewWindowWith(aURL, aDocument, aPostData, aAllowThirdPartyFixup,
                           aReferrer)
{
  if (aDocument)
    urlSecurityCheck(aURL, aDocument.nodePrincipal);

  // if and only if the current window is a browser window and it has a
  // document with a character set, then extract the current charset menu
  // setting from the current document and use it to initialize the new browser
  // window...
  var charsetArg = null;
  var wintype = document.documentElement.getAttribute("windowtype");
  if (wintype == "navigator:browser")
    charsetArg = "charset=" + window.content.document.characterSet;

  var referrerURI = aDocument ? aDocument.documentURIObject : aReferrer;
  window.openDialog(getBrowserURL(), "_blank", "chrome,all,dialog=no",
                    aURL, charsetArg, referrerURI, aPostData,
                    aAllowThirdPartyFixup);
}

/**
 * isValidFeed: checks whether the given data represents a valid feed.
 *
 * @param  aData
 *         An object representing a feed with title, href and type.
 * @param  aPrincipal
 *         The principal of the document, used for security check.
 * @param  aIsFeed
 *         Whether this is already a known feed or not, if true only a security
 *         check will be performed.
 */ 
function isValidFeed(aData, aPrincipal, aIsFeed)
{
  if (!aData || !aPrincipal)
    return false;

  if (!aIsFeed) {
    var type = aData.type && aData.type.toLowerCase();
    type = type.replace(/^\s+|\s*(?:;.*)?$/g, "");

    aIsFeed = (type == "application/rss+xml" ||
               type == "application/atom+xml");

    if (!aIsFeed) {
      // really slimy: general XML types with magic letters in the title
      const titleRegex = /(^|\s)rss($|\s)/i;
      aIsFeed = ((type == "text/xml" || type == "application/rdf+xml" ||
                  type == "application/xml") && titleRegex.test(aData.title));
    }
  }

  if (aIsFeed) {
    try {
      urlSecurityCheck(aData.href, aPrincipal,
                       Components.interfaces.nsIScriptSecurityManager.DISALLOW_INHERIT_PRINCIPAL);
    }
    catch(ex) {
      aIsFeed = false;
    }
  }

  if (type)
    aData.type = type;

  return aIsFeed;
}
