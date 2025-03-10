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
 * The Original Code is mozilla.com code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Dietrich Ayala <dietrich@mozilla.com>
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

// An object representing the contents of bookmarks.preplaces.html.
let test_bookmarks = {
  menu: [
    { title: "SeaMonkey and Mozilla",
      children: [
        { title: "The SeaMonkey Project",
          url: "http://www.seamonkey-project.org/"
        },
        { title: "mozilla.org",
          children: [
            { title: "The Mozilla Organization",
              url: "http://www.mozilla.org/"
            },
            { title: "Mozilla Projects",
              url: "http://www.mozilla.org/projects/"
            },
            { title: "About Mozilla",
              url: "http://www.mozilla.org/about/"
            }
          ]
        },
        { title: "Extending SeaMonkey",
          // 6 children: bother to count, but not to check their details.
          children: [
            {},
            {},
            {},
            {},
            {},
            {}
          ]
        },
        { title: "Community & Support",
          // 3 children: don't even bother to count.
        }
      ]
    },
    { title: "Search the Web",
      children: [
        { title: "Google",
          url: "http://www.google.com/"
        },
        { title: "Google Groups",
          url: "http://groups.google.com/"
        },
        { title: "Google News",
          url: "http://news.google.com/"
        }
      ]
    },
    { // <HR>
    },
    { title: "test",
      description: "folder test comment",
      dateAdded: 1177541020000000,
      lastModified: 1177541050000000,
      children: [
        { title: "test post keyword",
          description: "item description",
          dateAdded: 1177375336000000,
          lastModified: 1177375423000000,
          keyword: "test",
          sidebar: true,
          postData: "hidden1%3Dbar&text1%3D%25s",
          charset: "ISO-8859-1"
        }
      ]
    }
  ],
  toolbar: [
    { title: "SeaMonkey",
      url: "http://www.seamonkey-project.org/",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QwCEiUG/+wAegAAAu5JREFUOMtlk01oXFUUx3/3vfte3kydmeeQJgUTMsEaKX40tREbDHYE6UIXnZVUujCIiu3GKl0EXRh3ol1EF8WutItuuum4sRTRRXFRFGUyRPxIyVe1mK+ZZD46d968e6+LSduoFw7/c+D+Dv8D5wj+984NDQ4mz6TT/iiAMWCMRanO1urqnaJSZy/u/i12F2H46Qe5XGo6DAOMscSxQWuL1t08imI2NlRpba05CVOz/2qQSJx7+/DhfTPAPUhrQxwbJl54mHemJnCkg20pxh67sFStqlGY2pZd/OOjIyPZmTi+D91t0N+/h/enn2NuFW78aXm6dRvfd3NBIItK8bwEGB5Oz3iei1IxWpt7lrW2vPjKKKoDv65bMr5m4kiOvr4kjUaUh0+OO/DRwSBwR5WKabc1Smnu5zGFwgjfLsIv69CKDL+vG44dGyaKNK5rJ+XAQCqfTifY3Gzumrurp04dom0dlrag3gZtBc2OIZPpIZVK0tubycuxsSfD44VnsQaMBbsTxsDBIx3O/2hRsSAbWFwBf21b8vmn6N83zvz8SijL5YhGo47rguOC0YZsVjI+nuAP7RNpCANLpREzkBYMZly+vhxRLivq9Ri5vLxdqlQaaA1as2MfTp7u4fqGS0dbDvVp6hlBJrD0bFkuXarheaBUpSS1Xii1WvsxJovWXfufnX+QK5uSB3xN0tGkfIdHeyFahddfqxIEAs+DZvPv0s4iXf1CiCcmoQvf2Bvw8oEYAazUBM/sFfz8XZsLnzdRyiKlwJg15uau5XYWafYMpAvvvvd4OD+U4PRDMeYO3F7QbP7W4c1ii1YLPA+CQCBExK1b5Wk4uywArLVDxZ+aX6qeZD5ZiXjrRAXP69qUsqueJ5ASoqjC4uIP07Xaqx8CONbaK9+v2KUDuT3sV2uFky99U3TdJkEgCAJBItFVKSNqtYWlmzevT96FAYS19iiwJYSY3X3S2ewjBd8PQinBcaBaXSnV62989d/j/wcgGYelT45hgQAAAABJRU5ErkJggg=="
    },
    { title: "mozilla.org",
      url: "http://www.mozilla.org/"
    },
    { title: "mozillaZine",
      url: "http://www.mozillazine.org/"
    },
    { title: "Latest Headlines",
      url: "http://en-us.fxfeeds.mozilla.com/en-US/firefox/livebookmarks/",
      feedUrl: "http://en-us.fxfeeds.mozilla.com/en-US/firefox/headlines.xml"
    }
  ],
  unfiled: [
    { title: "Example.tld",
      url: "http://example.tld/"
    }
  ]
};

// Pre-Places bookmarks.html file pointer.
let gBookmarksFileOld;
// Places bookmarks.html file pointer.
let gBookmarksFileNew;

let exporter = Cc["@mozilla.org/browser/places/import-export-service;1"].
               getService(Ci.nsIPlacesImportExportService);

Cu.import("resource://gre/modules/BookmarkHTMLUtils.jsm");

function run_test()
{
  run_next_test();
}

add_test(function setup() {
  // Avoid creating smart bookmarks during the test.
  Services.prefs.setIntPref("browser.places.smartBookmarksVersion", -1);

  // File pointer to legacy bookmarks file.
  gBookmarksFileOld = do_get_file("bookmarks.preplaces.html");

  // File pointer to a new Places-exported bookmarks file.
  gBookmarksFileNew = Services.dirsvc.get("ProfD", Ci.nsILocalFile);
  gBookmarksFileNew.append("bookmarks.exported.html");
  if (gBookmarksFileNew.exists()) {
    gBookmarksFileNew.remove(false);
  }
  gBookmarksFileNew.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, 0600);
  if (!gBookmarksFileNew.exists()) {
    do_throw("couldn't create file: bookmarks.exported.html");
  }

  // This test must be the first one, since it setups the new bookmarks.html.
  // Test importing a pre-Places canonical bookmarks file.
  // 1. import bookmarks.preplaces.html
  // 2. run the test-suite
  // Note: we do not empty the db before this import to catch bugs like 380999
  try {
    BookmarkHTMLUtils.importFromFile(gBookmarksFileOld, true, function(success) {
      if (success) {
        waitForAsyncUpdates(function () {
          testImportedBookmarks();

          // Prepare for next tests.
          try {
            exporter.exportHTMLToFile(gBookmarksFileNew);
          } catch(ex) { do_throw("couldn't export to file: " + ex); }

          waitForAsyncUpdates(function () {
            remove_all_bookmarks();
            run_next_test();
          });
        });
      } else {
        do_throw("couldn't import legacy bookmarks file.");
      }
    });
  } catch(ex) { do_throw("couldn't import legacy bookmarks file: " + ex); }
});

add_test(function test_import_new()
{
  // Test importing a Places bookmarks.html file.
  // 1. import bookmarks.exported.html
  // 2. run the test-suite

  try {
    BookmarkHTMLUtils.importFromFile(gBookmarksFileNew, true, function(success) {
      if (success) {
        waitForAsyncUpdates(function () {
          testImportedBookmarks();

          waitForAsyncUpdates(function () {
            remove_all_bookmarks();
            run_next_test();
          });
        });
      } else {
        do_throw("couldn't import the exported file.");
      }
    });
  } catch(ex) { do_throw("couldn't import the exported file: " + ex); }
});

add_test(function test_emptytitle_export()
{
  // Test exporting and importing with an empty-titled bookmark.
  // 1. import bookmarks
  // 1. create an empty-titled bookmark.
  // 2. export to bookmarks.exported.html
  // 3. empty bookmarks db
  // 4. import bookmarks.exported.html
  // 5. run the test-suite

  try {
    BookmarkHTMLUtils.importFromFile(gBookmarksFileNew, true, function(success) {
      if (success) {
        const NOTITLE_URL = "http://notitle.mozilla.org/";
        let id = PlacesUtils.bookmarks.insertBookmark(PlacesUtils.unfiledBookmarksFolderId,
                                                      NetUtil.newURI(NOTITLE_URL),
                                                      PlacesUtils.bookmarks.DEFAULT_INDEX,
                                                      "");
        test_bookmarks.unfiled.push({ title: "", url: NOTITLE_URL });

        try {
          exporter.exportHTMLToFile(gBookmarksFileNew);
        } catch(ex) { do_throw("couldn't export to file: " + ex); }

        remove_all_bookmarks();

        try {
          BookmarkHTMLUtils.importFromFile(gBookmarksFileNew, true, function(success) {
           if (success) {
              waitForAsyncUpdates(function () {
                testImportedBookmarks();

                // Cleanup.
                test_bookmarks.unfiled.pop();
                PlacesUtils.bookmarks.removeItem(id);

                try {
                  exporter.exportHTMLToFile(gBookmarksFileNew);
                } catch(ex) { do_throw("couldn't export to file: " + ex); }

                waitForAsyncUpdates(function () {
                  remove_all_bookmarks();
                  run_next_test();
                });
              });
            } else {
              do_throw("couldn't import the exported file.");
            }
          });
        } catch(ex) { do_throw("couldn't import the exported file: " + ex); }
      } else {
        do_throw("couldn't import the exported file.");
      }
    });
  } catch(ex) { do_throw("couldn't import the exported file: " + ex); }
});

add_test(function test_import_ontop()
{
  // Test importing the exported bookmarks.html file *on top of* the existing
  // bookmarks.
  // 1. empty bookmarks db
  // 2. import the exported bookmarks file
  // 3. export to file
  // 3. import the exported bookmarks file
  // 4. run the test-suite

  try {
    BookmarkHTMLUtils.importFromFile(gBookmarksFileNew, true, function(success) {
      if (success) {
        try {
          exporter.exportHTMLToFile(gBookmarksFileNew);
        } catch(ex) { do_throw("couldn't export to file: " + ex); }
        try {
          BookmarkHTMLUtils.importFromFile(gBookmarksFileNew, true, function(success) {
            if (success) {
              waitForAsyncUpdates(function () {
                testImportedBookmarks();

                waitForAsyncUpdates(function () {
                  remove_all_bookmarks();
                  run_next_test();
                });
              });
            } else {
              do_throw("couldn't import the exported file.");
            }
          });
        } catch(ex) { do_throw("couldn't import the exported file: " + ex); }

      } else {
        do_throw("couldn't import the exported file.");
      }
    });
  } catch(ex) { do_throw("couldn't import the exported file: " + ex); }
});

function testImportedBookmarks()
{
  for (let group in test_bookmarks) {
    do_print("[testImportedBookmarks()] Checking group '" + group + "'");

    let root;
    switch (group) {
      case "menu":
        root = PlacesUtils.getFolderContents(PlacesUtils.bookmarksMenuFolderId).root;
        break;
      case "toolbar":
        root = PlacesUtils.getFolderContents(PlacesUtils.toolbarFolderId).root;
        break;
      case "unfiled":
        root = PlacesUtils.getFolderContents(PlacesUtils.unfiledBookmarksFolderId).root;
        break;
    }

    let items = test_bookmarks[group];
    do_check_eq(root.childCount, items.length);

    items.forEach(function (item, index) checkItem(item, root.getChild(index)));

    root.containerOpen = false;
  }
}

function testImportedBookmarksToFolder(aFolder)
{
  root = PlacesUtils.getFolderContents(aFolder).root;

  // Menu bookmarks are put directly into the folder, while other roots are
  // imported into subfolders.
  let rootFolderCount = test_bookmarks.menu.length;

  for (let i = 0; i < root.childCount; i++) {
    let child = root.getChild(i);
    // This check depends on all "menu" bookmarks being listed first in the imported file :-|
    if (i < rootFolderCount) {
      checkItem(test_bookmarks.menu[i], child);
    }
    else {
      let container = child.QueryInterface(Ci.nsINavHistoryContainerResultNode);
      let group = /Toolbar/.test(container.title) ? test_bookmarks.toolbar
                                                  : test_bookmarks.unfiled;
      container.containerOpen = true;
      do_print("[testImportedBookmarksToFolder()] Checking container '" + container.title + "'");
      for (let t = 0; t < container.childCount; t++) {
        checkItem(group[t], container.getChild(t));
      }
      container.containerOpen = false;
    }
  }

  root.containerOpen = false;
}

function checkItem(aExpected, aNode)
{
  let id = aNode.itemId;
  for (prop in aExpected) {
    switch (prop) {
      case "title":
        do_check_eq(aNode.title, aExpected.title);
        break;
      case "description":
        do_check_eq(PlacesUtils.annotations
                               .getItemAnnotation(id, PlacesUIUtils.DESCRIPTION_ANNO),
                    aExpected.description);
        break;
      case "dateAdded":
          do_check_eq(PlacesUtils.bookmarks.getItemDateAdded(id),
                      aExpected.dateAdded);
        break;
      case "lastModified":
          do_check_eq(PlacesUtils.bookmarks.getItemLastModified(id),
                      aExpected.lastModified);
        break;
      case "url":
        PlacesUtils.livemarks.getLivemark(
          { id: id },
          function (aStatus, aLivemark) {
            if (!Components.isSuccessCode(aStatus)) {
              do_check_eq(aNode.uri, aExpected.url);
            }
          }
        );
        break;
      case "icon":
        let faviconURI = PlacesUtils.favicons.getFaviconForPage(
          NetUtil.newURI(aExpected.url)
        );
        let dataURL = PlacesUtils.favicons.getFaviconDataAsDataURL(faviconURI);
        // Avoid do_check_eq for console spam.
        do_check_true(dataURL == aExpected.icon);
        break;
      case "keyword":
        break;
      case "sidebar":
        do_check_eq(PlacesUtils.annotations
                               .itemHasAnnotation(id, PlacesUIUtils.LOAD_IN_SIDEBAR_ANNO),
                    aExpected.sidebar);
        break;
      case "postData":
        do_check_eq(PlacesUtils.annotations
                               .getItemAnnotation(id, PlacesUtils.POST_DATA_ANNO),
                    aExpected.postData);
        break;
      case "charset":
        do_check_eq(PlacesUtils.history.getCharsetForURI(NetUtil.newURI(aNode.uri)),
                    aExpected.charset);
        break;
      case "feedUrl":
        PlacesUtils.livemarks.getLivemark(
          { id: id },
          function (aStatus, aLivemark) {
            do_check_true(Components.isSuccessCode(aStatus));
            do_check_eq(aLivemark.siteURI.spec, aExpected.url);
            do_check_eq(aLivemark.feedURI.spec, Expected.feedUrl);
          }
        );
        break;
      case "children":
        let folder = aNode.QueryInterface(Ci.nsINavHistoryContainerResultNode);
        do_check_eq(folder.hasChildren, aExpected.children.length > 0);
        folder.containerOpen = true;
        do_check_eq(folder.childCount, aExpected.children.length);

        aExpected.children.forEach(function (item, index) checkItem(item, folder.getChild(index)));

        folder.containerOpen = false;
        break;
      default:
        throw new Error("Unknown property");
    }
  };
}
