/* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set sts=2 sw=2 et tw=80: */
"use strict";

add_task(async function test_multiple_messages_selected() {
  let account = createAccount();
  let rootFolder = account.incomingServer.rootFolder;
  let subFolders = rootFolder.subFolders;
  createMessages(subFolders[0], 2);
  await TestUtils.waitForCondition(
    () => subFolders[0].messages.hasMoreElements(),
    "Messages should be added to folder"
  );

  async function background() {
    browser.commands.onCommand.addListener((commandName, activeTab) => {
      browser.test.sendMessage("oncommand event received", {
        commandName,
        activeTab,
      });
    });

    let { messages } = await browser.messages.query({});
    await browser.mailTabs.setSelectedMessages(messages.map(m => m.id));
    let { messages: selectedMessages } =
      await browser.mailTabs.getSelectedMessages();
    browser.test.assertEq(
      selectedMessages.length,
      2,
      "Should have two messages selected"
    );

    browser.test.sendMessage("ready");
  }

  let extension = ExtensionTestUtils.loadExtension({
    manifest: {
      permissions: ["accountsRead", "messagesRead"],
      commands: {
        "test-multi-message": {
          suggested_key: {
            default: "Ctrl+Up",
          },
        },
      },
    },
    background,
  });

  await extension.startup();
  await extension.awaitMessage("ready");

  // Trigger the registered command.
  await BrowserTestUtils.synthesizeKey(
    "VK_UP",
    {
      accelKey: true,
    },
    window.browsingContext
  );
  let message = await extension.awaitMessage("oncommand event received");
  is(
    message.commandName,
    "test-multi-message",
    `Expected onCommand listener to fire with the correct name: test-multi-message`
  );
  is(
    message.activeTab.type,
    "mail",
    `Expected onCommand listener to fire with the correct tab type: mail`
  );

  await extension.unload();
});
