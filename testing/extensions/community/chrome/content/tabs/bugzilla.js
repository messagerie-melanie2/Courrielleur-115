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
 * The Original Code is the Mozilla Community QA Extension
 *
 * The Initial Developer of the Original Code is the Mozilla Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Ben Hsieh <ben.hsieh@gmail.com>
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

var bugzilla = {
    trunkVersion : "3.0",
    baseURL : qaPref.getPref(qaPref.prefBase+".bugzilla.url", "char"),
    sysconfig: null,
    bugReader : null,
    doSearch : function() {

        var words = $("qa-bugzilla-input-keywords").value;
        var bugId = $("qa-bugzilla-input-id").value;

        if ($("qa-bugzilla-radio-words").selected) { // keyword search

            if ($("qa-bugzilla-input-os").checked && words.indexOf("os:") == -1) {
                if (bugzilla.sysconfig == null) bugzilla.sysconfig = new Sysconfig();
                words += " os:" + bugzilla.sysconfig.opsys.substr(0,3);
            }
            if ($("qa-bugzilla-input-version").checked && words.indexOf("version:") == -1) {
                if (bugzilla.sysconfig == null) bugzilla.sysconfig = new Sysconfig();
                var branch = bugzilla.sysconfig.branch.substr(0,3);
                if (branch.indexOf(bugzilla.trunkVersion) != -1) branch = "Trunk";

                words += " version:" + branch;
            }

            bugzilla.loadBugGroup(words);
        } else {  //id search
            bugzilla.loadBug(bugId);
        }
    },
    showRecent : function() {
        $("qa-bugzilla-input-radiogroup").selectedItem = $("qa-bugzilla-radio-words");
        bugzilla.disableOther();
        bugzilla.loadBugGroup("product=Core&product=Firefox&product=Mozilla+Application+Suite&product=Thunderbird&product=Toolkit"
                              +"&bug_status=UNCONFIRMED,NEW,ASSIGNED,REOPENED,RESOLVED&chfield=%5BBug%20creation%5D&chfieldfrom=-24h"
                              , true);
    },
    loadBugGroup : function (param, detailsearch) {
        var callback = function(bugarray) {  // bugarray is a 2d array with id and summaries

                var menu = document.getElementById('bugSearchList');
                while (menu.getRowCount()) {  // clear menu
                    menu.removeItemAt(0);
                };

                for (var i = 0; i < bugarray.length; i++) {
                    var row = document.createElement("listitem");
                    row.value = bugarray[i][0];
                    var number = document.createElement("listcell");
                    number.setAttribute("label", bugarray[i][0]);
                    var name = document.createElement("listcell");
                    name.setAttribute("label", bugarray[i][1]);
                    name.setAttribute("crop", "end");
                    name.setAttribute("maxwidth", "175");
                    row.appendChild(number);
                    row.appendChild(name);
                    menu.appendChild(row);
                }

                if(bugarray.length) menu.selectedIndex = 0;

                $("qa-bugzilla-input-keywords").value = param;
                if ($('qa_tabrow').selectedItem != $('qa-tabbar-bugzilla')) {
                    bugzilla.highlightTab();
                }
            }

            if (bugzilla.bugReader == null) bugzilla.bugReader = new bugAccess();
            bugzilla.bugReader.setBugSearchOnloadFunc(callback);

            if (detailsearch) bugzilla.bugReader.getBugList(bugzilla.baseURL, "buglist.cgi?="+param, 0);
            else bugzilla.bugReader.getBugList(bugzilla.baseURL, "quicksearch="+param, 0);
    },
    loadBug : function (bugId, preserveCurrent) {
        var callback = function(bugObj) {
            // menu
            var menu = document.getElementById('bugSearchList');
            while (menu.getRowCount() && !preserveCurrent) {  // clear menu
                menu.removeItemAt(0);
            };

            var row = document.createElement("listitem");
            row.value = bugObj["id"];
            var number = document.createElement("listcell");
            number.setAttribute("label", bugObj["id"]);
            var name = document.createElement("listcell");
            name.setAttribute("label", bugObj["title"]);
            name.setAttribute("crop", "end");
            name.setAttribute("maxwidth", "175");
            row.appendChild(number);
            row.appendChild(name);
            menu.appendChild(row);

            // summary
            $("qa-bugzilla-input-id").value = $("qa-bugzilla-output-id").value = bugObj["id"];
            $("qa-bugzilla-output-status").value = bugObj["status"];
            $("qa-bugzilla-output-summary").value = bugObj["info"];

            qaTools.assignLinkHandlers($("qa-bugzilla-output-summary"));

            if ($('qa_tabrow').selectedItem != $('qa-tabbar-bugzilla')) {
                bugzilla.highlightTab();
            }
        }
        if (bugzilla.bugReader == null) bugzilla.bugReader = new bugAccess();
        bugzilla.bugReader.getBugSpecs(bugId, bugzilla.baseURL, callback);
    },
    disableOther : function() {
        if ($("qa-bugzilla-radio-words").selected) {
            $("qa-bugzilla-input-keywords").disabled = false;
            $("qa-bugzilla-input-os").disabled = false;
            $("qa-bugzilla-input-version").disabled = false;
            $("qa-bugzilla-input-id").disabled = true;
        } else {
            $("qa-bugzilla-input-id").disabled = false;
            $("qa-bugzilla-input-keywords").disabled = true;
            $("qa-bugzilla-input-os").disabled = true;
            $("qa-bugzilla-input-version").disabled = true;
        }
    },
    handleSelect : function() {
        var menu = $('bugSearchList');
        if (menu.selectedItem.value == $("qa-bugzilla-output-id").value) return;

        var callback = function(bugObj) {
            $("qa-bugzilla-output-id").value = bugObj["id"];
            $("qa-bugzilla-output-status").value = bugObj["status"];
            $("qa-bugzilla-output-summary").value = bugObj["info"];
        }
        if (bugzilla.bugReader == null) bugzilla.bugReader = new bugAccess();
        bugzilla.bugReader.getBugSpecs(menu.selectedItem.value, bugzilla.baseURL, callback);
    },
    highlightTab : function() {
        $('qa-tabbar-bugzilla').className = "tabbrowser-tab highlight";
    },
    unhighlightTab : function() {
        $('qa-tabbar-bugzilla').className = "tabbrowser-tab";
    },
    openInBugzilla : function() {
        if ($("qa-bugzilla-output-id").value == "") {
            alert("no value");
            return;
        }
        var url = bugzilla.baseURL + "show_bug.cgi?id=" + $("qa-bugzilla-output-id").value;

        var type = qaPref.getPref("browser.link.open_external", "int");
        var where = "tab";
        if (type == 2) where = "window";

        openUILinkIn(url, where);
    },
    findBugzillaLinks : function(node) {  // assumes HTML-ns node
        var RV = new Array();
        var innerstr = node.innerHTML;

        var prefix = "show_bug.cgi?id=";
        var index = innerstr.indexOf(prefix);
        dump(innerstr);
        if (index == -1) {
            //TODO: search for "bug"? is that too broad?
        } else {
            while(index != -1) {
                RV.push(innerstr.substr(index+prefix.length,6));
                dump(RV.length + " found so far, current index: " + index+ " \n");
                index = innerstr.indexOf(prefix, index + 1);
            }
        }
        return qaTools.makeUniqueArray(RV);
    }
}
