/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
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
 * The Original Code is Mozilla Places Organizer.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2005-2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ben Goodger <beng@google.com>
 *   Annie Sullivan <annie.sullivan@gmail.com>
 *   Asaf Romano <mano@mozilla.com>
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

var PlacesOrganizer = {
  _places: null,
  _content: null,

  _initFolderTree: function() {
    var leftPaneRoot = PlacesUtils.leftPaneFolderId;
    this._places.place = "place:excludeItems=1&expandQueries=0&folder=" + leftPaneRoot;
  },

  selectLeftPaneQuery: function PO_selectLeftPaneQuery(aQueryName) {
    var itemId = PlacesUtils.leftPaneQueries[aQueryName];
    this._places.selectItems([itemId]);
    // Forcefully expand all-bookmarks
    if (aQueryName == "AllBookmarks")
      asContainer(this._places.selectedNode).containerOpen = true;
  },

  init: function PO_init() {
    this._places = document.getElementById("placesList");
    this._content = document.getElementById("placeContent");
    this._initFolderTree();

    var leftPaneSelection = "AllBookmarks"; // default to all-bookmarks
    if ("arguments" in window && window.arguments.length > 0)
      leftPaneSelection = window.arguments[0];

    this.selectLeftPaneQuery(leftPaneSelection);
    // clear the back-stack
    this._backHistory.splice(0);
    document.getElementById("OrganizerCommand:Back").setAttribute("disabled", true);

    var view = this._content.treeBoxObject.view;
    if (view.rowCount > 0)
      view.selection.select(0);

    this._content.focus();

    // Set up the search UI.
    PlacesSearchBox.init();

    // Set up the advanced query builder UI
    PlacesQueryBuilder.init();

    window.addEventListener("AppCommand", this, true);
#ifdef XP_MACOSX
    // 1. Map Edit->Find command to the organizer's command
    var findMenuItem = document.getElementById("menu_find");
    findMenuItem.setAttribute("command", "OrganizerCommand_find:current");
    var findKey = document.getElementById("key_find");
    findKey.setAttribute("command", "OrganizerCommand_find:current");

    // 2. Disable some keybindings from browser.xul
    var elements = ["cmd_handleBackspace", "cmd_handleShiftBackspace"];
    for (var i=0; i < elements.length; i++) {
      document.getElementById(elements[i]).setAttribute("disabled", "true");
    }
#endif
  },

  QueryInterface: function PO_QueryInterface(aIID) {
    if (aIID.equals(Components.interfaces.nsIDOMEventListener) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;

    throw Components.results.NS_NOINTERFACE;
  },

  handleEvent: function PO_handleEvent(aEvent) {
    if (aEvent.type != "AppCommand")
      return;

    aEvent.stopPropagation();
    switch (aEvent.command) {
      case "Back":
        if (this._backHistory.length > 0)
          this.back();
        break;
      case "Forward":
        if (this._forwardHistory.length > 0)
          this.forward();
        break;
      case "Search":
        PlacesSearchBox.findAll();
        break;
    }
  },

  destroy: function PO_destroy() {
  },

  _location: null,
  get location() {
    return this._location;
  },

  set location(aLocation) {
    if (!aLocation || this._location == aLocation)
      return aLocation;

    if (this.location) {
      this._backHistory.unshift(this.location);
      this._forwardHistory.splice(0);
    }

    this._location = aLocation;
    this._places.selectPlaceURI(aLocation);

    if (!this._places.hasSelection) {
      // If no node was found for the given place: uri, just load it directly
      this._content.place = aLocation;
    }
    this.onContentTreeSelect();

    // update navigation commands
    if (this._backHistory.length == 0)
      document.getElementById("OrganizerCommand:Back").setAttribute("disabled", true);
    else
      document.getElementById("OrganizerCommand:Back").removeAttribute("disabled");
    if (this._forwardHistory.length == 0)
      document.getElementById("OrganizerCommand:Forward").setAttribute("disabled", true);
    else
      document.getElementById("OrganizerCommand:Forward").removeAttribute("disabled");

    return aLocation;
  },

  _backHistory: [],
  _forwardHistory: [],

  back: function PO_back() {
    this._forwardHistory.unshift(this.location);
    var historyEntry = this._backHistory.shift();
    this._location = null;
    this.location = historyEntry;
  },
  forward: function PO_forward() {
    this._backHistory.unshift(this.location);
    var historyEntry = this._forwardHistory.shift();
    this._location = null;
    this.location = historyEntry;
  },

  /**
   * Called when a place folder is selected in the left pane.
   * @param   resetSearchBox
   *          true if the search box should also be reset, false if it should
   *          be left alone.
   */
  onPlaceSelected: function PO_onPlaceSelected(resetSearchBox) {
    // Don't change the right-hand pane contents when there's no selection
    if (!this._places.hasSelection)
      return;

    var node = this._places.selectedNode;
    var queries = asQuery(node).getQueries({});

    // Items are only excluded on the left pane
    var options = node.queryOptions.clone();
    options.excludeItems = false;
    var placeURI = PlacesUtils.history.queriesToQueryString(queries, queries.length, options);

    // update the right-pane contents
    this._content.place = placeURI;

    // This just updates the back/forward buttons, it doesn't call us back
    // because node.uri is our current selection.
    this.location = node.uri;

    // Make sure the search UI is hidden.
    PlacesSearchBox.hideSearchUI();
    if (resetSearchBox) {
      var searchFilter = document.getElementById("searchFilter");
      searchFilter.reset();
    }

    // Update the "Find in <current collection>" command and the gray text in
    // the search box in the toolbar if the active collection is the current
    // collection.
    var findCommand = document.getElementById("OrganizerCommand_find:current");
    var findLabel = PlacesUtils.getFormattedString("findInPrefix", [node.title]);
    findCommand.setAttribute("label", findLabel);
    if (PlacesSearchBox.filterCollection == "collection")
      PlacesSearchBox.updateCollectionTitle(node.title);
  },

  /**
   * Handle clicks on the tree. If the user middle clicks on a URL, load that
   * URL according to rules. Single clicks or modified clicks do not result in
   * any special action, since they're related to selection.
   * @param   aEvent
   *          The mouse event.
   */
  onTreeClick: function PO_onTreeClick(aEvent) {
    var currentView = aEvent.currentTarget;
    var controller = currentView.controller;

    if (aEvent.target.localName != "treechildren")
      return;

    if (currentView.hasSingleSelection && aEvent.button == 1) {
      if (PlacesUtils.nodeIsURI(currentView.selectedNode))
        controller.openSelectedNodeWithEvent(aEvent);
      else if (PlacesUtils.nodeIsContainer(currentView.selectedNode)) {
        // The command execution function will take care of seeing the
        // selection is a folder/container and loading its contents in
        // tabs for us.
        controller.openLinksInTabs();
      }
    }
  },

  _openSelectedRow: function PO__openSelectedRow(aEvent) {
    var node = this._content.selectedNode;
    if (!node)
      return;

    if (PlacesUtils.nodeIsContainer(node)) {
      if (node.itemId != -1)
        this._places.selectItems([node.itemId]);
      else if (PlacesUtils.nodeIsQuery(node))
        this._places.selectPlaceURI(node.uri);
    }
    else if (PlacesUtils.nodeIsURI(this._content.selectedNode))
      this._content.controller.openSelectedNodeWithEvent(aEvent);
  },

  onContentTreeDblClick: function PO_onContentTreeDblClick(aEvent) {
    if (aEvent.button != 0 || !this._content.hasSingleSelection ||
        aEvent.originalTarget.localName != "treechildren")
      return;

    var row = { }, col = { }, obj = { };
    this._content.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row,
                                         col, obj);
    if (row.value == -1)
      return;

    this._openSelectedRow(aEvent);
  },

  onContentTreeKeypress: function PO_onContentTreeKeypress(aEvent) {
    if (aEvent.keyCode == KeyEvent.DOM_VK_RETURN)
      this._openSelectedRow(aEvent);
  },

  /**
   * Returns the options associated with the query currently loaded in the
   * main places pane.
   */
  getCurrentOptions: function PO_getCurrentOptions() {
    return asQuery(this._content.getResult().root).queryOptions;
  },

  /**
   * Show the migration wizard for importing from a file.
   */
  importBookmarks: function PO_import() {
    // XXX: ifdef it to be non-modal (non-"sheet") on mac (see bug 259039)
    var features = "modal,centerscreen,chrome,resizable=no";

    // The migrator window will set this to true when it closes, if the user
    // chose to migrate from a specific file.
    window.fromFile = false;
    openDialog("chrome://browser/content/migration/migration.xul",
               "migration", features, "bookmarks");
    if (window.fromFile)
    this.importFromFile();
  },

  /**
   * Open a file-picker and import the selected file into the bookmarks store
   */
  importFromFile: function PO_importFromFile() {
    var fp = Cc["@mozilla.org/filepicker;1"].
             createInstance(Ci.nsIFilePicker);
    fp.init(window, PlacesUtils.getString("SelectImport"),
            Ci.nsIFilePicker.modeOpen);
    fp.appendFilters(Ci.nsIFilePicker.filterHTML | Ci.nsIFilePicker.filterAll);
    if (fp.show() != Ci.nsIFilePicker.returnCancel) {
      if (fp.file) {
        var importer = Cc["@mozilla.org/browser/places/import-export-service;1"].
                       getService(Ci.nsIPlacesImportExportService);
        var file = fp.file.QueryInterface(Ci.nsILocalFile);
        importer.importHTMLFromFile(file, false);
      }
    }
  },

  /**
   * Allows simple exporting of bookmarks.
   */
  exportBookmarks: function PO_exportBookmarks() {
    var fp = Cc["@mozilla.org/filepicker;1"].
             createInstance(Ci.nsIFilePicker);
    fp.init(window, PlacesUtils.getString("EnterExport"),
            Ci.nsIFilePicker.modeSave);
    fp.appendFilters(Ci.nsIFilePicker.filterHTML);
    fp.defaultString = "bookmarks.html";
    if (fp.show() != Ci.nsIFilePicker.returnCancel) {
      var exporter = Cc["@mozilla.org/browser/places/import-export-service;1"].
                     getService(Ci.nsIPlacesImportExportService);
      exporter.exportHTMLToFile(fp.file);
    }
  },

  /**
   * Populates the restore menu with the dates of the backups available.
   */
  populateRestoreMenu: function PO_populateRestoreMenu() {
    var restorePopup = document.getElementById("fileRestorePopup");

    // remove existing menu items
    // last item is the restoreFromFile item
    while (restorePopup.childNodes.length > 1)
      restorePopup.removeChild(restorePopup.firstChild);

    // get bookmarks backup dir
    var dirSvc = Cc["@mozilla.org/file/directory_service;1"].
                 getService(Ci.nsIProperties);
    var bookmarksBackupDir = dirSvc.get("ProfD", Ci.nsIFile);
    bookmarksBackupDir.append("bookmarkbackups");
    if (!bookmarksBackupDir.exists())
      return; // no backup files

    // get list of files
    var fileList = [];
    var files = bookmarksBackupDir.directoryEntries;
    while (files.hasMoreElements()) {
      var f = files.getNext().QueryInterface(Ci.nsIFile);
      if (!f.isHidden() && f.leafName.match(/\.html?$/))
        fileList.push(f);
    }

    fileList.sort(function PO_fileList_compare(a, b) {
        return b.lastModifiedTime - a.lastModifiedTime;
      });

    if (fileList.length == 0)
      return;

    // populate menu
    for (var i = 0; i < fileList.length; i++) {
      var m = restorePopup.insertBefore
        (document.createElement("menuitem"),
         document.getElementById("restoreFromFile"));
      var dateStr = fileList[i].leafName.replace("bookmarks-", "").
        replace(".html", "");
      if (!dateStr.length)
        dateStr = fileList[i].leafName;
      m.setAttribute("label", dateStr);
      m.setAttribute("value", fileList[i].leafName);
      m.setAttribute("oncommand",
                     "PlacesOrganizer.onRestoreMenuItemClick(this);");
    }
    restorePopup.insertBefore(document.createElement("menuseparator"),
                              document.getElementById("restoreFromFile"));
  },

  /**
   * Called when a menuitem is selected from the restore menu.
   */
  onRestoreMenuItemClick: function PO_onRestoreMenuItemClick(aMenuItem) {
    var dirSvc = Cc["@mozilla.org/file/directory_service;1"].
                 getService(Ci.nsIProperties);
    var bookmarksFile = dirSvc.get("ProfD", Ci.nsIFile);
    bookmarksFile.append("bookmarkbackups");
    bookmarksFile.append(aMenuItem.getAttribute("value"));
    if (!bookmarksFile.exists())
      return;

    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].
                  getService(Ci.nsIPromptService);
    if (!prompts.confirm(null,
                         PlacesUtils.getString("bookmarksRestoreAlertTitle"),
                         PlacesUtils.getString("bookmarksRestoreAlert")))
      return;

    var ieSvc = Cc["@mozilla.org/browser/places/import-export-service;1"].
                getService(Ci.nsIPlacesImportExportService);
    ieSvc.importHTMLFromFile(bookmarksFile, true);
  },

  /**
   * Backup bookmarks to desktop, auto-generate a filename with a date
   */
  backupBookmarks: function PO_backupBookmarks() {
    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    fp.init(window, PlacesUtils.getString("bookmarksBackupTitle"),
            Ci.nsIFilePicker.modeSave);
    fp.appendFilters(Ci.nsIFilePicker.filterHTML);

    var dirSvc = Cc["@mozilla.org/file/directory_service;1"].
                 getService(Ci.nsIProperties);
    var backupsDir = dirSvc.get("Desk", Ci.nsILocalFile);
    fp.displayDirectory = backupsDir;

    // Use YYYY-MM-DD (ISO 8601) as it doesn't contain illegal characters
    // and makes the alphabetical order of multiple backup files more useful.
    var date = (new Date).toLocaleFormat("%Y-%m-%d");
    fp.defaultString = PlacesUtils.getFormattedString("bookmarksBackupFilename",
                                                      [date]);

    if (fp.show() != Ci.nsIFilePicker.returnCancel) {
      var ieSvc = Cc["@mozilla.org/browser/places/import-export-service;1"].
                  getService(Ci.nsIPlacesImportExportService);
      ieSvc.exportHTMLToFile(fp.file);
    }
  },

  /**
   * Called when 'Choose File...' is selected from the Revert menupopup
   * Prompts for a file and reverts bookmarks to those in the file
   */
  restoreFromFile: function PO_restoreFromFile() {
    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].
                  getService(Ci.nsIPromptService);
    if (!prompts.confirm(null, PlacesUtils.getString("bookmarksRestoreAlertTitle"),
                         PlacesUtils.getString("bookmarksRestoreAlert")))
      return;

    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    fp.init(window, PlacesUtils.getString("bookmarksRestoreTitle"),
            Ci.nsIFilePicker.modeOpen);
    fp.appendFilters(Ci.nsIFilePicker.filterHTML);

    var dirSvc = Cc["@mozilla.org/file/directory_service;1"].
                 getService(Ci.nsIProperties);
    var backupsDir = dirSvc.get("Desk", Ci.nsILocalFile);
    fp.displayDirectory = backupsDir;

    if (fp.show() != Ci.nsIFilePicker.returnCancel) {
      var ieSvc = Cc["@mozilla.org/browser/places/import-export-service;1"].
                  getService(Ci.nsIPlacesImportExportService);
      ieSvc.importHTMLFromFile(fp.file, true);
    }
  },

  _paneDisabled: false,
  _setDetailsFieldsDisabledState:
  function PO__setDetailsFieldsDisabledState(aDisabled) {
    if (aDisabled) {
      document.getElementById("paneElementsBroadcaster")
              .setAttribute("disabled", "true");
    }
    else {
      document.getElementById("paneElementsBroadcaster")
              .removeAttribute("disabled");
    }
  },

  _detectAndSetDetailsPaneMinimalState:
  function PO__detectAndSetDetailsPaneMinimalState(aNode) {
    /**
     * The details of simple folder-items (as opposed to livemarks) or the
     * of livemark-children are not likely to fill the scrollbox anyway,
     * thus we remove the "More/Less" button and show all details.
     *
     * the wasminimal attribute here is used to persist the "more/less"
     * state in a bookmark->folder->bookmark scenario.
     */
    var infoScrollbox = document.getElementById("infoScrollbox");
    var scrollboxExpander = document.getElementById("infoScrollboxExpander");
    if ((PlacesUtils.nodeIsFolder(aNode) &&
         !PlacesUtils.nodeIsLivemarkContainer(aNode)) ||
        PlacesUtils.nodeIsLivemarkItem(aNode)) {
      if (infoScrollbox.getAttribute("minimal") == "true")
        infoScrollbox.setAttribute("wasminimal", "true");
      infoScrollbox.removeAttribute("minimal");
      scrollboxExpander.hidden = true;
    }
    else {
      if (infoScrollbox.getAttribute("wasminimal") == "true")
        infoScrollbox.setAttribute("minimal", "true");
      infoScrollbox.removeAttribute("wasminimal");
      scrollboxExpander.hidden = false;
    }
  },

  // NOT YET USED
  updateThumbnailProportions: function PO_updateThumbnailProportions() {
    var previewBox = document.getElementById("previewBox");
    var canvas = document.getElementById("itemThumbnail");
    var height = previewBox.boxObject.height;
    var width = height * (screen.width / screen.height);
    canvas.width = width;
    canvas.height = height;
  },

  onContentTreeSelect: function PO_onContentTreeSelect() {
    // If a textbox within a panel is focused, force-blur it so its contents
    // are saved
    if (gEditItemOverlay.itemId != -1) {
      var focusedElement = document.commandDispatcher.focusedElement;
      if ((focusedElement instanceof HTMLInputElement ||
           focusedElement instanceof HTMLTextAreaElement) &&
          /^editBMPanel.*/.test(focusedElement.parentNode.parentNode.id))
        focusedElement.blur();
    }

    var contentTree = document.getElementById("placeContent");
    var detailsDeck = document.getElementById("detailsDeck");
    if (contentTree.hasSelection) {
      detailsDeck.selectedIndex = 1;
      if (contentTree.hasSingleSelection) {
        var selectedNode = contentTree.selectedNode;
        if (selectedNode.itemId != -1 &&
            !PlacesUtils.nodeIsSeparator(selectedNode)) {
          if (this._paneDisabled) {
            this._setDetailsFieldsDisabledState(false);
            this._paneDisabled = false;
          }

          gEditItemOverlay.initPanel(selectedNode.itemId,
                                     { hiddenRows: ["folderPicker"] });

          this._detectAndSetDetailsPaneMinimalState(selectedNode);
          return;
        }
      }
    }
    else {
      detailsDeck.selectedIndex = 0;
      var selectItemDesc = document.getElementById("selectItemDescription");
      var itemsCountLabel = document.getElementById("itemsCountText");
      var rowCount = this._content.treeBoxObject.view.rowCount;
      if (rowCount == 0) {
        selectItemDesc.hidden = true;
        itemsCountLabel.value = PlacesUtils.getString("detailsPane.noItems");
      }
      else {
        selectItemDesc.hidden = false;
        if (rowCount == 1)
          itemsCountLabel.value = PlacesUtils.getString("detailsPane.oneItem");
        else {
          itemsCountLabel.value =
            PlacesUtils.getFormattedString("detailsPane.multipleItems",
                                           [rowCount]);
        }
      }
    }

    // Nothing to do if the pane was already disabled
    if (!this._paneDisabled) {
      gEditItemOverlay.uninitPanel();
      this._setDetailsFieldsDisabledState(true);
      this._paneDisabled = true;
    }
  },

  // NOT YET USED
  _updateThumbnail: function PO__updateThumbnail() {
    var bo = document.getElementById("previewBox").boxObject;
    var width  = bo.width;
    var height = bo.height;

    var canvas = document.getElementById("itemThumbnail");
    var ctx = canvas.getContext('2d');
    var notAvailableText = canvas.getAttribute("notavailabletext");
    ctx.save();
    ctx.fillStyle = "-moz-Dialog";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width/2, height/2);

    ctx.fillStyle = "GrayText";
    ctx.mozTextStyle = "12pt sans serif";
    var len = ctx.mozMeasureText(notAvailableText);
    ctx.translate(-len/2,0);
    ctx.mozDrawText(notAvailableText);
    ctx.restore();
  },

  toggleAdditionalInfoFields: function PO_toggleAdditionalInfoFields() {
    var infoScrollbox = document.getElementById("infoScrollbox");
    var scrollboxExpander = document.getElementById("infoScrollboxExpander");
    if (infoScrollbox.getAttribute("minimal") == "true") {
      infoScrollbox.removeAttribute("minimal");
      scrollboxExpander.label = scrollboxExpander.getAttribute("lesslabel");
    }
    else {
      infoScrollbox.setAttribute("minimal", "true");
      scrollboxExpander.label = scrollboxExpander.getAttribute("morelabel");
    }
  },

  /**
   * Save the current search (or advanced query) to the bookmarks root.
   */
  saveSearch: function PO_saveSearch() {
    // Get the place: uri for the query.
    // If the advanced query builder is showing, use that.
    var queries = [];
    var options = this.getCurrentOptions();
    options.excludeQueries = true;
    var searchUI = document.getElementById("searchModifiers");
    if (!searchUI.hidden)
      queries = PlacesQueryBuilder.queries;
    else if (PlacesSearchBox.value && PlacesSearchBox.value.length > 0) {
      // If not, use the value of the search box.
      var query = PlacesUtils.history.getNewQuery();
      query.searchTerms = PlacesSearchBox.value;
      queries.push(query);
    }
    else {
      // if there is no query, do nothing.
      // XXX should probably have a dialog here to explain that the user needs to search first.
     return;
    }
    var placeSpec = PlacesUtils.history.queriesToQueryString(queries,
                                                             queries.length,
                                                             options);
    var placeURI = IO.newURI(placeSpec);

    // Prompt the user for a name for the query.
    // XXX - using prompt service for now; will need to make
    // a real dialog and localize when we're sure this is the UI we want.
    var title = PlacesUtils.getString("saveSearch.title");
    var inputLabel = PlacesUtils.getString("saveSearch.inputLabel");
    var defaultText = PlacesUtils.getString("saveSearch.defaultText");

    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].
                  getService(Ci.nsIPromptService);
    var check = {value: false};
    var input = {value: defaultText};
    var save = prompts.prompt(null, title, inputLabel, input, null, check);

    // Don't add the query if the user cancels or clears the seach name.
    if (!save || input.value == "")
     return;

    // Add the place: uri as a bookmark under the bookmarks root.
    var txn = PlacesUtils.ptm.createItem(placeURI,
                                         PlacesUtils.bookmarksMenuFolderId,
                                         PlacesUtils.bookmarks.DEFAULT_INDEX,
                                         input.value);
    PlacesUtils.ptm.doTransaction(txn);
  }
};

/**
 * A set of utilities relating to search within Bookmarks and History.
 */
var PlacesSearchBox = {

  /**
   * The Search text field
   */
  get searchFilter() {
    return document.getElementById("searchFilter");
  },

  /**
   * Folders to include when searching.
   */
  _folders: [],
  get folders() {
    if (this._folders.length == 0)
      this._folders.push(PlacesUtils.bookmarksMenuFolderId,
                         PlacesUtils.unfiledBookmarksFolderId,
                         PlacesUtils.toolbarFolderId);
    return this._folders;
  },
  set folders(aFolders) {
    this._folders = aFolders;
    return aFolders;
  },

  /**
   * Run a search for the specified text, over the collection specified by
   * the dropdown arrow. The default is all bookmarks, but can be
   * localized to the active collection.
   * @param   filterString
   *          The text to search for.
   */
  search: function PSB_search(filterString) {
    var PO = PlacesOrganizer;
    // If the user empties the search box manually, reset it and load all
    // contents of the current scope.
    // XXX this might be to jumpy, maybe should search for "", so results
    // are ungrouped, and search box not reset
    if ((filterString == "" || this.searchFilter.hasAttribute("empty"))) {
      PO.onPlaceSelected(false);
      return;
    }

    var currentOptions = PO.getCurrentOptions();
    var content = PO._content;

    switch (PlacesSearchBox.filterCollection) {
    case "collection":
      content.applyFilter(filterString, this.folders);
      // XXX changing the button text is badness
      //var scopeBtn = document.getElementById("scopeBarFolder");
      //scopeBtn.label = PlacesOrganizer._places.selectedNode.title;
      break;
    case "bookmarks":
      content.applyFilter(filterString,
                          [PlacesUtils.bookmarksMenuFolderId,
                           PlacesUtils.toolbarFolderId,
                           PlacesUtils.unfiledBookmarksFolderId]);
      break;
    case "history":
      if (currentOptions.queryType != Ci.nsINavHistoryQueryOptions.QUERY_TYPE_HISTORY) {
        var query = PlacesUtils.history.getNewQuery();
        query.searchTerms = filterString;
        var options = currentOptions.clone();
        options.queryType = Ci.nsINavHistoryQueryOptions.QUERY_TYPE_HISTORY;
        content.load([query], options);
      }
      else
        content.applyFilter(filterString);
      break;
    case "all":
      content.applyFilter(filterString);
      break;
    }

    PlacesSearchBox.showSearchUI();
    this.searchFilter.setAttribute("filtered", "true");
  },

  /**
   * Finds across all bookmarks
   */
  findAll: function PSB_findAll() {
    this.filterCollection = "all";
    this.focus();
  },

  /**
   * Finds in the currently selected Place.
   */
  findCurrent: function PSB_findCurrent() {
    this.filterCollection = "collection";
    this.focus();
  },

  /**
   * Updates the display with the title of the current collection.
   * @param   title
   *          The title of the current collection.
   */
  updateCollectionTitle: function PSB_updateCollectionTitle(title) {
    if (title) {
      this.searchFilter.grayText =
        PlacesUtils.getFormattedString("searchCurrentDefault", [title]);
    }
    else
      this.searchFilter.grayText = PlacesUtils.getString("searchByDefault");

    this.syncGrayText();
  },

  /**
   * Updates the display with the current gray text.
   */
  syncGrayText: function PSB_syncGrayText() {
    this.searchFilter.value = this.searchFilter.grayText;
    this.searchFilter.setAttribute("label", this.searchFilter.grayText);
  },

  /**
   * Gets/sets the active collection from the dropdown menu.
   */
  get filterCollection() {
    return this.searchFilter.getAttribute("collection");
  },
  set filterCollection(collectionName) {
    this.searchFilter.setAttribute("collection", collectionName);
    if (this.searchFilter.value)
      return; // don't overwrite pre-existing search terms
    var newGrayText = null;
    if (collectionName == "collection")
      newGrayText = PlacesOrganizer._places.selectedNode.title;
    this.updateCollectionTitle(newGrayText);
    return collectionName;
  },

  /**
   * Focus the search box
   */
  focus: function PSB_focus() {
    this.searchFilter.focus();
  },

  /**
   * Set up the gray text in the search bar as the Places View loads.
   */
  init: function PSB_init() {
    var searchFilter = this.searchFilter;
    searchFilter.grayText = PlacesUtils.getString("searchByDefault");
    searchFilter.setAttribute("label", searchFilter.grayText);
    searchFilter.reset();
  },

  /**
   * Gets or sets the text shown in the Places Search Box
   */
  get value() {
    return this.searchFilter.value;
  },
  set value(value) {
    return this.searchFilter.value = value;
  },

  showSearchUI: function PSB_showSearchUI() {
    // Hide the advanced search controls when the user hasn't searched
    var searchModifiers = document.getElementById("searchModifiers");
    searchModifiers.hidden = false;

    // if new search, open builder with pre-populated text row
    if (PlacesQueryBuilder.numRows == 0)
      document.getElementById("OrganizerCommand_search:moreCriteria").doCommand();
  },

  hideSearchUI: function PSB_hideSearchUI() {
    var searchModifiers = document.getElementById("searchModifiers");
    searchModifiers.hidden = true;
  }
};

/**
 * Functions and data for advanced query builder
 */
var PlacesQueryBuilder = {

  queries: [],
  queryOptions: null,

  numRows: 0,

  /**
   * The maximum number of terms that can be added.
   */
  _maxRows: null,

  _keywordSearch: {
    advancedSearch_N_Subject: "advancedSearch_N_SubjectKeyword",
    advancedSearch_N_LocationMenulist: false,
    advancedSearch_N_TimeMenulist: false,
    advancedSearch_N_Textbox: "",
    advancedSearch_N_TimePicker: false,
    advancedSearch_N_TimeMenulist2: false
  },
  _locationSearch: {
    advancedSearch_N_Subject: "advancedSearch_N_SubjectLocation",
    advancedSearch_N_LocationMenulist: "advancedSearch_N_LocationMenuSelected",
    advancedSearch_N_TimeMenulist: false,
    advancedSearch_N_Textbox: "",
    advancedSearch_N_TimePicker: false,
    advancedSearch_N_TimeMenulist2: false
  },
  _timeSearch: {
    advancedSearch_N_Subject: "advancedSearch_N_SubjectVisited",
    advancedSearch_N_LocationMenulist: false,
    advancedSearch_N_TimeMenulist: true,
    advancedSearch_N_Textbox: false,
    advancedSearch_N_TimePicker: "date",
    advancedSearch_N_TimeMenulist2: false
  },
  _timeInLastSearch: {
    advancedSearch_N_Subject: "advancedSearch_N_SubjectVisited",
    advancedSearch_N_LocationMenulist: false,
    advancedSearch_N_TimeMenulist: true,
    advancedSearch_N_Textbox: "7",
    advancedSearch_N_TimePicker: false,
    advancedSearch_N_TimeMenulist2: true
  },
  _nextSearch: null,
  _queryBuilders: null,

  init: function PQB_init() {
    // Initialize advanced search
    this._nextSearch = {
      "keyword": this._timeSearch,
      "visited": this._locationSearch,
      "location": null
    };

    this._queryBuilders = {
      "keyword": this.setKeywordQuery,
      "visited": this.setVisitedQuery,
      "location": this.setLocationQuery
    };

    this._maxRows = this._queryBuilders.length;

    this._dateService = Cc["@mozilla.org/intl/scriptabledateformat;1"].
                        getService(Ci.nsIScriptableDateFormat);
  },

  /**
   * Hides the query builder, and the match rule UI if visible.
   */
  hide: function PQB_hide() {
    var advancedSearch = document.getElementById("advancedSearch");
    // Need to collapse the advanced search box.
    advancedSearch.collapsed = true;
  },

  /**
   * Shows the query builder
   */
  show: function PQB_show() {
    var advancedSearch = document.getElementById("advancedSearch");
    advancedSearch.collapsed = false;
  },

  toggleVisibility: function ABP_toggleVisibility() {
    var expander = document.getElementById("organizerScopeBarExpander");
    var advancedSearch = document.getElementById("advancedSearch");
    if (advancedSearch.collapsed) {
      advancedSearch.collapsed = false;
      expander.className = "expander-down";
      expander.setAttribute("tooltiptext",
                            expander.getAttribute("tooltiptextdown"));
    }
    else {
      advancedSearch.collapsed = true;
      expander.className = "expander-up"
      expander.setAttribute("tooltiptext",
                            expander.getAttribute("tooltiptextup"));
    }
  },

  /**
   * Includes the rowId in the id attribute of an element in a row newly
   * created from the template row.
   * @param   element
   *          The element whose id attribute needs to be updated.
   * @param   rowId
   *          The index of the new row.
   */
  _setRowId: function PQB__setRowId(element, rowId) {
    if (element.id)
      element.id = element.id.replace("advancedSearch0", "advancedSearch" + rowId);
    if (element.hasAttribute("rowid"))
      element.setAttribute("rowid", rowId);
    for (var i = 0; i < element.childNodes.length; ++i) {
      this._setRowId(element.childNodes[i], rowId);
    }
  },

  _updateUIForRowChange: function PQB__updateUIForRowChange() {
    // Update the "can add more criteria" command to make sure various +
    // buttons are disabled.
    var command = document.getElementById("OrganizerCommand_search:moreCriteria");
    if (this.numRows >= this._maxRows)
      command.setAttribute("disabled", "true");
    else
      command.removeAttribute("disabled");
  },

  /**
   * Adds a row to the view, prefilled with the next query subject. If the
   * query builder is not visible, it will be shown.
   */
  addRow: function PQB_addRow() {
    // Limits the number of rows that can be added based on the maximum number
    // of search query subjects.
    if (this.numRows >= this._maxRows)
      return;

    // Clone the template row and unset the hidden attribute.
    var gridRows = document.getElementById("advancedSearchRows");
    var newRow = gridRows.firstChild.cloneNode(true);
    newRow.hidden = false;

    // Determine what the search type is based on the last visible row. If this
    // is the first row, the type is "keyword search". Otherwise, it's the next
    // in the sequence after the one defined by the previous visible row's
    // Subject selector, as defined in _nextSearch.
    var searchType = this._keywordSearch;
    var lastMenu = document.getElementById("advancedSearch" +
                                           this.numRows +
                                           "Subject");
    if (this.numRows > 0 && lastMenu && lastMenu.selectedItem)
      searchType = this._nextSearch[lastMenu.selectedItem.value];

    // There is no "next" search type. We are here in error.
    if (!searchType)
      return;
    // We don't insert into the document until _after_ the searchType is
    // determined, since this will interfere with the computation.
    gridRows.appendChild(newRow);
    this._setRowId(newRow, ++this.numRows);

    // Ensure the Advanced Search container is visible, if this is the first
    // row being added.
    if (this.numRows == 1) {
      this.show();

      // Pre-fill the search terms field with the value from the one on the
      // toolbar.
      // For some reason, setting.value here synchronously does not appear to
      // work.
      var searchTermsField = document.getElementById("advancedSearch1Textbox");
      if (searchTermsField)
        setTimeout(function() { searchTermsField.value = PlacesSearchBox.value; }, 10);
      var query = PlacesUtils.history.getNewQuery();
      query.searchTerms = PlacesSearchBox.value;
      this.queries = [query];
      return;
    }

    this.showSearch(this.numRows, searchType);
    this._updateUIForRowChange();
  },

  /**
   * Remove a row from the set of terms
   * @param   row
   *          The row to remove. If this is null, the last row will be removed.
   * If there are no more rows, the query builder will be hidden.
   */
  removeRow: function PQB_removeRow(row) {
    if (!row)
      row = document.getElementById("advancedSearch" + this.numRows + "Row");
    row.parentNode.removeChild(row);
    --this.numRows;

    if (this.numRows < 1) {
      this.hide();

      // Re-do the original toolbar-search-box search that the user used to
      // spawn the advanced UI... this effectively "reverts" the UI to the
      // point it was in before they began monkeying with advanced search.
      PlacesSearchBox.search(PlacesSearchBox.value);
      return;
    }

    this.doSearch();
    this._updateUIForRowChange();
  },

  onDateTyped: function PQB_onDateTyped(event, row) {
    var textbox = document.getElementById("advancedSearch" + row + "TimePicker");
    var dateString = textbox.value;
    var dateArr = dateString.split("-");
    // The date can be split into a range by the '-' character, i.e.
    // 9/5/05 - 10/2/05.  Unfortunately, dates can also be written like
    // 9-5-05 - 10-2-05.  Try to parse the date based on how many hyphens
    // there are.
    var d0 = null;
    var d1 = null;
    // If there are an even number of elements in the date array, try to
    // parse it as a range of two dates.
    if ((dateArr.length & 1) == 0) {
      var mid = dateArr.length / 2;
      var dateStr0 = dateArr[0];
      var dateStr1 = dateArr[mid];
      for (var i = 1; i < mid; ++i) {
        dateStr0 += "-" + dateArr[i];
        dateStr1 += "-" + dateArr[i + mid];
      }
      d0 = new Date(dateStr0);
      d1 = new Date(dateStr1);
    }
    // If that didn't work, try to parse it as a single date.
    if (d0 == null || d0 == "Invalid Date") {
      d0 = new Date(dateString);
    }

    if (d0 != null && d0 != "Invalid Date") {
      // Parsing succeeded -- update the calendar.
      var calendar = document.getElementById("advancedSearch" + row + "Calendar");
      if (d0.getFullYear() < 2000)
        d0.setFullYear(2000 + (d0.getFullYear() % 100));
      if (d1 != null && d1 != "Invalid Date") {
        if (d1.getFullYear() < 2000)
          d1.setFullYear(2000 + (d1.getFullYear() % 100));
        calendar.updateSelection(d0, d1);
      }
      else {
        calendar.updateSelection(d0, d0);
      }

      // And update the search.
      this.doSearch();
    }
  },

  onCalendarChanged: function PQB_onCalendarChanged(event, row) {
    var calendar = document.getElementById("advancedSearch" + row + "Calendar");
    var begin = calendar.beginrange;
    var end = calendar.endrange;

    // If the calendar doesn't have a begin/end, don't change the textbox.
    if (begin == null || end == null)
      return true;

    // If the begin and end are the same day, only fill that into the textbox.
    var textbox = document.getElementById("advancedSearch" + row + "TimePicker");
    var beginDate = begin.getDate();
    var beginMonth = begin.getMonth() + 1;
    var beginYear = begin.getFullYear();
    var endDate = end.getDate();
    var endMonth = end.getMonth() + 1;
    var endYear = end.getFullYear();
    if (beginDate == endDate && beginMonth == endMonth && beginYear == endYear) {
      // Just one date.
      textbox.value = this._dateService.FormatDate("",
                                                   this._dateService.dateFormatShort,
                                                   beginYear,
                                                   beginMonth,
                                                   beginDate);
    }
    else
    {
      // Two dates.
      var beginStr = this._dateService.FormatDate("",
                                                   this._dateService.dateFormatShort,
                                                   beginYear,
                                                   beginMonth,
                                                   beginDate);
      var endStr = this._dateService.FormatDate("",
                                                this._dateService.dateFormatShort,
                                                endYear,
                                                endMonth,
                                                endDate);
      textbox.value = beginStr + " - " + endStr;
    }

    // Update the search.
    this.doSearch();

    return true;
  },

  handleTimePickerClick: function PQB_handleTimePickerClick(event, row) {
    var popup = document.getElementById("advancedSearch" + row + "DatePopup");
    if (popup.showing)
      popup.hidePopup();
    else {
      var textbox = document.getElementById("advancedSearch" + row + "TimePicker");
      popup.showPopup(textbox, -1, -1, "popup", "bottomleft", "topleft");
    }
  },

  showSearch: function PQB_showSearch(row, values) {
    for (val in values) {
      var id = val.replace("_N_", row);
      var element = document.getElementById(id);
      if (values[val] || typeof(values[val]) == "string") {
        if (typeof(values[val]) == "string") {
          if (values[val] == "date") {
            // "date" means that the current date should be filled into the
            // textbox, and the calendar for the row updated.
            var d = new Date();
            element.value = this._dateService.FormatDate("",
                                                         this._dateService.dateFormatShort,
                                                         d.getFullYear(),
                                                         d.getMonth() + 1,
                                                         d.getDate());
            var calendar = document.getElementById("advancedSearch" + row + "Calendar");
            calendar.updateSelection(d, d);
          }
          else if (element.nodeName == "textbox") {
            // values[val] is the initial value of the textbox.
            element.value = values[val];
          } else {
            // values[val] is the menuitem which should be selected.
            var itemId = values[val].replace("_N_", row);
            var item = document.getElementById(itemId);
            element.selectedItem = item;
          }
        }
        element.hidden = false;
      }
      else {
        element.hidden = true;
      }
    }

    this.doSearch();
  },

  setKeywordQuery: function PQB_setKeywordQuery(query, prefix) {
    query.searchTerms += document.getElementById(prefix + "Textbox").value + " ";
  },

  setLocationQuery: function PQB_setLocationQuery(query, prefix) {
    var type = document.getElementById(prefix + "LocationMenulist").selectedItem.value;
    if (type == "onsite") {
      query.domain = document.getElementById(prefix + "Textbox").value;
    }
    else {
      query.uriIsPrefix = (type == "startswith");
      var spec = document.getElementById(prefix + "Textbox").value;
      try {
        query.uri = IO.newURI(spec);
      }
      catch (e) {
        // Invalid input can cause newURI to barf, that's OK, tack "http://"
        // onto the front and try again to see if the user omitted it
        try {
          query.uri = IO.newURI("http://" + spec);
        }
        catch (e) {
          // OK, they have entered something which can never match. This should
          // not happen.
        }
      }
    }
  },

  setVisitedQuery: function PQB_setVisitedQuery(query, prefix) {
    var searchType = document.getElementById(prefix + "TimeMenulist").selectedItem.value;
    const DAY_MSEC = 86400000;
    switch (searchType) {
      case "on":
        var calendar = document.getElementById(prefix + "Calendar");
        var begin = calendar.beginrange.getTime();
        var end = calendar.endrange.getTime();
        if (begin == end) {
          end = begin + DAY_MSEC;
        }
        query.beginTime = begin * 1000;
        query.endTime = end * 1000;
        break;
      case "before":
        var calendar = document.getElementById(prefix + "Calendar");
        var time = calendar.beginrange.getTime();
        query.endTime = time * 1000;
        break;
      case "after":
        var calendar = document.getElementById(prefix + "Calendar");
        var time = calendar.endrange.getTime();
        query.beginTime = time * 1000;
        break;
      case "inLast":
        var textbox = document.getElementById(prefix + "Textbox");
        var amount = parseInt(textbox.value);
        amount = amount * DAY_MSEC;
        var menulist = document.getElementById(prefix + "TimeMenulist2");
        if (menulist.selectedItem.value == "weeks")
          amount = amount * 7;
        else if (menulist.selectedItem.value == "months")
          amount = amount * 30;
        var now = new Date();
        now = now - amount;
        query.beginTime = now * 1000;
        break;
    }
  },

  doSearch: function PQB_doSearch() {
    // Create the individual queries.
    var queryType = document.getElementById("advancedSearchType").selectedItem.value;
    this.queries = [];
    if (queryType == "and")
      this.queries.push(PlacesUtils.history.getNewQuery());
    var updated = 0;
    for (var i = 1; updated < this.numRows; ++i) {
      var prefix = "advancedSearch" + i;

      // The user can remove rows from the middle and start of the list, not
      // just from the end, so we need to make sure that this row actually
      // exists before attempting to construct a query for it.
      var querySubjectElement = document.getElementById(prefix + "Subject");
      if (querySubjectElement) {
        // If the queries are being AND-ed, put all the rows in one query.
        // If they're being OR-ed, add a separate query for each row.
        var query;
        if (queryType == "and")
          query = this.queries[0];
        else
          query = PlacesUtils.history.getNewQuery();

        var querySubject = querySubjectElement.value;
        this._queryBuilders[querySubject](query, prefix);

        if (queryType == "or")
          this.queries.push(query);

        ++updated;
      }
    }

    // Make sure we're getting uri results, not visits
    this.options = PlacesOrganizer.getCurrentOptions();
    this.options.resultType = this.options.RESULT_TYPE_URI;

    // XXXben - find some public way of doing this!
    PlacesOrganizer._content.load(this.queries, this.options);
  },

  onScopeSelected: function PQB_onScopeSelected(aButton) {
    var id = aButton.getAttribute("id");
    // get scope bar
    var bar = document.getElementById("organizerScopeBar");
    var child = bar.firstChild;
    while (child) {
      if (child.getAttribute("id") != id)
        child.removeAttribute("checked");
      else
        child.setAttribute("checked", "true");
      child = child.nextSibling;
    }

    // update collection type and get folders
    var folders = [];
    switch (id) {
      case "scopeBarToolbar":
        PlacesSearchBox.filterCollection = "collection";
        folders.push(PlacesUtils.toolbarFolderId);
        break;
      case "scopeBarMenu":
        PlacesSearchBox.filterCollection = "collection";
        folders.push(PlacesUtils.bookmarksMenuFolderId);
        break;
      case "scopeBarHistory":
        PlacesSearchBox.filterCollection = "history";
        folders = [];
        break;
      case "scopeBarFolder":
        var selectedFolder = PlacesOrganizer._places.selectedNode.itemId;
        // note "all bookmarks" isn't the concrete parent of the top-level
        // bookmark folders
        if (selectedFolder != PlacesUtils.allBookmarksFolderId) {
          PlacesSearchBox.filterCollection = "collection";
          folders.push(PlacesOrganizer._places.selectedNode.itemId);
          break;
        }
      default: // all bookmarks
        PlacesSearchBox.filterCollection = "bookmarks";
        folders.push(PlacesUtils.bookmarksMenuFolderId,
                     PlacesUtils.toolbarFolderId,
                     PlacesUtils.unfiledBookmarksFolderId);
    }

    // set scope, and re-search
    PlacesSearchBox.folders = folders;
    PlacesSearchBox.search(PlacesSearchBox.searchFilter.value);
  }
};

/**
 * Population and commands for the View Menu.
 */
var ViewMenu = {
  /**
   * Removes content generated previously from a menupopup.
   * @param   popup
   *          The popup that contains the previously generated content.
   * @param   startID
   *          The id attribute of an element that is the start of the
   *          dynamically generated region - remove elements after this
   *          item only.
   *          Must be contained by popup. Can be null (in which case the
   *          contents of popup are removed).
   * @param   endID
   *          The id attribute of an element that is the end of the
   *          dynamically generated region - remove elements up to this
   *          item only.
   *          Must be contained by popup. Can be null (in which case all
   *          items until the end of the popup will be removed). Ignored
   *          if startID is null.
   * @returns The element for the caller to insert new items before,
   *          null if the caller should just append to the popup.
   */
  _clean: function VM__clean(popup, startID, endID) {
    if (endID)
      NS_ASSERT(startID, "meaningless to have valid endID and null startID");
    if (startID) {
      var startElement = document.getElementById(startID);
      NS_ASSERT(startElement.parentNode ==
                popup, "startElement is not in popup");
      NS_ASSERT(startElement,
                "startID does not correspond to an existing element");
      var endElement = null;
      if (endID) {
        endElement = document.getElementById(endID);
        NS_ASSERT(endElement.parentNode == popup,
                  "endElement is not in popup");
        NS_ASSERT(endElement,
                  "endID does not correspond to an existing element");
      }
      while (startElement.nextSibling != endElement)
        popup.removeChild(startElement.nextSibling);
      return endElement;
    }
    else {
      while(popup.hasChildNodes())
        popup.removeChild(popup.firstChild);
    }
    return null;
  },

  /**
   * Fills a menupopup with a list of columns
   * @param   event
   *          The popupshowing event that invoked this function.
   * @param   startID
   *          see _clean
   * @param   endID
   *          see _clean
   * @param   type
   *          the type of the menuitem, e.g. "radio" or "checkbox".
   *          Can be null (no-type).
   *          Checkboxes are checked if the column is visible.
   * @param   propertyPrefix
   *          If propertyPrefix is non-null:
   *          propertyPrefix + column ID + ".label" will be used to get the
   *          localized label string.
   *          propertyPrefix + column ID + ".accesskey" will be used to get the
   *          localized accesskey.
   *          If propertyPrefix is null, the column label is used as label and
   *          no accesskey is assigned.
   */
  fillWithColumns: function VM_fillWithColumns(event, startID, endID, type, propertyPrefix) {
    var popup = event.target;
    var pivot = this._clean(popup, startID, endID);

    // If no column is "sort-active", the "Unsorted" item needs to be checked,
    // so track whether or not we find a column that is sort-active.
    var isSorted = false;
    var content = document.getElementById("placeContent");
    var columns = content.columns;
    for (var i = 0; i < columns.count; ++i) {
      var column = columns.getColumnAt(i).element;
      var menuitem = document.createElement("menuitem");
      menuitem.id = "menucol_" + column.id;
      menuitem.column = column;
      var label = column.getAttribute("label");
      if (propertyPrefix) {
        var menuitemPrefix = propertyPrefix;
        // for string properties, use "name" as the id, instead of "title"
        // see bug #386287 for details
        var columnId = column.getAttribute("anonid");
        menuitemPrefix += columnId == "title" ? "name" : columnId;
        label = PlacesUtils.getString(menuitemPrefix + ".label");
        var accesskey = PlacesUtils.getString(menuitemPrefix + ".accesskey");
        menuitem.setAttribute("accesskey", accesskey);
      }
      menuitem.setAttribute("label", label);
      if (type == "radio") {
        menuitem.setAttribute("type", "radio");
        menuitem.setAttribute("name", "columns");
        // This column is the sort key. Its item is checked.
        if (column.getAttribute("sortDirection") != "") {
          menuitem.setAttribute("checked", "true");
          isSorted = true;
        }
      }
      else if (type == "checkbox") {
        menuitem.setAttribute("type", "checkbox");
        // Cannot uncheck the primary column.
        if (column.getAttribute("primary") == "true")
          menuitem.setAttribute("disabled", "true");
        // Items for visible columns are checked.
        if (!column.hidden)
          menuitem.setAttribute("checked", "true");
      }
      if (pivot)
        popup.insertBefore(menuitem, pivot);
      else
        popup.appendChild(menuitem);
    }
    event.stopPropagation();
  },

  /**
   * Set up the content of the view menu.
   */
  populateSortMenu: function VM_populateSortMenu(event) {
    this.fillWithColumns(event, "viewUnsorted", "directionSeparator", "radio", "view.sortBy.");

    var sortColumn = this._getSortColumn();
    var viewSortAscending = document.getElementById("viewSortAscending");
    var viewSortDescending = document.getElementById("viewSortDescending");
    // We need to remove an existing checked attribute because the unsorted
    // menu item is not rebuilt every time we open the menu like the others.
    var viewUnsorted = document.getElementById("viewUnsorted");
    if (!sortColumn) {
      viewSortAscending.removeAttribute("checked");
      viewSortDescending.removeAttribute("checked");
      viewUnsorted.setAttribute("checked", "true");
    }
    else if (sortColumn.getAttribute("sortDirection") == "ascending") {
      viewSortAscending.setAttribute("checked", "true");
      viewSortDescending.removeAttribute("checked");
      viewUnsorted.removeAttribute("checked");
    }
    else if (sortColumn.getAttribute("sortDirection") == "descending") {
      viewSortDescending.setAttribute("checked", "true");
      viewSortAscending.removeAttribute("checked");
      viewUnsorted.removeAttribute("checked");
    }
  },

  /**
   * Shows/Hides a tree column.
   * @param   element
   *          The menuitem element for the column
   */
  showHideColumn: function VM_showHideColumn(element) {
    var column = element.column;

    var splitter = column.nextSibling;
    if (splitter && splitter.localName != "splitter")
      splitter = null;

    if (element.getAttribute("checked") == "true") {
      column.removeAttribute("hidden");
      if (splitter)
        splitter.removeAttribute("hidden");
    }
    else {
      column.setAttribute("hidden", "true");
      if (splitter)
        splitter.setAttribute("hidden", "true");
    }
  },

  /**
   * Gets the last column that was sorted.
   * @returns  the currently sorted column, null if there is no sorted column.
   */
  _getSortColumn: function VM__getSortColumn() {
    var content = document.getElementById("placeContent");
    var cols = content.columns;
    for (var i = 0; i < cols.count; ++i) {
      var column = cols.getColumnAt(i).element;
      var sortDirection = column.getAttribute("sortDirection");
      if (sortDirection == "ascending" || sortDirection == "descending")
        return column;
    }
    return null;
  },

  /**
   * Sorts the view by the specified column.
   * @param   aColumn
   *          The colum that is the sort key. Can be null - the
   *          current sort column or the title column will be used.
   * @param   aDirection
   *          The direction to sort - "ascending" or "descending".
   *          Can be null - the last direction or descending will be used.
   *
   * If both aColumnID and aDirection are null, the view will be unsorted.
   */
  setSortColumn: function VM_setSortColumn(aColumn, aDirection) {
    var result = document.getElementById("placeContent").getResult();
    if (!aColumn && !aDirection) {
      result.sortingMode = Ci.nsINavHistoryQueryOptions.SORT_BY_NONE;
      return;
    }

    var columnId;
    if (aColumn) {
      columnId = aColumn.getAttribute("anonid")
      if (!aDirection) {
        var sortColumn = this._getSortColumn();
        aDirection = sortColumn ?
                     sortColumn.getAttribute("sortDirection") : "descending";
      }
    }
    else {
      var sortColumn = this._getSortColumn();
      columnId = sortColumn ? sortColumn.getAttribute("anonid") : "title";
    }

    var sortingMode;
    var sortingAnnotation = "";
    const NHQO = Ci.nsINavHistoryQueryOptions;
    switch (columnId) {
      case "title":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_TITLE_DESCENDING : NHQO.SORT_BY_TITLE_ASCENDING;
        break;
      case "url":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_URI_DESCENDING : NHQO.SORT_BY_URI_ASCENDING;
        break;
      case "date":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_DATE_DESCENDING : NHQO.SORT_BY_DATE_ASCENDING;
        break;
      case "visitCount":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_VISITCOUNT_DESCENDING : NHQO.SORT_BY_VISITCOUNT_ASCENDING;
        break;
      case "keyword":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_KEYWORD_DESCENDING : NHQO.SORT_BY_KEYWORD_ASCENDING;
        break;
      case "description":
        sortingAnnotation = DESCRIPTION_ANNO;
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_ANNOTATION_DESCENDING : NHQO.SORT_BY_ANNOTATION_ASCENDING;
        break;
      case "dateAdded":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_DATEADDED_DESCENDING : NHQO.SORT_BY_DATEADDED_ASCENDING;
        break;
      case "lastModified":
        sortingMode = aDirection == "descending" ?
          NHQO.SORT_BY_LASTMODIFIED_DESCENDING : NHQO.SORT_BY_LASTMODIFIED_ASCENDING;
        break;
      default:
        throw("Invalid Column");
    }
    result.sortingAnnotation = sortingAnnotation;
    result.sortingMode = sortingMode;
  }
};

var PlacesToolbar = {
  // make places toolbar act like menus
  openedMenuButton: null,

  autoOpenMenu: function (aTarget) {
    if (this.openedMenuButton && this.openedMenuButton != aTarget &&
        aTarget.localName == "toolbarbutton" &&
        (aTarget.type == "menu" || aTarget.type == "menu-button")) {
      this.openedMenuButton.open = false;
      aTarget.open = true;
    }
  },

  onMenuOpen: function (aTarget) {
    if (aTarget.parentNode.localName == "toolbarbutton")
      this.openedMenuButton = aTarget.parentNode;
  },

  onMenuClose: function (aTarget) {
    if (aTarget.parentNode.localName == "toolbarbutton")
      this.openedMenuButton = null;
  }
};
