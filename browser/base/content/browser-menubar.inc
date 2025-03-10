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
# The Original Code is Mozilla.org Code.
#
# The Initial Developer of the Original Code is
# Netscape Communications Corporation.
# Portions created by the Initial Developer are Copyright (C) 2001
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
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

       <menubar id="main-menubar" statusbar="statusbar-display"
                style="border:0px;padding:0px;margin:0px;-moz-appearance:none">
            <menu id="file-menu" label="&fileMenu.label;"
                  accesskey="&fileMenu.accesskey;">
              <menupopup id="menu_FilePopup" onpopupshowing="getContentAreaFrameCount();">
                <menuitem label="&newNavigatorCmd.label;"
                          accesskey="&newNavigatorCmd.accesskey;"
                          key="key_newNavigator"
                          command="cmd_newNavigator"/>
                <menuitem command="cmd_newNavigatorTab" key="key_newNavigatorTab"
                          label="&tabCmd.label;" accesskey="&tabCmd.accesskey;"/>
                <menuitem label="&openLocationCmd.label;" accesskey="&openLocationCmd.accesskey;" key="focusURLBar" command="Browser:OpenLocation"/>
                <menuitem label="&openFileCmd.label;" accesskey="&openFileCmd.accesskey;" key="openFileKb" command="Browser:OpenFile"/>
                <menuitem id="menu_closeWindow" hidden="true" command="cmd_closeWindow" key="key_closeWindow" label="&closeWindow.label;" accesskey="&closeWindow.accesskey;"/>
                <menuitem id="menu_close" label="&closeCmd.label;" key="key_close" accesskey="&closeCmd.accesskey;" command="cmd_close"/>
                <menuseparator/>
                <menuitem label="&savePageCmd.label;" accesskey="&savePageCmd.accesskey;" key="key_savePage" command="Browser:SavePage"/>
                <menuitem id="menu_saveFrame" label="&saveFrameCmd.label;" accesskey="&saveFrameCmd.accesskey;" command="Browser:SaveFrame" hidden="true"/>
                <menuitem id="menu_sendLink"  label="&sendPageCmd.label;"  accesskey="&sendPageCmd.accesskey;"  command="Browser:SendLink"/>
                <menuseparator/>
                <menuitem label="&printSetupCmd.label;" accesskey="&printSetupCmd.accesskey;" command="cmd_pageSetup"/>
#ifndef XP_MACOSX
                <menuitem label="&printPreviewCmd.label;" accesskey="&printPreviewCmd.accesskey;" command="cmd_printPreview"/>
#endif
                <menuitem label="&printCmd.label;" accesskey="&printCmd.accesskey;" key="printKb" command="cmd_print"/>
                <menuseparator/>
                <menuitem label="&import.label;" accesskey="&import.accesskey;" oncommand="BrowserImport();"/>
#ifndef XP_MACOSX
                <menuseparator/>
#endif
                <menuitem id="goOfflineMenuitem"
                          label="&goOfflineCmd.label;" accesskey="&goOfflineCmd.accesskey;" 
                          type="checkbox" oncommand="BrowserOffline.toggleOfflineStatus();"/>
                <menuitem id="menu_FileQuitItem" 
#ifdef XP_WIN
        label="&quitApplicationCmdWin.label;"
        accesskey="&quitApplicationCmdWin.accesskey;"
#else
#ifdef XP_MACOSX
        label="&quitApplicationCmdMac.label;"
        key="key_quitApplicationCmdMac"
#else
        label="&quitApplicationCmd.label;"
        accesskey="&quitApplicationCmd.accesskey;"
#endif
#endif
        oncommand="goQuitApplication();"/>
              </menupopup>
            </menu>
  
            <menu id="edit-menu" label="&editMenu.label;"
                  accesskey="&editMenu.accesskey;">
              <menupopup id="menu_EditPopup">
                <menuitem label="&undoCmd.label;"
                          key="key_undo"
                          accesskey="&undoCmd.accesskey;"
                          command="cmd_undo"/>
                <menuitem label="&redoCmd.label;"
                          key="key_redo"
                          accesskey="&redoCmd.accesskey;"
                          command="cmd_redo"/>
                <menuseparator/>
                <menuitem label="&cutCmd.label;"
                          key="key_cut"
                          accesskey="&cutCmd.accesskey;"
                          command="cmd_cut"/>
                <menuitem label="&copyCmd.label;"
                          key="key_copy"
                          accesskey="&copyCmd.accesskey;"
                          command="cmd_copy"/>
                <menuitem label="&pasteCmd.label;"
                          key="key_paste"
                          accesskey="&pasteCmd.accesskey;"
                          command="cmd_paste"/>
                <menuitem label="&deleteCmd.label;"
                          key="key_delete"
                          accesskey="&deleteCmd.accesskey;"
                          command="cmd_delete"/>
                <menuseparator/>
                <menuitem label="&selectAllCmd.label;"
                          key="key_selectAll"
                          accesskey="&selectAllCmd.accesskey;"
                          command="cmd_selectAll"/>
                <menuseparator/>
                <menuitem id="menu_find" label="&findOnCmd.label;" accesskey="&findOnCmd.accesskey;" key="key_find" command="cmd_find"/>
                <menuitem label="&findAgainCmd.label;" accesskey="&findAgainCmd.accesskey;" key="key_findAgain" command="cmd_findAgain"/>
                <menuseparator hidden="true" id="textfieldDirection-separator"/>
                <menuitem id="textfieldDirection-swap"
                          command="cmd_switchTextDirection"
                          key="key_switchTextDirection"
                          label="&bidiSwitchTextDirectionItem.label;"
                          accesskey="&bidiSwitchTextDirectionItem.accesskey;"
                          hidden="true"/>
#ifdef XP_UNIX
#ifndef XP_MACOSX
                <menuseparator/>
                <menuitem id="menu_preferences"
                          label="&preferencesCmdUnix.label;"
                          accesskey="&preferencesCmdUnix.accesskey;"
                          oncommand="openPreferences();"/>
#endif
#endif
              </menupopup>
            </menu>
  
            <menu id="view-menu" label="&viewMenu.label;" accesskey="&viewMenu.accesskey;">
              <menupopup id="menu_viewPopup">
                <menu id="viewToolbarsMenu" label="&viewToolbarsMenu.label;" accesskey="&viewToolbarsMenu.accesskey;"
                      onpopupshowing="onViewToolbarsPopupShowing(event);">
                  <menupopup>
                    <menuseparator/>
                      <menuitem label="&viewCustomizeToolbar.label;" accesskey="&viewCustomizeToolbar.accesskey;"
                                command="cmd_CustomizeToolbars"/>             
                  </menupopup>
                </menu>
                <menuitem id="toggle_taskbar" label="&taskbarCmd.label;" accesskey="&taskbarCmd.accesskey;" type="checkbox" command="cmd_toggleTaskbar" checked="true" />
                <menu id="viewSidebarMenuMenu"
                      label="&viewSidebarMenu.label;"
                      accesskey="&viewSidebarMenu.accesskey;">
                  <menupopup id="viewSidebarMenu">
                    <menuitem key="viewBookmarksSidebarKb" observes="viewBookmarksSidebar" accesskey="&bookmarksSidebarCmd.accesskey;"/>
                    <menuitem key="key_gotoHistory" observes="viewHistorySidebar" label="&historyButton.label;" accesskey="&historySidebarCmd.accesskey;"/>
                  </menupopup>
                </menu>
                <menuseparator/>
                <menuitem label="&stopCmd.label;"
                          accesskey="&stopCmd.accesskey;"
                          command="Browser:Stop"
#ifdef XP_MACOSX
                          key="key_stop_mac"/>
#else
                          key="key_stop"/>
#endif
                <menuitem label="&reloadCmd.label;" accesskey="&reloadCmd.accesskey;" command="Browser:Reload" key="key_reload"/>
                <menuseparator/>
                <menu id="viewFullZoomMenu" label="&fullZoom.label;" accesskey="&fullZoom.accesskey;">
                  <menupopup>
                    <menuitem key="key_fullZoomEnlarge" label="&fullZoomEnlargeCmd.label;" accesskey="&fullZoomEnlargeCmd.accesskey;"
                              command="cmd_fullZoomEnlarge"/>
                    <menuitem key="key_fullZoomReduce"  label="&fullZoomReduceCmd.label;"  accesskey="&fullZoomReduceCmd.accesskey;"
                              command="cmd_fullZoomReduce"/>
                    <menuseparator/>
                    <menuitem key="key_fullZoomReset" label="&fullZoomResetCmd.label;" accesskey="&fullZoomResetCmd.accesskey;"
                              command="cmd_fullZoomReset"/>
                  </menupopup>
                </menu>
                <menu id="pageStyleMenu" label="&pageStyleMenu.label;" accesskey="&pageStyleMenu.accesskey;" observes="isImage">
                  <menupopup onpopupshowing="stylesheetFillPopup(this);"
                             oncommand="stylesheetSwitchAll(window.content, event.target.getAttribute('data')); setStyleDisabled(false);">
                    <menuitem label="&pageStyleNoStyle.label;" accesskey="&pageStyleNoStyle.accesskey;"
                              oncommand="setStyleDisabled(true); event.stopPropagation();" type="radio"/>
                    <menuitem label="&pageStylePersistentOnly.label;" accesskey="&pageStylePersistentOnly.accesskey;" type="radio" checked="true"/>
                    <menuseparator/>
                  </menupopup>
                </menu>
                <menu id="charsetMenu"
                      label="&charsetMenu.label;"
                      accesskey="&charsetMenu.accesskey;"
                      datasources="rdf:charset-menu"
                      ref="NC:BrowserCharsetMenuRoot"
                      oncommand="MultiplexHandler(event)"
                      onpopupshowing="CreateMenu('browser');UpdateMenus(event)"
                      onpopupshown="CreateMenu('more-menu');"
                      observes="isImage">
                    <template>
                        <rule rdf:type="http://home.netscape.com/NC-rdf#BookmarkSeparator">
                            <menupopup>
                            <menuseparator uri="..." />
                            </menupopup>
                        </rule>
                        <rule>
                            <menupopup>
                            <menuitem type="radio" name="charsetGroup" checked="rdf:http://home.netscape.com/NC-rdf#Checked" uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                            </menupopup>
                        </rule>
                    </template>
      
                    <menupopup>
                    <menu label="&charsetMenuAutodet.label;" accesskey="&charsetMenuAutodet.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserAutodetMenuRoot">
                        <template>
                            <rule rdf:type="http://home.netscape.com/NC-rdf#CharsetDetector">
                                <menupopup>
                                <menuitem type="radio" name="detectorGroup" checked="rdf:http://home.netscape.com/NC-rdf#Checked" uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                </menupopup>
                            </rule>
                        </template>
                        <menupopup>
                        </menupopup>
                    </menu>
                    <menu label="&charsetMenuMore.label;" accesskey="&charsetMenuMore.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMoreCharsetMenuRoot">
                        <template>
                            <rule>
                                <menupopup>
                                <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                </menupopup>
                            </rule>
                        </template>
                        <menupopup>
                            <menu label="&charsetMenuMore1.label;" accesskey="&charsetMenuMore1.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMore1CharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menu label="&charsetMenuMore2.label;" accesskey="&charsetMenuMore2.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMore2CharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menu label="&charsetMenuMore3.label;" accesskey="&charsetMenuMore3.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMore3CharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menu label="&charsetMenuMore4.label;" accesskey="&charsetMenuMore4.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMore4CharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menu label="&charsetMenuMore5.label;" accesskey="&charsetMenuMore5.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserMore5CharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menu label="&charsetMenuUnicode.label;" accesskey="&charsetMenuUnicode.accesskey;" datasources="rdf:charset-menu" ref="NC:BrowserUnicodeCharsetMenuRoot">
                                <template>
                                    <rule>
                                        <menupopup>
                                        <menuitem uri="..." label="rdf:http://home.netscape.com/NC-rdf#Name"/>
                                        </menupopup>
                                    </rule>
                                </template>
                                <menupopup>
                                </menupopup>
                            </menu>
                            <menuseparator />
                        </menupopup>
                    </menu>
                    <menuitem name="charsetCustomize" accesskey="&charsetCustomize.accesskey;" label="&charsetCustomize.label;" oncommand="window.openDialog('chrome://global/content/customizeCharset.xul','PrefWindow', 'chrome,modal=yes,resizable=yes', 'browser')"/>
                    </menupopup>
                </menu>
                <menuseparator/>
                <menuitem accesskey="&pageSourceCmd.accesskey;" label="&pageSourceCmd.label;" key="key_viewSource" command="View:PageSource"/>
#ifndef XP_MACOSX
                <menuitem accesskey="&fullScreenCmd.accesskey;"
                          label="&fullScreenCmd.label;" key="key_fullScreen"
                          id="fullScreenItem"
                          type="checkbox"
                          command="View:FullScreen"/>
#endif
                <menuseparator hidden="true" id="documentDirection-separator"/>
                <menuitem hidden="true" id="documentDirection-swap" 
                          label="&bidiSwitchPageDirectionItem.label;"
                          accesskey="&bidiSwitchPageDirectionItem.accesskey;"
                          oncommand="SwitchDocumentDirection(window.content)"/>
              </menupopup>
            </menu>

            <menu id="history-menu"
                  oncommand="var url = event.target.getAttribute('statustext'); if (url) { PlacesUtils.markPageAsTyped(url); openUILink(url, event, false, true); }"
                  onclick="checkForMiddleClick(this, event);"
                  label="&historyMenu.label;"
                  accesskey="&historyMenu.accesskey;">
              <menupopup id="goPopup"
                         type="places"
                         onpopupshowing="HistoryMenu.onPopupShowing(this);"
                         place="place:type=0&amp;sort=4&amp;maxResults=10">
                <menuitem label="&backCmd.label;"
#ifdef XP_MACOSX
                          key="goBackKb2"
#else
                          key="goBackKb"
#endif
                          chromedir="&locale.dir;"
                          oncommand="BrowserBack(event, true)"
                          onclick="checkForMiddleClick(this, event);">
                  <observes element="Browser:Back" attribute="disabled" />
                </menuitem>
                <menuitem label="&forwardCmd.label;" 
#ifdef XP_MACOSX
                          key="goForwardKb2"
#else
                          key="goForwardKb"
#endif
                          chromedir="&locale.dir;"
                          oncommand="BrowserForward(event, true)"
                          onclick="checkForMiddleClick(this, event);">
                  <observes element="Browser:Forward" attribute="disabled" />
                </menuitem>

                <menuitem label="&historyHomeCmd.label;"
                          command="Browser:Home"
                          key="goHome"/>
                <menuseparator id="startHistorySeparator" builder="start"/>
                <menuseparator id="endHistorySeparator" builder="end"/>
                <menu id="historyUndoMenu" label="&historyUndoMenu.label;" disabled="true">
                  <menupopup id="historyUndoPopup" onpopupshowing="HistoryMenu.populateUndoSubmenu();"/>
                </menu>
                <menuseparator id="endUndoSeparator"/>
                <menuitem label="&showAllHistoryCmd.label;"
                          command="Browser:ShowAllHistory"/>
              </menupopup>
            </menu>

  <menu id="bookmarksMenu" 
        label="&bookmarksMenu.label;" accesskey="&bookmarksMenu.accesskey;"
        ondragenter="PlacesMenuDNDController.onBookmarksMenuDragEnter(event);"
        ondragdrop="nsDragAndDrop.drop(event, BookmarksMenuDropHandler);"
        ondragover="nsDragAndDrop.dragOver(event, BookmarksMenuDropHandler);"
        ondragexit="PlacesMenuDNDController.onDragExit(event);">
    <menupopup id="bookmarksMenuPopup"
               type="places" asyncinit="true"
               place="place:folder=2&amp;expandQueries=1"
               context="placesContext"
               openInTabs="children"
               oncommand="BookmarksEventHandler.onCommand(event);"
               onclick="BookmarksEventHandler.onClick(event);"
               onpopupshowing="BookmarksEventHandler.onPopupShowing(event);">
      <menuitem label="&addCurPageAsCmd.label;" 
                command="Browser:AddBookmarkAs" key="addBookmarkAsKb"/>
      <menuitem id="subscribeToPageMenuitem"
                label="&subscribeToPageMenuitem.label;"
                oncommand="return FeedHandler.subscribeToFeed(null, event);"
                onclick="checkForMiddleClick(this, event);"
                disabled="true"/>
      <menu id="subscribeToPageMenupopup"
            label="&subscribeToPageMenupopup.label;"
            hidden="true">
        <menupopup id="subscribeToPageSubmenuMenupopup" 
                   onpopupshowing="return FeedHandler.buildFeedList(event.target);" 
                   oncommand="return FeedHandler.subscribeToFeed(null, event);"
                   onclick="checkForMiddleClick(this, event);"/>
      </menu>
      <menuitem label="&addCurPagesCmd.label;" 
                command="Browser:BookmarkAllTabs" key="bookmarkAllTabsKb"/>
      <menuitem label="&showAllBookmarksCmd.label;" 
                command="Browser:ShowAllBookmarks" key="manBookmarkKb"/>
      <menuseparator builder="start"/>
    </menupopup>
  </menu>
        
            <menu id="tools-menu" label="&toolsMenu.label;" accesskey="&toolsMenu.accesskey;">
              <menupopup id="menu_ToolsPopup">
              <menuitem label="&search.label;" accesskey="&search.accesskey;" 
                        key="key_search" command="Tools:Search"/>
              <menuseparator/>
              <menuitem id="menu_openDownloads" label="&downloads.label;"
                        accesskey="&downloads.accesskey;"
                        key="key_openDownloads" command="Tools:Downloads"/>
              <menuitem id="menu_openAddons" label="&addons.label;"
                        accesskey="&addons.accesskey;" command="Tools:Addons"/>
              <menuseparator id="devToolsSeparator"/>
              <menuitem id="javascriptConsole" 
                        label="&errorConsoleCmd.label;" accesskey="&errorConsoleCmd.accesskey;" 
                        key="key_errorConsole" oncommand="toJavaScriptConsole();"/>
#ifdef XP_WIN
              <menuitem accesskey="&pageInfoCmd.accesskey;" label="&pageInfoCmd.label;"   
                        command="View:PageInfo"/>
#else
              <menuitem accesskey="&pageInfoCmd.accesskey;" label="&pageInfoCmd.label;"   
                        key="key_viewInfo" command="View:PageInfo"/>
#endif
              <menuseparator id="sanitizeSeparator"/>
              <menuitem id="sanitizeItem"
                        accesskey="&clearPrivateDataCmd.accesskey;"
                        label="&clearPrivateDataCmd.label;"
                        key="key_sanitize" command="Tools:Sanitize"/>
#ifndef XP_UNIX
              <menuseparator id="prefSep"/>
              <menuitem id="menu_preferences"
                        label="&preferencesCmd.label;"
                        accesskey="&preferencesCmd.accesskey;"
                        oncommand="openPreferences();"/>
#endif
              </menupopup>
            </menu>
    
#ifdef XP_MACOSX
          <menu id="windowMenu" />
#endif
          <menu id="helpMenu" />
        </menubar>
