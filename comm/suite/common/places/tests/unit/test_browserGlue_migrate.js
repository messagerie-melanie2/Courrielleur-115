/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim:set ts=2 sw=2 sts=2 et: */
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
 * The Original Code is Places Unit Test code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Marco Bonardo <mak77@bonardo.net>
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

/**
 * Tests that nsSuiteGlue does not overwrite bookmarks imported from the
 * migrators.  They usually run before nsSuiteGlue, so if we find any
 * bookmark on init, we should not try to import.
 */

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyServiceGetter(this, "bs",
                                   "@mozilla.org/browser/nav-bookmarks-service;1",
                                   "nsINavBookmarksService");
XPCOMUtils.defineLazyServiceGetter(this, "anno",
                                   "@mozilla.org/browser/annotation-service;1",
                                   "nsIAnnotationService");

let bookmarksObserver = {
  onBeginUpdateBatch: function() {},
  onEndUpdateBatch: function() {
    let itemId = bs.getIdForItemAt(bs.toolbarFolder, 0);
    do_check_neq(itemId, -1);
    if (anno.itemHasAnnotation(itemId, "Places/SmartBookmark"))
      continue_test();
  },
  onItemAdded: function() {},
  onBeforeItemRemoved: function(id) {},
  onItemRemoved: function(id, folder, index, itemType) {},
  onItemChanged: function() {},
  onItemVisited: function(id, visitID, time) {},
  onItemMoved: function() {},
  QueryInterface: XPCOMUtils.generateQI([Ci.nsINavBookmarkObserver])
};

const PREF_SMART_BOOKMARKS_VERSION = "browser.places.smartBookmarksVersion";

function run_test() {
  do_test_pending();

  // Create our bookmarks.html copying bookmarks.glue.html to the profile
  // folder.  It will be ignored.
  create_bookmarks_html("bookmarks.glue.html");

  // Remove current database file.
  let db = gProfD.clone();
  db.append("places.sqlite");
  if (db.exists()) {
    db.remove(false);
    do_check_false(db.exists());
  }

  // Initialize Places through the History Service.
  let hs = Cc["@mozilla.org/browser/nav-history-service;1"].
           getService(Ci.nsINavHistoryService);
  // Check a new database has been created.
  // nsSuiteGlue uses databaseStatus to manage initialization.
  do_check_eq(hs.databaseStatus, hs.DATABASE_STATUS_CREATE);

  // A migrator would run before nsSuiteGlue Places initialization, so mimic
  // that behavior adding a bookmark and notifying the migration.
  bs.insertBookmark(bs.bookmarksMenuFolder, uri("http://mozilla.org/"),
                    bs.DEFAULT_INDEX, "migrated");

  // Initialize nsSuiteGlue.
  let bg = Cc["@mozilla.org/suite/suiteglue;1"].
           getService(Ci.nsIObserver);
  bg.observe(null, "initial-migration", null)

  // The test will continue once import has finished and smart bookmarks
  // have been created.
  bs.addObserver(bookmarksObserver, false);
}

function continue_test() {
  // Check the created bookmarks still exist.
  let itemId = bs.getIdForItemAt(bs.bookmarksMenuFolder, SMART_BOOKMARKS_ON_MENU);
  do_check_eq(bs.getItemTitle(itemId), "migrated");

  // Check that we have not imported any new bookmark.
  do_check_eq(bs.getIdForItemAt(bs.bookmarksMenuFolder, SMART_BOOKMARKS_ON_MENU + 1), -1);
  do_check_eq(bs.getIdForItemAt(bs.toolbarFolder, SMART_BOOKMARKS_ON_MENU), -1);

  remove_bookmarks_html();

  do_test_finished();
}
