/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, you can obtain one at http://mozilla.org/MPL/2.0/. */

add_setup(async () => {
  MailServices.accounts.createLocalMailAccount();
  let localRoot =
    MailServices.accounts.localFoldersServer.rootFolder.QueryInterface(
      Ci.nsIMsgLocalMailFolder
    );
  let folder = localRoot.createLocalSubfolder("AttachmentA");
  await createMessageFromFile(
    folder,
    getTestFilePath("messages/attachedMessageSample.eml")
  );
});

add_task(async function testOpenAttachment() {
  let files = {
    "background.js": async () => {
      let { messages } = await browser.messages.query({
        headerMessageId: "sample.eml@mime.sample",
      });

      async function testTab(tab) {
        let tabPromise = window.waitForEvent("tabs.onCreated");
        let messagePromise = window.waitForEvent(
          "messageDisplay.onMessageDisplayed"
        );
        await browser.messages.openAttachment(
          messages[0].id,
          // Open the eml attachment.
          "1.2",
          tab.id
        );

        let [msgTab] = await tabPromise;
        let [openedMsgTab, message] = await messagePromise;

        browser.test.assertEq(
          msgTab.id,
          openedMsgTab.id,
          "The opened tab should match the onMessageDisplayed event tab"
        );
        browser.test.assertEq(
          message.headerMessageId,
          "sample-attached.eml@mime.sample",
          "Should have opened the correct message"
        );

        await browser.tabs.remove(msgTab.id);
      }

      // Test using a mail tab.
      let mailTab = await browser.mailTabs.getCurrent();
      await testTab(mailTab);

      // Test using a content tab.
      let contentTab = await browser.tabs.create({ url: "test.html" });
      await testTab(contentTab);
      await browser.tabs.remove(contentTab.id);

      // Test using a content window.
      let contentWindow = await browser.windows.create({
        type: "popup",
        url: "test.html",
      });
      await testTab(contentWindow.tabs[0]);
      await browser.windows.remove(contentWindow.id);

      // Test using a message tab.
      let messageTab = await browser.messageDisplay.open({
        messageId: messages[0].id,
        location: "tab",
      });
      await testTab(messageTab);
      await browser.tabs.remove(messageTab.id);

      // Test using a message window.
      let messageWindowTab = await browser.messageDisplay.open({
        messageId: messages[0].id,
        location: "window",
      });
      await testTab(messageWindowTab);
      await browser.tabs.remove(messageWindowTab.id);

      browser.test.notifyPass("finished");
    },
    "utils.js": await getUtilsJS(),
  };
  let extension = ExtensionTestUtils.loadExtension({
    files,
    manifest: {
      background: { scripts: ["utils.js", "background.js"] },
      permissions: [
        "accountsRead",
        "messagesRead",
        "messagesMove",
        "messagesDelete",
      ],
    },
  });

  await extension.startup();
  await extension.awaitFinish("finished");
  await extension.unload();
});
