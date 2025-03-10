/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
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

var GLOBAL = this + '';

function htmlesc(str) {
  if (str == '<')
    return '&lt;';
  if (str == '>')
    return '&gt;';
  if (str == '&')
    return '&amp;';
  return str;
}

function DocumentWrite(s)
{
  try
  {
    var msgDiv = document.createElement('div');
    msgDiv.innerHTML = s;
    document.body.appendChild(msgDiv);
    msgDiv = null;
  }
  catch(excp)
  {
    document.write(s + '<br>\n');
  }
}

function print() {
  var s = '';
  var a;
  for (var i = 0; i < arguments.length; i++)
  {
    a = arguments[i];
    s += String(a) + ' ';
  }

  if (typeof dump == 'function')
  {
    dump( s + '\n');
  }

  s = s.replace(/[<>&]/g, htmlesc);

  DocumentWrite(s);
}

function writeHeaderToLog( string ) {
  string = String(string);

  if (typeof dump == 'function')
  {
    dump( string + '\n');
  }

  string = string.replace(/[<>&]/g, htmlesc);

  DocumentWrite( "<h2>" + string + "</h2>" );
}

function writeFormattedResult( expect, actual, string, passed ) {
  string = String(string);

  if (typeof dump == 'function')
  {
    dump( string + '\n');
  }

  string = string.replace(/[<>&]/g, htmlesc);

  var s = "<tt>"+ string ;
  s += "<b>" ;
  s += ( passed ) ? "<font color=#009900> &nbsp;" + PASSED
    : "<font color=#aa0000>&nbsp;" +  FAILED + expect + "</tt>";

  DocumentWrite( s + "</font></b></tt><br>" );
  return passed;
}

window.onerror = function (msg, page, line)
{
  optionsPush();

  if (typeof DESCRIPTION == 'undefined')
  {
    DESCRIPTION = 'Unknown';
  }
  if (typeof EXPECTED == 'undefined')
  {
    EXPECTED = 'Unknown';
  }

  var testcase = new TestCase(gTestfile, DESCRIPTION, EXPECTED, "error");

  if (document.location.href.indexOf('-n.js') != -1)
  {
    // negative test
    testcase.passed = true;
  }

  testcase.reason += msg;

  if (typeof(page) != 'undefined')
  {
    testcase.reason += ' Page: ' + page;
  }
  if (typeof(line) != 'undefined')
  {
    testcase.reason += ' Line: ' + line;
  }

  reportFailure(msg);

  optionsReset();
};

function gc()
{
  // Thanks to igor.bukanov@gmail.com
  for (var i = 0; i != 100000; ++i)
  {
    var tmp = new Object();
  }
}

function jsdgc()
{
  try
  {
    // Thanks to dveditz
    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
    var jsdIDebuggerService = Components.interfaces.jsdIDebuggerService;
    var service = Components.classes['@mozilla.org/js/jsd/debugger-service;1'].
      getService(jsdIDebuggerService);
    service.GC();
  }
  catch(ex)
  {
    print('gc: ' + ex);
  }
}

function quit()
{
}

function Preferences(aPrefRoot)
{
  try
  {
    this.orig = {};
    this.privs = 'UniversalXPConnect UniversalPreferencesRead ' +
      'UniversalPreferencesWrite';

    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);

      var nsIPrefService = Components.interfaces.nsIPrefService;
      var nsIPrefBranch = Components.interfaces.nsIPrefBranch;
      var nsPrefService_CONTRACTID = "@mozilla.org/preferences-service;1";

      this.prefRoot    = aPrefRoot;
      this.prefService = Components.classes[nsPrefService_CONTRACTID].
        getService(nsIPrefService);
      this.prefBranch = this.prefService.getBranch(aPrefRoot).
        QueryInterface(Components.interfaces.nsIPrefBranch2);
    }
  }
  catch(ex)
  {
  }

}

function Preferences_getPrefRoot()
{
  var root;

  try
  {
    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);
    }

    root = this.prefBranch.root;
  }
  catch(ex)
  {
  }
  return root;
}

function Preferences_getPref(aPrefName)
{
  var value;
  try
  {
    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);
      try
      {
        value = this.prefBranch.getBoolPref(aPrefName);
      }
      catch(ex)
      {
      }
    }
  }
  catch(ex2)
  {
  }
  return value;
}

function Preferences_setPref(aPrefName, aPrefValue)
{
  try
  {
    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);

      if (typeof this.orig[aPrefName] == 'undefined')
      {
        this.orig[aPrefName] = this.getPref(aPrefName);
      }

      try
      {
        value = this.prefBranch.setBoolPref(aPrefName, aPrefValue);
      }
      catch(ex)
      {
      }
    }

  }
  catch(ex2)
  {
  }
}

function Preferences_resetPref(aPrefName)
{
  try
  {
    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);

      if (aPrefName in this.orig)
      {
        this.setPref(aPrefName, this.orig[aPrefName]);
      }
    }
  }
  catch(ex)
  {
  }
}

function Preferences_resetAllPrefs()
{
  try
  {
    var prefName;
    var prefValue;

    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);
      for (prefName in this.orig)
      {
        this.setPref(prefName, this.orig[prefName]);
      }
    }
  }
  catch(ex)
  {
  }
}

function Preferences_clearPref(aPrefName)
{
  try
  {
    if (typeof netscape != 'undefined' &&
        'security' in netscape &&
        'PrivilegeManager' in netscape.security &&
        'enablePrivilege' in netscape.security.PrivilegeManager)
    {
      netscape.security.PrivilegeManager.enablePrivilege(this.privs);
      this.prefBranch.clearUserPref(aPrefName);
    }
  }
  catch(ex)
  {
  }
}

Preferences.prototype.getPrefRoot    = Preferences_getPrefRoot;
Preferences.prototype.getPref        = Preferences_getPref;
Preferences.prototype.setPref        = Preferences_setPref;
Preferences.prototype.resetAllPrefs  = Preferences_resetAllPrefs;
Preferences.prototype.resetPref      = Preferences_resetPref;
Preferences.prototype.clearPref      = Preferences_clearPref;

function options(aOptionName)
{
  // return value of options() is a comma delimited list
  // of the previously set values

  var value = '';
  for (var optionName in options.currvalues)
  {
    value += optionName + ',';
  }
  if (value)
  {
    value = value.substring(0, value.length-1);
  }

  if (aOptionName)
  {
    if (options.currvalues[aOptionName])
    {
      // option is set, toggle it to unset
      delete options.currvalues[aOptionName];
      options.preferences.setPref(aOptionName, false);
    }
    else
    {
      // option is not set, toggle it to set
      options.currvalues[aOptionName] = true;
      options.preferences.setPref(aOptionName, true);
    }
  }

  return value;
}

function optionsInit() {

  // hash containing the set options
  options.currvalues = {strict:     '',
                        werror:     '',
                        atline:     '',
                        xml:        '',
                        relimit:    '',
                        anonfunfux: ''
  }

  // record initial values to support resetting
  // options to their initial values
  options.initvalues  = {};

  // record values in a stack to support pushing
  // and popping options
  options.stackvalues = [];

  options.preferences = new Preferences('javascript.options.');

  for (var optionName in options.currvalues)
  {
    if (!options.preferences.getPref(optionName))
    {
      delete options.currvalues[optionName];
    }
    else
    {
      options.initvalues[optionName] = '';
    }
  }
}

var gVersion = 150;

function jsTestDriverBrowserInit()
{
  if (typeof dump != 'function')
  {
    dump = print;
  }

  optionsInit();
  optionsClear();

  if (document.location.search.indexOf('?') != 0)
  {
    // not called with a query string
    return;
  }

  var re = /test=([^;]+);language=(language|type);([a-zA-Z0-9.=;\/]+)/;
  var matches = re.exec(document.location.search);

  // testpath http://machine/path-to-suite/sub-suite/test.js
  var testpath  = matches[1];
  var attribute = matches[2];
  var value     = matches[3];

  if (testpath)
  {
    gTestPath = testpath;
  }

  var ise4x = /e4x\//.test(testpath);

  if (value.indexOf('1.1') != -1)
  {
    gVersion = 110;
  }
  else if (value.indexOf('1.2') != -1)
  {
    gVersion = 120;
  }
  else if (value.indexOf('1.3') != -1)
  {
    gVersion = 130;
  }
  else if (value.indexOf('1.4') != -1)
  {
    gVersion = 140;
  }
  else if(value.indexOf('1.5') != -1)
  {
    gVersion = 150;
  }
  else if(value.indexOf('1.6') != -1)
  {
    gVersion = 160;
  }
  else if(value.indexOf('1.7') != -1)
  {
    gVersion = 170;
  }
  else if(value.indexOf('1.8') != -1)
  {
    gVersion = 180;
  }
  else if(value.indexOf('1.9') != -1)
  {
    gVersion = 190;
  }

  var testpathparts = testpath.split(/\//);

  if (testpathparts.length < 3)
  {
    // must have at least suitepath/subsuite/testcase.js
    return;
  }
  var suitepath = testpathparts.slice(0,testpathparts.length-2).join('/');
  var subsuite = testpathparts[testpathparts.length - 2];
  var test     = testpathparts[testpathparts.length - 1];

  // should be set in the test file from now on
  //gTestfile = test;

/*
 * loaded in the js-test-driver-*.html now
 outputscripttag('shell.js', attribute, value,
 false);
 outputscripttag('browser.js', attribute, value,
 false);
*/
  outputscripttag(suitepath + '/shell.js', attribute, value,
                  ise4x);
  outputscripttag(suitepath + '/browser.js', attribute, value,
                  ise4x);
  outputscripttag(suitepath + '/' + subsuite + '/shell.js', attribute, value,
                  ise4x);
  outputscripttag(suitepath + '/' + subsuite + '/browser.js', attribute, value,
                  ise4x);
  outputscripttag(suitepath + '/' + subsuite + '/' + test, attribute, value,
                  ise4x);

  document.write('<title>' + suitepath + '/' + subsuite + '/' + test +
                 '<\/title>');

  outputscripttag('js-test-driver-end.js', attribute, value,
                  false);
  return;
}

function outputscripttag(src, attribute, value, ise4x)
{
  if (!src)
  {
    return;
  }

  var s = '<script src="' +  src + '" ';

  if (ise4x)
  {
    if (attribute == 'type')
    {
      value += ';e4x=1 ';
    }
    else
    {
      s += ' type="text/javascript';
      if (gVersion != 150)
      {
        s += ';version=' + gVersion/100;
      }
      s += ';e4x=1" ';
    }
  }

  s +=  attribute + '="' + value + '"><\/script>';

  document.write(s);
}

function jsTestDriverEnd()
{
  // gDelayTestDriverEnd is used to
  // delay collection of the test result and
  // signal to Spider so that tests can continue
  // to run after page load has fired. They are
  // responsible for setting gDelayTestDriverEnd = true
  // then when completed, setting gDelayTestDriverEnd = false
  // then calling jsTestDriverEnd()

  if (gDelayTestDriverEnd)
  {
    return;
  }

  window.onerror = null;

  try
  {
    optionsReset();
  }
  catch(ex)
  {
    dump('jsTestDriverEnd ' + ex);
  }

  if (window.opener && window.opener.runNextTest)
  {
    if (window.opener.reportCallBack)
    {
      window.opener.reportCallBack(window.opener.gWindow);
    }
    setTimeout('window.opener.runNextTest()', 250);
  }
  else
  {
    for (var i = 0; i < gTestcases.length; i++)
    {
      gTestcases[i].dump();
    }

    // tell Spider page is complete
    gPageCompleted = true;
  }
}

jsTestDriverBrowserInit();
