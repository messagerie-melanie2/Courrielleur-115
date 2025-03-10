/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Mozilla Communicator client code, released
 * March 31, 1998.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998-1999
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
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

Components.utils.import("resource://gre/modules/Services.jsm");

var selectedServer = null;

function OnInit()
{
    // Set the header for the page.
    // Title containts the brand name of the application and the account
    // type (mail/news) and the name of the account
    try {
        let protocolInfo = null;
        let msgFolder    = null;
        let title;

        // Get the brand name
        let brandName = document.getElementById("bundle_brand")
                                .getString("brandShortName");
        let messengerBundle = document.getElementById("bundle_messenger");

        selectedServer = GetSelectedServer();
        if (selectedServer) {
            // Get the account type
            let serverType = selectedServer.type;
            let acctType;
            if (serverType == "nntp")
                acctType = messengerBundle.getString("newsAcctType");
            else if (serverType == "rss")
                acctType = messengerBundle.getString("feedsAcctType");
            else
                acctType = messengerBundle.getString("mailAcctType");

            // Get the account name
            msgFolder = GetSelectedMsgFolder();
            let acctName = msgFolder.prettyName;
            // Display and collapse items presented to the user based on account type
            protocolInfo = Components
              .classes["@mozilla.org/messenger/protocol/info;1?type=" + serverType]
              .getService(Components.interfaces.nsIMsgProtocolInfo);
            title = messengerBundle.getFormattedString("acctCentralTitleFormat",
                                                       [brandName, acctType, acctName]);
        } else {
            title = brandName;
        }

        // Set the title for the document
        document.getElementById("AccountCentralTitle").setAttribute("value", title);

        ArrangeAccountCentralItems(selectedServer, protocolInfo, msgFolder);
    }
    catch(ex) {
        Components.utils.reportError("Error getting selected account: " + ex + "\n");
    }
}

// Show items in the AccountCentral page depending on the capabilities
// of the given account
function ArrangeAccountCentralItems(server, protocolInfo, msgFolder)
{
    let exceptions = [];

    // Is this a RSS account?
    let displayRssHeader = server && server.type == 'rss';

    /***** Email header and items : Begin *****/

    // Read Messages
    let canGetMessages = false;
    try {
        canGetMessages = protocolInfo && protocolInfo.canGetMessages;
        SetItemDisplay("ReadMessages", canGetMessages && !displayRssHeader);
    } catch (e) { exceptions.push(e); }

    // Compose Messages link
    let showComposeMsgLink = false;
    try {
        showComposeMsgLink = protocolInfo && protocolInfo.showComposeMsgLink;
        SetItemDisplay("ComposeMessage", showComposeMsgLink);
    } catch (e) { exceptions.push(e); }

    // Junk mail settings (false, until ready for prime time)
    let canControlJunkEmail = false
    try {
        canControlJunkEmail = false && protocolInfo &&
                              protocolInfo.canGetIncomingMessages &&
                              protocolInfo.canGetMessages;
        SetItemDisplay("JunkSettingsMail", canControlJunkEmail);
    } catch (e) { exceptions.push(e); }

    // Display Email header, only if any of the items are displayed
    let displayEmailHeader = !displayRssHeader &&
                             (canGetMessages || showComposeMsgLink ||
                              canControlJunkEmail);
    SetItemDisplay("EmailHeader", displayEmailHeader);

    /***** Email header and items : End *****/

    /***** News header and items : Begin *****/

    // Subscribe to Newsgroups
    let canSubscribe = false;
    try {
        canSubscribe = msgFolder && msgFolder.canSubscribe &&
                       protocolInfo && !protocolInfo.canGetMessages;
        SetItemDisplay("SubscribeNewsgroups", canSubscribe);
    } catch (e) { exceptions.push(e); }

    // Junk news settings (false, until ready for prime time)
    let canControlJunkNews = false;
    try {
        canControlJunkNews = false && protocolInfo &&
                             protocolInfo.canGetIncomingMessages &&
                             !protocolInfo.canGetMessages;
        SetItemDisplay("JunkSettingsNews", canControlJunkNews);
    } catch (e) { exceptions.push(e); }

    // Display News header, only if any of the items are displayed
    let displayNewsHeader = canSubscribe || canControlJunkNews;
    SetItemDisplay("NewsHeader", displayNewsHeader);

    /***** News header and items : End *****/

    /***** RSS header and items : Begin *****/

    // Display RSS header, only if this is RSS account
    SetItemDisplay("rssHeader", displayRssHeader);

    // Subscribe to RSS Feeds
    SetItemDisplay("SubscribeRSS", displayRssHeader);

    /***** RSS header and items : End *****/

    // If either of above sections exists, show section separators
    if (displayNewsHeader || displayEmailHeader || displayRssHeader) {
        UncollapseSectionSeparators("MessagesSection.separator");
    }

    /***** Accounts : Begin *****/

    // Account Settings if a server is found
    let canShowAccountSettings = server != null;
    SetItemDisplay("AccountSettings", canShowAccountSettings);

    // Show New Mail Account Wizard if not prohibited by pref
    let canShowCreateAccount = false;
    try {
        canShowCreateAccount = !Services.prefs
          .prefIsLocked("mail.disable_new_account_addition");
        SetItemDisplay("CreateAccount", canShowCreateAccount);
    } catch (e) { exceptions.push(e); }

    // Display Accounts header, only if any of the items are displayed
    let displayAccountsHeader = canShowAccountSettings || canShowCreateAccount;
    SetItemDisplay("AccountsHeader", canShowCreateAccount);

    /***** Accounts : End *****/

    /***** Advanced Features header and items : Begin *****/

    // Search Messages
    let canSearchMessages = false;
    try {
        canSearchMessages = server && server.canSearchMessages;
        SetItemDisplay("SearchMessages", canSearchMessages);
    } catch (e) { exceptions.push(e); }

    // Create Filters
    let canHaveFilters = false;
    try {
        canHaveFilters = server && server.canHaveFilters;
        SetItemDisplay("CreateFilters", canHaveFilters);
    } catch (e) { exceptions.push(e); }

    // Subscribe to IMAP Folders
    let canSubscribeImapFolders = false;
    try {
        canSubscribeImapFolders = msgFolder && msgFolder.canSubscribe &&
                                  protocolInfo && protocolInfo.canGetMessages;
        SetItemDisplay("SubscribeImapFolders", canSubscribeImapFolders);
    } catch (e) { exceptions.push(e); }

    // Offline Settings
    let supportsOffline = false;
    try {
        supportsOffline = server && server.offlineSupportLevel != 0;
        SetItemDisplay("OfflineSettings", supportsOffline);
    } catch (e) { exceptions.push(e); }

    // Display Adv Features header, only if any of the items are displayed
    let displayAdvFeatures = canSearchMessages || canHaveFilters ||
                             canSubscribeImapFolders|| supportsOffline;
    SetItemDisplay("AdvancedFeaturesHeader", displayAdvFeatures);

    /***** Advanced Featuers header and items : End *****/

    // If either of above features exist, show section separators
    if (displayAdvFeatures) {
        UncollapseSectionSeparators("AccountsSection.separator");
    }

    while (exceptions.length) {
        Components.utils.reportError("Error in setting AccountCentral Items: "
            + exceptions.pop() + "\n");
    }
}

// Show the item if the item feature is supported
function SetItemDisplay(elemId, displayThisItem)
{
    if (displayThisItem) {
        let elem = document.getElementById(elemId);
        elem.setAttribute("collapsed", false);

        let separatorId = elemId + ".separator";
        let elemSeparator = document.getElementById(separatorId);
        if (elemSeparator)
            elemSeparator.setAttribute("collapsed", false);
    }
}

// Show section separators
function UncollapseSectionSeparators(separatorBaseId)
{
    for (let i = 1; i <= 3; i++) {
        var separatorId = separatorBaseId + i;
        var separator = document.getElementById(separatorId);
        separator.setAttribute("collapsed", false);
    }
}

// From the current folder tree, return the selected server or null
function GetSelectedServer()
{
    let currentFolder = GetSelectedMsgFolder();
    return currentFolder ? currentFolder.server : null;
}

// From the current folder tree, return the selected folder,
// the root folder of default account or null
function GetSelectedMsgFolder()
{
    return window.parent.GetSelectedMsgFolders()[0] ||
           window.parent.GetDefaultAccountRootFolder();
}

/**
 * Open Inbox for selected server.
 * If needed, open the twisty and select Inbox.
 */
function ReadMessages()
{
    if (!selectedServer)
        return;
    try {
        window.parent.OpenInboxForServer(selectedServer);
    }
    catch(ex) {
        Components.utils
                  .reportError("Error opening Inbox for server: " + ex + "\n");
    }
}

// Trigger composer for a new message
function ComposeAMessage(event)
{
    window.parent.MsgNewMessage(null);
}

/**
 * Open AccountManager to view settings for a given account
 * @param selectPage  the xul file name for the viewing page,
 *                    null for the account main page, other pages are
 *                    'am-server.xul', 'am-copies.xul', 'am-offline.xul',
 *                    'am-addressing.xul', 'am-smtp.xul'
 */
function ViewSettings(selectPage)
{
    window.parent.MsgAccountManager(selectPage);
}

// Open AccountWizard to create an account
function CreateNewAccount()
{
    window.parent.msgOpenAccountWizard();
}

function CreateNewAccountTB()
{
    if (gPrefBranch.getBoolPref("mail.provider.enabled"))
        NewMailAccountProvisioner(null);
    else
        AddMailAccount();
}

// Bring up search interface for selected account
function SearchMessages()
{
    window.parent.MsgSearchMessages();
}

// Open filters window
function CreateMsgFilters()
{
    window.parent.MsgFilters(null, null);
}

// Open Subscribe dialog
function Subscribe()
{
    if (!selectedServer)
        return;
    if (selectedServer.type == 'rss')
        window.parent.openSubscriptionsDialog(selectedServer.rootFolder);
    else
        window.parent.MsgSubscribe();
}

// Open junk mail settings dialog
function JunkSettings()
{
    // TODO: function does not exist yet, will throw an exception if exposed
    window.parent.MsgJunkMail();
}
