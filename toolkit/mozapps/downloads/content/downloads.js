# -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
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
#   Blake Ross <blakeross@telocity.com> (Original Author)
#   Ben Goodger <ben@bengoodger.com> (v2.0)
#   Dan Mosedale <dmose@mozilla.org>
#   Fredrik Holmqvist <thesuckiestemail@yahoo.se>
#   Josh Aas <josh@mozilla.com>
#   Shawn Wilsher <me@shawnwilsher.com> (v3.0)
#   Edward Lee <edward.lee@engineering.uiuc.edu>
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

////////////////////////////////////////////////////////////////////////////////
//// Globals

const PREF_BDM_CLOSEWHENDONE = "browser.download.manager.closeWhenDone";
const PREF_BDM_ALERTONEXEOPEN = "browser.download.manager.alertOnEXEOpen";

const nsLocalFile = Components.Constructor("@mozilla.org/file/local;1",
                                           "nsILocalFile", "initWithPath");

var Cc = Components.classes;
var Ci = Components.interfaces;
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const nsIDM = Ci.nsIDownloadManager;

var gDownloadManager = Cc["@mozilla.org/download-manager;1"].getService(nsIDM);
var gDownloadListener = null;
var gDownloadsView = null;
var gSearchBox = null;
var gSearchTerms = "";
var gBuilder = 0;

// Control the performance of the incremental list building by setting how many
// milliseconds to wait before building more of the list and how many items to
// add between each delay.
const gListBuildDelay = 300;
const gListBuildChunk = 3;

// If the user has interacted with the window in a significant way, we should
// not auto-close the window. Tough UI decisions about what is "significant."
var gUserInteracted = false;

// These strings will be converted to the corresponding ones from the string
// bundle on startup.
var gStr = {
  paused: "paused",
  statusFormat: "statusFormat2",
  transferSameUnits: "transferSameUnits",
  transferDiffUnits: "transferDiffUnits",
  transferNoTotal: "transferNoTotal",
  timeMinutesLeft: "timeMinutesLeft",
  timeSecondsLeft: "timeSecondsLeft",
  timeFewSeconds: "timeFewSeconds",
  timeUnknown: "timeUnknown",
  doneStatus: "doneStatus",
  doneSize: "doneSize",
  doneSizeUnknown: "doneSizeUnknown",
  doneScheme: "doneScheme",
  doneFileScheme: "doneFileScheme",
  stateFailed: "stateFailed",
  stateCanceled: "stateCanceled",
  stateBlocked: "stateBlocked",
  stateDirty: "stateDirty",
  yesterday: "yesterday",
  monthDate: "monthDate",

  units: ["bytes", "kilobyte", "megabyte", "gigabyte"],

  fileExecutableSecurityWarningTitle: "fileExecutableSecurityWarningTitle",
  fileExecutableSecurityWarningDontAsk: "fileExecutableSecurityWarningDontAsk"
};

// Create a getDisplayHost function for queries to use
gDownloadManager.DBConnection.createFunction("getDisplayHost", 1, {
  QueryInterface: XPCOMUtils.generateQI([Ci.mozIStorageFunction]),
  onFunctionCall: function(aArgs) getHost(aArgs.getUTF8String(0))[0]
});

// The statement to query for downloads that are active or match the search
var gStmt = gDownloadManager.DBConnection.createStatement(
  "SELECT id, target, name, source, state, startTime, endTime, referrer, " +
         "currBytes, maxBytes, state IN (?1, ?2, ?3, ?4, ?5) isActive, " +
         "getDisplayHost(IFNULL(referrer, source)) display " +
  "FROM moz_downloads " +
  "WHERE isActive OR name LIKE ?6 ESCAPE '/' OR display LIKE ?6 ESCAPE '/' " +
  "ORDER BY isActive DESC, endTime DESC, startTime DESC");

////////////////////////////////////////////////////////////////////////////////
//// Utility Functions

function getDownload(aID)
{
  return document.getElementById("dl" + aID);
}

////////////////////////////////////////////////////////////////////////////////
//// Start/Stop Observers

function downloadCompleted(aDownload)
{
  // Wrap this in try...catch since this can be called while shutting down...
  // it doesn't really matter if it fails then since well.. we're shutting down
  // and there's no UI to update!
  try {
    let dl = getDownload(aDownload.id);

    // Update attributes now that we've finished
    dl.setAttribute("startTime", Math.round(aDownload.startTime / 1000));
    dl.setAttribute("endTime", Date.now());
    dl.setAttribute("currBytes", aDownload.amountTransferred);
    dl.setAttribute("maxBytes", aDownload.size);

    // If we aren't displaying search results, move the download to after the
    // active ones
    if (gSearchTerms.length == 0) {
      // Iterate down until we find a non-active download
      let next = dl.nextSibling;
      while (next && next.inProgress)
        next = next.nextSibling;

      // Move the item and color everything after where it moved from
      let fixup = dl.nextSibling;
      gDownloadsView.insertBefore(dl, next);
      stripeifyList(fixup);
    } else {
      removeFromView(dl);
    }

    // getTypeFromFile fails if it can't find a type for this file.
    try {
      // Refresh the icon, so that executable icons are shown.
      var mimeService = Cc["@mozilla.org/mime;1"].
                        getService(Ci.nsIMIMEService);
      var contentType = mimeService.getTypeFromFile(aDownload.targetFile);

      var listItem = getDownload(aDownload.id)
      var oldImage = listItem.getAttribute("image");
      // Tacking on contentType bypasses cache
      listItem.setAttribute("image", oldImage + "&contentType=" + contentType);
    } catch (e) { }

    if (gDownloadManager.activeDownloadCount == 0)
      document.title = document.documentElement.getAttribute("statictitle");
  }
  catch (e) { }
}

function autoRemoveAndClose(aDownload)
{
  var pref = Cc["@mozilla.org/preferences-service;1"].
             getService(Ci.nsIPrefBranch);

  if (gDownloadManager.activeDownloadCount == 0) {
    // For the moment, just use the simple heuristic that if this window was
    // opened by the download process, rather than by the user, it should
    // auto-close if the pref is set that way. If the user opened it themselves,
    // it should not close until they explicitly close it.
    var autoClose = pref.getBoolPref(PREF_BDM_CLOSEWHENDONE);
    var autoOpened =
      !window.opener || window.opener.location.href == window.location.href;
    if (autoClose && autoOpened && !gUserInteracted) {
      gCloseDownloadManager();
      return true;
    }
  }

  return false;
}

// This function can be overwritten by extensions that wish to place the
// Download Window in another part of the UI.
function gCloseDownloadManager()
{
  window.close();
}

////////////////////////////////////////////////////////////////////////////////
//// Download Event Handlers

function cancelDownload(aDownload)
{
  gDownloadManager.cancelDownload(aDownload.getAttribute("dlid"));

  // XXXben -
  // If we got here because we resumed the download, we weren't using a temp file
  // because we used saveURL instead. (this is because the proper download mechanism
  // employed by the helper app service isn't fully accessible yet... should be fixed...
  // talk to bz...)
  // the upshot is we have to delete the file if it exists.
  var f = getLocalFileFromNativePathOrUrl(aDownload.getAttribute("file"));

  if (f.exists())
    f.remove(false);
}

function pauseDownload(aDownload)
{
  var id = aDownload.getAttribute("dlid");
  gDownloadManager.pauseDownload(id);
}

function resumeDownload(aDownload)
{
  gDownloadManager.resumeDownload(aDownload.getAttribute("dlid"));
}

function removeDownload(aDownload)
{
  gDownloadManager.removeDownload(aDownload.getAttribute("dlid"));
}

function retryDownload(aDownload)
{
  removeFromView(aDownload);
  gDownloadManager.retryDownload(aDownload.getAttribute("dlid"));
}

function showDownload(aDownload)
{
  var f = getLocalFileFromNativePathOrUrl(aDownload.getAttribute("file"));

  try {
    // Show the directory containing the file and select the file
    f.reveal();
  } catch (e) {
    // If reveal fails for some reason (e.g., it's not implemented on unix or
    // the file doesn't exist), try using the parent if we have it.
    let parent = f.parent.QueryInterface(Ci.nsILocalFile);
    if (!parent)
      return;

    try {
      // "Double click" the parent directory to show where the file should be
      parent.launch();
    } catch (e) {
      // If launch also fails (probably because it's not implemented), let the
      // OS handler try to open the parent
      openExternal(parent);
    }
  }
}

function onDownloadDblClick(aEvent)
{
  // Only do the default action for double primary clicks
  if (aEvent.button == 0)
    doDefaultForSelected();
}

function openDownload(aDownload)
{
  var f = getLocalFileFromNativePathOrUrl(aDownload.getAttribute("file"));
  if (f.isExecutable()) {
    var dontAsk = false;
    var pref = Cc["@mozilla.org/preferences-service;1"].
               getService(Ci.nsIPrefBranch);
    try {
      dontAsk = !pref.getBoolPref(PREF_BDM_ALERTONEXEOPEN);
    } catch (e) { }

    if (!dontAsk) {
      var strings = document.getElementById("downloadStrings");
      var name = aDownload.getAttribute("target");
      var message = strings.getFormattedString("fileExecutableSecurityWarning", [name, name]);

      let title = gStr.fileExecutableSecurityWarningTitle;
      let dontAsk = gStr.fileExecutableSecurityWarningDontAsk;

      var promptSvc = Cc["@mozilla.org/embedcomp/prompt-service;1"].
                      getService(Ci.nsIPromptService);
      var checkbox = { value: false };
      var open = promptSvc.confirmCheck(window, title, message, dontAsk, checkbox);

      if (!open)
        return;
      pref.setBoolPref(PREF_BDM_ALERTONEXEOPEN, !checkbox.value);
    }
  }
  try {
    f.launch();
  } catch (ex) {
    // if launch fails, try sending it through the system's external
    // file: URL handler
    openExternal(f);
  }
}

function openReferrer(aDownload)
{
  openURL(getReferrerOrSource(aDownload));
}

function copySourceLocation(aDownload)
{
  var uri = aDownload.getAttribute("uri");
  var clipboard = Cc["@mozilla.org/widget/clipboardhelper;1"].
                  getService(Ci.nsIClipboardHelper);

  clipboard.copyString(uri);
}

// This is called by the progress listener.
var gLastComputedMean = -1;
var gLastActiveDownloads = 0;
function onUpdateProgress()
{
  if (gDownloadManager.activeDownloads == 0) {
    document.title = document.documentElement.getAttribute("statictitle");
    gLastComputedMean = -1;
    return;
  }

  // Establish the mean transfer speed and amount downloaded.
  var mean = 0;
  var base = 0;
  var numActiveDownloads = 0;
  var dls = gDownloadManager.activeDownloads;
  while (dls.hasMoreElements()) {
    let dl = dls.getNext();
    dl.QueryInterface(Ci.nsIDownload);
    if (dl.percentComplete < 100 && dl.size > 0) {
      mean += dl.amountTransferred;
      base += dl.size;
    }
    numActiveDownloads++;
  }

  // we're not downloading anything at the moment,
  // but we already downloaded something.
  if (base == 0) {
    mean = 100;
  } else {
    mean = Math.floor((mean / base) * 100);
  }

  // Update title of window
  if (mean != gLastComputedMean || gLastActiveDownloads != numActiveDownloads) {
    gLastComputedMean = mean;
    gLastActiveDownloads = numActiveDownloads;

    var strings = document.getElementById("downloadStrings");
    if (numActiveDownloads > 1) {
      document.title = strings.getFormattedString("downloadsTitleMultiple",
                                                  [mean, numActiveDownloads]);
    } else {
      document.title = strings.getFormattedString("downloadsTitle", [mean]);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
//// Startup, Shutdown

function Startup()
{
  gDownloadsView = document.getElementById("downloadView");
  gSearchBox = document.getElementById("searchbox");

  // convert strings to those in the string bundle
  let (sb = document.getElementById("downloadStrings")) {
    let getStr = function(string) sb.getString(string);
    for (let [name, value] in Iterator(gStr))
      gStr[name] = typeof value == "string" ? getStr(value) : value.map(getStr);
  }

  buildDownloadList();

  // The DownloadProgressListener (DownloadProgressListener.js) handles progress
  // notifications.
  gDownloadListener = new DownloadProgressListener();
  gDownloadManager.addListener(gDownloadListener);

  // downloads can finish before Startup() does, so check if the window should
  // close and act accordingly
  if (!autoRemoveAndClose())
    gDownloadsView.focus();

  var obs = Cc["@mozilla.org/observer-service;1"].
            getService(Ci.nsIObserverService);
  obs.addObserver(gDownloadObserver, "download-manager-remove-download", false);
}

function Shutdown()
{
  gDownloadManager.removeListener(gDownloadListener);

  var obs = Cc["@mozilla.org/observer-service;1"].
            getService(Ci.nsIObserverService);
  obs.removeObserver(gDownloadObserver, "download-manager-remove-download");

  clearTimeout(gBuilder);
  gStmt.reset();
  gStmt.finalize();

  gDownloadManager.DBConnection.removeFunction("getDisplayHost");
}

var gDownloadObserver = {
  observe: function gdo_observe(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "download-manager-remove-download":
        // A null subject here indicates "remove all"
        if (!aSubject) {
          // Rebuild the default view
          buildDownloadList();
          break;
        }

        // Otherwise, remove a single download
        var id = aSubject.QueryInterface(Ci.nsISupportsPRUint32);
        var dl = getDownload(id.data);
        removeFromView(dl);
        break;
    }
  }
};

////////////////////////////////////////////////////////////////////////////////
//// View Context Menus

var gContextMenus = [
  // DOWNLOAD_DOWNLOADING
  [
    "menuitem_pause"
    , "menuitem_cancel"
    , "menuseparator"
    , "menuitem_show"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
  ],
  // DOWNLOAD_FINISHED
  [
    "menuitem_open"
    , "menuitem_show"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
    , "menuseparator"
    , "menuitem_removeFromList"
    , "menuitem_clearList"
  ],
  // DOWNLOAD_FAILED
  [
    "menuitem_retry"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
    , "menuseparator"
    , "menuitem_removeFromList"
    , "menuitem_clearList"
  ],
  // DOWNLOAD_CANCELED
  [
    "menuitem_retry"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
    , "menuseparator"
    , "menuitem_removeFromList"
    , "menuitem_clearList"
  ],
  // DOWNLOAD_PAUSED
  [
    "menuitem_resume"
    , "menuitem_cancel"
    , "menuseparator"
    , "menuitem_show"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
  ],
  // DOWNLOAD_QUEUED
  [
    "menuitem_cancel"
    , "menuseparator"
    , "menuitem_show"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
  ],
  // DOWNLOAD_BLOCKED
  [
    "menuitem_openReferrer"
    , "menuitem_copyLocation"
    , "menuseparator"
    , "menuitem_removeFromList"
    , "menuitem_clearList"
  ],
  // DOWNLOAD_SCANNING
  [
    "menuitem_show"
    , "menuseparator"
    , "menuitem_openReferrer"
    , "menuitem_copyLocation"
  ],
  // DOWNLOAD_DIRTY
  [
    "menuitem_openReferrer"
    , "menuitem_copyLocation"
    , "menuseparator"
    , "menuitem_removeFromList"
    , "menuitem_clearList"
  ]
];

function buildContextMenu(aEvent)
{
  if (aEvent.target.id != "downloadContextMenu")
    return false;

  var popup = document.getElementById("downloadContextMenu");
  while (popup.hasChildNodes())
    popup.removeChild(popup.firstChild);

  if (gDownloadsView.selectedItem) {
    let dl = gDownloadsView.selectedItem;
    let idx = parseInt(dl.getAttribute("state"));
    if (idx < 0)
      idx = 0;

    var menus = gContextMenus[idx];
    for (let i = 0; i < menus.length; ++i) {
      let menuitem = document.getElementById(menus[i]).cloneNode(true);
      let cmd = menuitem.getAttribute("cmd");
      if (cmd)
        menuitem.disabled = !gDownloadViewController.isCommandEnabled(cmd, dl);

      popup.appendChild(menuitem);
    }

    return true;
  }

  return false;
}

////////////////////////////////////////////////////////////////////////////////
//// Drag and Drop

var gDownloadDNDObserver =
{
  onDragOver: function (aEvent, aFlavour, aDragSession)
  {
    aDragSession.canDrop = true;
  },

  onDrop: function(aEvent, aXferData, aDragSession)
  {
    var split = aXferData.data.split("\n");
    var url = split[0];
    if (url != aXferData.data) {  //do nothing, not a valid URL
      var name = split[1];
      saveURL(url, name, null, true, true);
    }
  },
  _flavourSet: null,
  getSupportedFlavours: function ()
  {
    if (!this._flavourSet) {
      this._flavourSet = new FlavourSet();
      this._flavourSet.appendFlavour("text/x-moz-url");
      this._flavourSet.appendFlavour("text/unicode");
    }
    return this._flavourSet;
  }
}

////////////////////////////////////////////////////////////////////////////////
//// Command Updating and Command Handlers

var gDownloadViewController = {
  isCommandEnabled: function(aCommand, aItem)
  {
    // This switch statement is for commands that do not need a download object
    switch (aCommand) {
      case "cmd_clearList":
        return gDownloadManager.canCleanUp;
    }

    let dl = aItem;

    switch (aCommand) {
      case "cmd_cancel":
        return dl.inProgress;
      case "cmd_open":
        var file = getLocalFileFromNativePathOrUrl(dl.getAttribute("file"));
        return dl.openable && file.exists();
      case "cmd_pause":
        return dl.inProgress && !dl.paused;
      case "cmd_pauseResume":
        return dl.inProgress || dl.paused;
      case "cmd_resume":
        return dl.paused;
      case "cmd_openReferrer":
        return dl.hasAttribute("referrer");
      case "cmd_removeFromList":
      case "cmd_retry":
        return dl.removable;
      case "cmd_show":
      case "cmd_copyLocation":
        return true;
    }
    return false;
  },

  doCommand: function(aCommand, aItem)
  {
    if (this.isCommandEnabled(aCommand, aItem))
      this.commands[aCommand](aItem);
  },

  commands: {
    cmd_cancel: function(aSelectedItem) {
      cancelDownload(aSelectedItem);
    },
    cmd_open: function(aSelectedItem) {
      openDownload(aSelectedItem);
    },
    cmd_openReferrer: function(aSelectedItem) {
      openReferrer(aSelectedItem);
    },
    cmd_pause: function(aSelectedItem) {
      pauseDownload(aSelectedItem);
    },
    cmd_pauseResume: function(aSelectedItem) {
      if (aSelectedItem.inProgress)
        this.commands.cmd_pause(aSelectedItem);
      else
        this.commands.cmd_resume(aSelectedItem);
    },
    cmd_removeFromList: function(aSelectedItem) {
      removeDownload(aSelectedItem);
    },
    cmd_resume: function(aSelectedItem) {
      resumeDownload(aSelectedItem);
    },
    cmd_retry: function(aSelectedItem) {
      retryDownload(aSelectedItem);
    },
    cmd_show: function(aSelectedItem) {
      showDownload(aSelectedItem);
    },
    cmd_copyLocation: function(aSelectedItem) {
      copySourceLocation(aSelectedItem);
    },
    cmd_clearList: function() {
      gDownloadManager.cleanUp();
    }
  }
};

/**
 * Helper function to do commands.
 *
 * @param aCmd
 *        The command to be performed.
 * @param aItem
 *        The richlistitem that represents the download that will have the
 *        command performed on it.  If this is null, it assumes the currently
 *        selected item.  If the item passed in is not a richlistitem that
 *        represents a download, it will walk up the parent nodes until it finds
 *        a DOM node that is.
 */
function performCommand(aCmd, aItem)
{
  let elm = aItem;
  if (!elm) {
    elm = gDownloadsView.selectedItem;
  } else {
    while (elm.nodeName != "richlistitem" ||
           elm.getAttribute("type") != "download")
      elm = elm.parentNode;
  }

  gDownloadViewController.doCommand(aCmd, elm);
}

function setSearchboxFocus()
{
  gSearchBox.focus();
  gSearchBox.select();
}

function openExternal(aFile)
{
  var uri = Cc["@mozilla.org/network/io-service;1"].
            getService(Ci.nsIIOService).newFileURI(aFile);

  var protocolSvc = Cc["@mozilla.org/uriloader/external-protocol-service;1"].
                    getService(Ci.nsIExternalProtocolService);
  protocolSvc.loadUrl(uri);

  return;
}

////////////////////////////////////////////////////////////////////////////////
//// Utility Functions

/**
 * Create a download richlistitem with the provided attributes. Some attributes
 * are *required* while optional ones will only be set on the item if provided.
 *
 * @param aAttrs
 *        An object that must have the following properties: dlid, file,
 *        target, uri, state, progress, startTime, endTime, currBytes,
 *        maxBytes; optional properties: referrer
 * @return An initialized download richlistitem
 */
function createDownloadItem(aAttrs)
{
  var dl = document.createElement("richlistitem");

  // Copy the attributes from the argument into the item
  for (let attr in aAttrs)
    dl.setAttribute(attr, aAttrs[attr]);

  // Initialize other attributes
  dl.setAttribute("type", "download");
  dl.setAttribute("id", "dl" + aAttrs.dlid);
  dl.setAttribute("image", "moz-icon://" + aAttrs.file + "?size=32");
  dl.setAttribute("lastSeconds", Infinity);

  // Initialize more complex attributes
  updateTime(dl);
  updateStatus(dl);

  try {
    let file = getLocalFileFromNativePathOrUrl(aAttrs.file);
    dl.setAttribute("path", file.nativePath || file.path);
    return dl;
  } catch (e) {
    // aFile might not be a file: url or a valid native path
    // see bug #392386 for details
  }
  return null;
}

/**
 * Updates the disabled state of the buttons of a downlaod.
 *
 * @param aItem
 *        The richlistitem representing the download.
 */
function updateButtons(aItem)
{
  let buttons = aItem.buttons;

  for (let i = 0; i < buttons.length; ++i) {
    let cmd = buttons[i].getAttribute("cmd");
    let enabled = gDownloadViewController.isCommandEnabled(cmd, aItem);
    buttons[i].disabled = !enabled;
  }
}

/**
 * Updates the status for a download item depending on its state
 *
 * @param aItem
 *        The richlistitem that has various download attributes.
 * @param aDownload
 *        The nsDownload from the backend. This is an optional parameter, but
 *        is useful for certain states such as DOWNLOADING.
 */
function updateStatus(aItem, aDownload) {
  var status = "";
  var statusTip = "";

  var state = Number(aItem.getAttribute("state"));
  switch (state) {
    case nsIDM.DOWNLOAD_PAUSED:
    case nsIDM.DOWNLOAD_DOWNLOADING:
      var currBytes = Number(aItem.getAttribute("currBytes"));
      var maxBytes = Number(aItem.getAttribute("maxBytes"));

      // Update the bytes transferred and bytes total
      let ([progress, progressUnits] = convertByteUnits(currBytes),
           [total, totalUnits] = convertByteUnits(maxBytes),
           transfer) {
        if (total < 0)
          transfer = gStr.transferNoTotal;
        else if (progressUnits == totalUnits)
          transfer = gStr.transferSameUnits;
        else
          transfer = gStr.transferDiffUnits;

        transfer = replaceInsert(transfer, 1, progress);
        transfer = replaceInsert(transfer, 2, progressUnits);
        transfer = replaceInsert(transfer, 3, total);
        transfer = replaceInsert(transfer, 4, totalUnits);

        if (state == nsIDM.DOWNLOAD_PAUSED) {
          status = replaceInsert(gStr.paused, 1, transfer);

          // don't need to process any more for PAUSED
          break;
        }

        // Insert 1 is the download progress
        status = replaceInsert(gStr.statusFormat, 1, transfer);
      }

      // if we don't have an active download, assume 0 bytes/sec
      var speed = aDownload ? aDownload.speed : 0;

      // Update the download rate
      let ([rate, unit] = convertByteUnits(speed)) {
        // Insert 2 is the download rate
        status = replaceInsert(status, 2, rate);
        // Insert 3 is the |unit|/sec
        status = replaceInsert(status, 3, unit);
      }

      // Update time remaining.
      let (remain) {
        if ((speed > 0) && (maxBytes > 0)) {
          var seconds = Math.ceil((maxBytes - currBytes) / speed);
          var lastSec = Number(aItem.getAttribute("lastSeconds"));

          // Reuse the last seconds if the new one is only slighty longer
          // This avoids jittering seconds, e.g., 41 40 38 40 -> 41 40 38 38
          // However, large changes are shown, e.g., 41 38 49 -> 41 38 49
          let (diff = seconds - lastSec) {
            if (diff > 0 && diff <= 10)
              seconds = lastSec;
            else
              aItem.setAttribute("lastSeconds", seconds);
          }

          // Be friendly in the last few seconds
          if (seconds <= 3)
            remain = gStr.timeFewSeconds;
          // Show 2 digit seconds starting at 60; otherwise use minutes
          else if (seconds <= 60)
            remain = replaceInsert(gStr.timeSecondsLeft, 1, seconds);
          else
            remain = replaceInsert(gStr.timeMinutesLeft, 1,
                                   Math.ceil(seconds / 60));
        } else {
          remain = gStr.timeUnknown;
        }

        // Insert 4 is the time remaining
        status = replaceInsert(status, 4, remain);
      }

      break;
    case nsIDM.DOWNLOAD_FINISHED:
    case nsIDM.DOWNLOAD_FAILED:
    case nsIDM.DOWNLOAD_CANCELED:
    case nsIDM.DOWNLOAD_BLOCKED:
    case nsIDM.DOWNLOAD_DIRTY:
      let (stateSize = {}) {
        stateSize[nsIDM.DOWNLOAD_FINISHED] = function() {
          // Display the file size, but show "Unknown" for negative sizes
          let fileSize = Number(aItem.getAttribute("maxBytes"));
          let sizeText = gStr.doneSizeUnknown;
          if (fileSize >= 0) {
            let [size, unit] = convertByteUnits(fileSize);
            sizeText = replaceInsert(gStr.doneSize, 1, size);
            sizeText = replaceInsert(sizeText, 2, unit);
          }
          return sizeText;
        };
        stateSize[nsIDM.DOWNLOAD_FAILED] = function() gStr.stateFailed;
        stateSize[nsIDM.DOWNLOAD_CANCELED] = function() gStr.stateCanceled;
        stateSize[nsIDM.DOWNLOAD_BLOCKED] = function() gStr.stateBlocked;
        stateSize[nsIDM.DOWNLOAD_DIRTY] = function() gStr.stateDirty;

        // Insert 1 is the download size or download state
        status = replaceInsert(gStr.doneStatus, 1, stateSize[state]());
      }

      var [displayHost, fullHost] = getHost(getReferrerOrSource(aItem));
      // Insert 2 is the eTLD + 1 or other variations of the host
      status = replaceInsert(status, 2, displayHost);
      // Set the tooltip to be the full host
      statusTip = fullHost;

      break;
  }

  aItem.setAttribute("status", status);
  aItem.setAttribute("statusTip", statusTip != "" ? statusTip : status);
}

/**
 * Updates the time that gets shown for completed download items
 *
 * @param aItem
 *        The richlistitem representing a download in the UI
 */
function updateTime(aItem)
{
  // Don't bother updating for things that aren't finished
  if (aItem.inProgress)
    return;

  var dts = Cc["@mozilla.org/intl/scriptabledateformat;1"].
            getService(Ci.nsIScriptableDateFormat);

  // Figure out when today begins
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get the end time to display
  var end = new Date(parseInt(aItem.getAttribute("endTime")));

  // Figure out if the end time is from today, yesterday, this week, etc.
  var dateTime;
  if (end >= today) {
    // Download finished after today started, show the time
    dateTime = dts.FormatTime("", dts.timeFormatNoSeconds,
                              end.getHours(), end.getMinutes(), 0);
  } else if (today - end < (24 * 60 * 60 * 1000)) {
    // Download finished after yesterday started, show yesterday
    dateTime = gStr.yesterday;
  } else if (today - end < (6 * 24 * 60 * 60 * 1000)) {
    // Download finished after last week started, show day of week
    dateTime = end.toLocaleFormat("%A");
  } else {
    // Download must have been from some time ago.. show month/day
    var month = end.toLocaleFormat("%B");
    // Remove leading 0 by converting the date string to a number
    var date = Number(end.toLocaleFormat("%d"));
    dateTime = replaceInsert(gStr.monthDate, 1, month);
    dateTime = replaceInsert(dateTime, 2, date);
  }

  aItem.setAttribute("dateTime", dateTime);

  // Set the tooltip to be the full date and time
  var dateTimeTip = dts.FormatDateTime("",
                                       dts.dateFormatLong,
                                       dts.timeFormatNoSeconds,
                                       end.getFullYear(),
                                       end.getMonth() + 1,
                                       end.getDate(),
                                       end.getHours(),
                                       end.getMinutes(),
                                       0); 

  aItem.setAttribute("dateTimeTip", dateTimeTip);
}

/**
 * Converts a number of bytes to the appropriate unit that results in a
 * number that needs fewer than 4 digits
 *
 * @return a pair: [new value with 3 sig. figs., its unit]
 */
function convertByteUnits(aBytes)
{
  var unitIndex = 0;

  // convert to next unit if it needs 4 digits (after rounding), but only if
  // we know the name of the next unit
  while ((aBytes >= 999.5) && (unitIndex < gStr.units.length - 1)) {
    aBytes /= 1024;
    unitIndex++;
  }

  // Get rid of insignificant bits by truncating to 1 or 0 decimal points
  // 0 -> 0; 1.2 -> 1.2; 12.3 -> 12.3; 123.4 -> 123; 234.5 -> 235
  aBytes = aBytes.toFixed((aBytes > 0) && (aBytes < 100) ? 1 : 0);

  return [aBytes, gStr.units[unitIndex]];
}

/**
 * Get the appropriate display host string for a URI string depending on if the
 * URI has an eTLD + 1, is an IP address, a local file, or other protocol
 *
 * @param aURIString
 *        The URI string to try getting an eTLD + 1, etc.
 * @return a pair: [display host for the provided URI string, full host name]
 */
function getHost(aURIString)
{
  var ioService = Cc["@mozilla.org/network/io-service;1"].
                  getService(Ci.nsIIOService);
  var eTLDService = Cc["@mozilla.org/network/effective-tld-service;1"].
                    getService(Ci.nsIEffectiveTLDService);
  var idnService = Cc["@mozilla.org/network/idn-service;1"].
                   getService(Ci.nsIIDNService);

  // Get a URI that knows about its components
  var uri = ioService.newURI(aURIString, null, null);

  // Get the inner-most uri for schemes like jar:
  if (uri instanceof Ci.nsINestedURI)
    uri = uri.innermostURI;

  var fullHost;
  try {
    // Get the full host name; some special URIs fail (data: jar:)
    fullHost = uri.host;
  } catch (e) {
    fullHost = "";
  }

  var displayHost;
  try {
    // This might fail if it's an IP address or doesn't have more than 1 part
    let baseDomain = eTLDService.getBaseDomain(uri);

    // Convert base domain for display; ignore the isAscii out param
    displayHost = idnService.convertToDisplayIDN(baseDomain, {});
  } catch (e) {
    // Default to the host name
    displayHost = fullHost;
  }

  // Check if we need to show something else for the host
  if (uri.scheme == "file") {
    // Display special text for file protocol
    displayHost = gStr.doneFileScheme;
    fullHost = displayHost;
  } else if (displayHost.length == 0) {
    // Got nothing; show the scheme (data: about: moz-icon:)
    displayHost = replaceInsert(gStr.doneScheme, 1, uri.scheme);
    fullHost = displayHost;
  } else if (uri.port != -1) {
    // Tack on the port if it's not the default port
    let port = ":" + uri.port;
    displayHost += port;
    fullHost += port;
  }

  return [displayHost, fullHost];
}

function replaceInsert(aText, aIndex, aValue)
{
  return aText.replace("#" + aIndex, aValue);
}

/**
 * Perform the default action for the currently selected download item
 */
function doDefaultForSelected()
{
  // Make sure we have something selected
  var item = gDownloadsView.selectedItem;
  if (!item)
    return;

  // Get the default action (first item in the menu)
  var state = Number(item.getAttribute("state"));
  var menuitem = document.getElementById(gContextMenus[state][0]);

  // Try to do the action if the command is enabled
  gDownloadViewController.doCommand(menuitem.getAttribute("cmd"), item);
}

function removeFromView(aDownload)
{
  // Make sure we have an item to remove
  if (!aDownload) return;

  var index = gDownloadsView.selectedIndex;
  gDownloadsView.removeChild(aDownload);
  gDownloadsView.selectedIndex = Math.min(index, gDownloadsView.itemCount - 1);

  // Color everything after from the newly selected item
  stripeifyList(gDownloadsView.selectedItem);
}

function getReferrerOrSource(aDownload)
{
  // Give the referrer if we have it set
  if (aDownload.hasAttribute("referrer"))
    return aDownload.getAttribute("referrer");

  // Otherwise, provide the source
  return aDownload.getAttribute("uri");
}

/**
 * Initiate building the download list to have the active downloads followed by
 * completed ones filtered by the search term if necessary.
 */
function buildDownloadList()
{
  // Clear out values before using them
  clearTimeout(gBuilder);
  gStmt.reset();
  gSearchTerms = "";

  // Clear the list before adding items by replacing with a shallow copy
  let (empty = gDownloadsView.cloneNode(false)) {
    gDownloadsView.parentNode.replaceChild(empty, gDownloadsView);
    gDownloadsView = empty;
  }

  // If the search box isn't empty, trim the search terms
  if (!gSearchBox.hasAttribute("empty"))
    gSearchTerms = gSearchBox.value.replace(/^\s+|\s+$/, "");

  var like = "%" + gStmt.escapeStringForLIKE(gSearchTerms, "/") + "%";

  try {
    gStmt.bindInt32Parameter(0, nsIDM.DOWNLOAD_NOTSTARTED);
    gStmt.bindInt32Parameter(1, nsIDM.DOWNLOAD_DOWNLOADING);
    gStmt.bindInt32Parameter(2, nsIDM.DOWNLOAD_PAUSED);
    gStmt.bindInt32Parameter(3, nsIDM.DOWNLOAD_QUEUED);
    gStmt.bindInt32Parameter(4, nsIDM.DOWNLOAD_SCANNING);
    gStmt.bindStringParameter(5, like);
  } catch (e) {
    // Something must have gone wrong when binding, so clear and quit
    gStmt.reset();
    return;
  }

  // Take a quick break before we actually start building the list
  gBuilder = setTimeout(function() {
    // Start building the list and select the first item
    stepListBuilder(1);
    gDownloadsView.selectedIndex = 0;
  }, 0);
}

/**
 * Incrementally build the download list by adding at most the requested number
 * of items if there are items to add. After doing that, it will schedule
 * another chunk of items specified by gListBuildDelay and gListBuildChunk.
 *
 * @param aNumItems
 *        Number of items to add to the list before taking a break
 */
function stepListBuilder(aNumItems) {
  try {
    // If we're done adding all items, we can quit
    if (!gStmt.executeStep())
      return;

    // Try to get the attribute values from the statement
    let attrs = {
      dlid: gStmt.getInt64(0),
      file: gStmt.getString(1),
      target: gStmt.getString(2),
      uri: gStmt.getString(3),
      state: gStmt.getInt32(4),
      startTime: Math.round(gStmt.getInt64(5) / 1000),
      endTime: Math.round(gStmt.getInt64(6) / 1000),
      currBytes: gStmt.getInt64(8),
      maxBytes: gStmt.getInt64(9)
    };

    // Only add the referrer if it's not null
    let (referrer = gStmt.getString(7)) {
      if (referrer)
        attrs.referrer = referrer;
    }

    // If the download is active, grab the real progress, otherwise default 100
    attrs.progress = gStmt.getInt32(10) ?
      gDownloadManager.getDownload(attrs.dlid).percentComplete : 100;

    // Make the item and add it to the end
    let item = createDownloadItem(attrs);
    if (item) {
      // Add item to the end and color just that one item
      gDownloadsView.appendChild(item);
      stripeifyList(item);
    
      // Because of the joys of XBL, we can't update the buttons until the
      // download object is in the document.
      updateButtons(item);
    }
  } catch (e) {
    // Something went wrong when stepping or getting values, so clear and quit
    gStmt.reset();
    return;
  }

  // Add another item to the list if we should; otherwise, let the UI update
  // and continue later
  if (aNumItems > 1) {
    stepListBuilder(aNumItems - 1);
  } else {
    // Use a shorter delay for earlier downloads to display them faster
    let delay = Math.min(gDownloadsView.itemCount * 10, gListBuildDelay);
    gBuilder = setTimeout(stepListBuilder, delay, gListBuildChunk);
  }
}

/**
 * Add a download to the front of the download list
 *
 * @param aDownload
 *        The nsIDownload to make into a richlistitem
 */
function prependList(aDownload)
{
  var attrs = {
    dlid: aDownload.id,
    file: aDownload.target.spec,
    target: aDownload.displayName,
    uri: aDownload.source.spec,
    state: aDownload.state,
    progress: aDownload.percentComplete,
    startTime: Math.round(aDownload.startTime / 1000),
    endTime: Date.now(),
    currBytes: aDownload.amountTransferred,
    maxBytes: aDownload.size
  };

  // Make the item and add it to the beginning
  var item = createDownloadItem(attrs);
  if (item) {
    // Add item to the beginning and color the whole list
    gDownloadsView.insertBefore(item, gDownloadsView.firstChild);
    stripeifyList(item);
    
    // Because of the joys of XBL, we can't update the buttons until the
    // download object is in the document.
    updateButtons(item);
  }
}

/**
 * Stripeify the download list by setting or clearing the "alternate" attribute
 * on items starting from a particular item and continuing to the end.
 *
 * @param aItem
 *        Download rishlist item to start stripeifying
 */
function stripeifyList(aItem)
{
  var alt = "alternate";
  // Set the item to be opposite of the other
  var flipFrom = function(aOther) aOther && aOther.hasAttribute(alt) ?
    aItem.removeAttribute(alt) : aItem.setAttribute(alt, "true");

  // Keep coloring items as the opposite of its previous until no more
  while (aItem) {
    flipFrom(aItem.previousSibling);
    aItem = aItem.nextSibling;
  }
}

function onSearchboxBlur() {
  if (gSearchBox.value == "") {
    gSearchBox.setAttribute("empty", "true");
    gSearchBox.value = gSearchBox.getAttribute("defaultValue");
  }
}

function onSearchboxFocus() {
  if (gSearchBox.hasAttribute("empty")) {
    gSearchBox.value = "";
    gSearchBox.removeAttribute("empty");
  }
}

// we should be using real URLs all the time, but until
// bug 239948 is fully fixed, this will do...
//
// note, this will thrown an exception if the native path
// is not valid (for example a native Windows path on a Mac)
// see bug #392386 for details
function getLocalFileFromNativePathOrUrl(aPathOrUrl)
{
  if (aPathOrUrl.substring(0,7) == "file://") {
    // if this is a URL, get the file from that
    var ioSvc = Cc["@mozilla.org/network/io-service;1"].
                getService(Ci.nsIIOService);

    // XXX it's possible that using a null char-set here is bad
    const fileUrl = ioSvc.newURI(aPathOrUrl, null, null).
                    QueryInterface(Ci.nsIFileURL);
    return fileUrl.file.clone().QueryInterface(Ci.nsILocalFile);
  } else {
    // if it's a pathname, create the nsILocalFile directly
    var f = new nsLocalFile(aPathOrUrl);

    return f;
  }
}
