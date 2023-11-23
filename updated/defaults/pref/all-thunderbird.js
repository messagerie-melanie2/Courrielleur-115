//@line 2 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 12 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("general.skins.selectedSkin", "classic/1.0");
//@line 18 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.rights.version", 0);
//@line 28 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.update.checkInstallTime", true);
pref("app.update.timerMinimumDelay", 120);
pref("app.update.timerFirstInterval", 30000);
pref("app.update.log", false);
pref("app.update.log.file", false);
pref("app.update.backgroundMaxErrors", 10);
pref("app.update.link.updateAvailableWhatsNew", "update-available-whats-new");
pref("app.update.link.updateManualWhatsNew", "update-manual-whats-new");
pref("app.update.download.promptMaxAttempts", 2);
pref("app.update.elevation.promptMaxAttempts", 2);
//@line 87 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.update.notifyDuringDownload", false);
//@line 101 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.update.staging.enabled", true);
//@line 114 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.update.service.enabled", true);
//@line 116 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 118 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.update.BITS.enabled", false);
//@line 121 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.releaseNotesURL", "https://live.thunderbird.net/%APP%/releasenotes?locale=%LOCALE%&version=%VERSION%&channel=%CHANNEL%&os=%OS%&buildid=%APPBUILDID%");
//@line 133 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("toolkit.datacollection.infoURL",
     "https://www.mozilla.org/thunderbird/legal/privacy/#telemetry");
pref("toolkit.crashreporter.infoURL",
     "https://www.mozilla.org/thunderbird/legal/privacy/#crash-reporter");
pref("datareporting.healthreport.uploadEnabled", true); // Required to enable telemetry pings.
pref("datareporting.healthreport.infoURL", "https://www.mozilla.org/thunderbird/legal/privacy/#health-report");
//@line 146 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("datareporting.policy.dataSubmissionEnabled", true);
pref("datareporting.policy.dataSubmissionPolicyAcceptedVersion", 0);
pref("datareporting.policy.dataSubmissionPolicyBypassNotification", false);
pref("datareporting.policy.currentPolicyVersion", 2);
pref("datareporting.policy.firstRunURL", "https://www.mozilla.org/thunderbird/legal/privacy/");
//@line 152 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.support.baseURL", "https://support.thunderbird.net/%APP%/%VERSION%/%OS%/%LOCALE%/");
pref("app.feedback.baseURL", "https://connect.mozilla.org/");
pref("app.use_without_mail_account", false);
pref("javascript.options.showInConsole", true);
//@line 169 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("signon.management.page.os-auth.enabled", false);
//@line 171 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("extensions.logging.enabled", false);
pref("extensions.overlayloader.loglevel", "warn");
pref("extensions.abuseReport.enabled", false);
//@line 182 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("extensions.strictCompatibility", true);
//@line 184 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("extensions.update.autoUpdateDefault", true);
pref("extensions.systemAddon.update.enabled", true);  // See bug 1462160.
pref("extensions.autoDisableScopes", 15);
pref("extensions.startupScanScopes", 4);
pref("extensions.geckoProfiler.acceptedExtensionIds", "geckoprofiler@mozilla.com,quantum-foxfooding@mozilla.com,raptor@mozilla.org");
pref("extensions.legacy.enabled", true);
pref("extensions.getAddons.cache.enabled", true);
pref("extensions.getAddons.maxResults", 15);
pref("extensions.getAddons.get.url", "https://services.addons.thunderbird.net/api/v3/addons/search/?guid=%IDS%&lang=%LOCALE%");
pref("extensions.getAddons.compatOverides.url", "https://services.addons.thunderbird.net/api/v3/addons/compat-override/?guid=%IDS%&lang=%LOCALE%");
pref("extensions.getAddons.link.url", "https://addons.thunderbird.net/%LOCALE%/%APP%/");
pref("browser.dictionaries.download.url", "https://addons.thunderbird.net/%LOCALE%/%APP%/language-tools/");
pref("extensions.getAddons.recommended.url", "https://services.addons.thunderbird.net/%LOCALE%/%APP%/api/%API_VERSION%/list/recommended/all/%MAX_RESULTS%/%OS%/%VERSION%?src=thunderbird");
pref("extensions.getAddons.search.browseURL", "https://addons.thunderbird.net/%LOCALE%/%APP%/search/?q=%TERMS%&appver=%VERSION%&platform=%OS%");
pref("extensions.getAddons.search.url", "https://services.addons.thunderbird.net/%LOCALE%/%APP%/api/%API_VERSION%/search/%TERMS%/all/%MAX_RESULTS%/%OS%/%VERSION%/%COMPATIBILITY_MODE%?src=thunderbird");
pref("extensions.webservice.discoverURL", "https://services.addons.thunderbird.net/%LOCALE%/%APP%/discovery/pane/%VERSION%/%OS%");
pref("extensions.getAddons.langpacks.url", "https://services.addons.thunderbird.net/api/v3/addons/language-tools/?app=thunderbird&type=language&appversion=%VERSION%");
pref("extensions.getAddons.discovery.api_url", "https://services.addons.thunderbird.net/api/v4/discovery/?lang=%LOCALE%&edition=%DISTRIBUTION%");
pref("extensions.blocklist.detailsURL", "https://blocked.cdn.mozilla.net/");
pref("extensions.blocklist.itemURL", "https://blocked.cdn.mozilla.net/%blockID%.html");
pref("services.settings.server", "https://thunderbird-settings.thunderbird.net/v1");
pref("services.settings.default_bucket", "thunderbird");
pref("security.content.signature.root_hash", "[CONTENT SIGNING DISABLED - see bug 1612380]");
pref("extensions.webextOptionalPermissionPrompts", true);
pref("security.cert_pinning.enforcement_level", 1);
pref("security.osclientcerts.autoload", false);
pref("extensions.update.enabled", true);
pref("extensions.update.url", "https://versioncheck.addons.thunderbird.net/update/VersionCheck.php?reqVersion=%REQ_VERSION%&id=%ITEM_ID%&version=%ITEM_VERSION%&maxAppVersion=%ITEM_MAXAPPVERSION%&status=%ITEM_STATUS%&appID=%APP_ID%&appVersion=%APP_VERSION%&appOS=%APP_OS%&appABI=%APP_ABI%&locale=%APP_LOCALE%&currentAppVersion=%CURRENT_APP_VERSION%&updateType=%UPDATE_TYPE%&compatMode=%COMPATIBILITY_MODE%");
pref("extensions.update.background.url", "https://versioncheck-bg.addons.thunderbird.net/update/VersionCheck.php?reqVersion=%REQ_VERSION%&id=%ITEM_ID%&version=%ITEM_VERSION%&maxAppVersion=%ITEM_MAXAPPVERSION%&status=%ITEM_STATUS%&appID=%APP_ID%&appVersion=%APP_VERSION%&appOS=%APP_OS%&appABI=%APP_ABI%&locale=%APP_LOCALE%&currentAppVersion=%CURRENT_APP_VERSION%&updateType=%UPDATE_TYPE%&compatMode=%COMPATIBILITY_MODE%");
pref("extensions.update.interval", 86400);  // Check for updates to Extensions and
pref("extensions.dss.switchPending", false);    // Non-dynamic switch pending after next
pref("extensions.htmlaboutaddons.recommendations.enabled", false);
pref("extensions.webextensions.restrictedDomains", "accounts-static.cdn.mozilla.net,accounts.firefox.com,addons.cdn.mozilla.net,addons.mozilla.org,api.accounts.firefox.com,content.cdn.mozilla.net,discovery.addons.mozilla.org,install.mozilla.org,oauth.accounts.firefox.com,profile.accounts.firefox.com,support.mozilla.org,sync.services.mozilla.com,addons.thunderbird.net");
pref("extensions.canonicalAddonServer.url", "https://addons.thunderbird.net");
pref("extensions.alternativeAddonSearch.url", "https://extension-finder.thunderbird.net");
pref("lightweightThemes.update.enabled", true);
pref("browser.theme.unified-color-scheme", true);
pref("permissions.manager.defaultsUrl", "resource://app/defaults/permissions");
//@line 274 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("general.autoScroll", true);
//@line 276 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.shell.checkDefaultClient", true);
pref("mail.spellcheck.inline", true);
pref("mail.folder.views.version", 0);
pref("mail.folderpane.sizeUnits", "");
pref("mail.folderpane.sumSubfolders", true);
pref("mail.last_msg_movecopy_target_uri", "");
pref("mail.last_msg_movecopy_was_move", true);
pref("browser.anchor_color", "#0B6CDA");
//@line 300 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("browser.preferences.animateFadeIn", false);
//@line 302 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("browser.preferences.search", true);
pref("browser.urlbar.keepPanelOpenDuringImeComposition", false);
pref("accessibility.typeaheadfind", false);
pref("accessibility.typeaheadfind.timeout", 5000);
pref("accessibility.typeaheadfind.linksonly", false);
pref("accessibility.typeaheadfind.flashBar", 1);
pref("mail.close_message_window.on_delete", false);
pref("mailnews.headers.show_n_lines_before_more", 1);
pref("mail.ui-rdf.version", 0);
pref("mail.showCondensedAddresses", true); // show the friendly display name for people I know
pref("mailnews.attachments.display.start_expanded", false);
pref("mail.pane_config.dynamic",            0);
pref("mailnews.reuse_thread_window2",     true);
pref("editor.singleLine.pasteNewlines", 4);  // substitute commas for new lines in single line text boxes
pref("editor.CR_creates_new_p", true);
pref("mail.compose.default_to_paragraph", true);
pref("mail.compose.add_link_preview", false);
pref("mailnews.headers.minNumHeaders", 0); // 0 means we ignore this pref
pref("mailnews.reply_header_type", 2);
pref("mail.operate_on_msgs_in_collapsed_threads", true);
pref("mail.warn_on_collapsed_thread_operation", true);
pref("mail.warn_on_shift_delete", true);
pref("mail.threadpane.padding.top_percent", 10);
pref("mail.threadpane.padding.bottom_percent", 10);
pref("mail.threadpane.use_correspondents", true);
pref("network.auth.subresource-img-cross-origin-http-auth-allow", true);
pref("network.auth.non-web-content-triggered-resources-http-auth-allow", true);
pref("mail.forward_message_mode", 2);
pref("mailnews.send.loglevel", "Warn");
pref("mail.import.in_new_tab", true);
pref("browser.hiddenWindowChromeURL", "chrome://messenger/content/hiddenWindowMac.xhtml");
pref("offline.startup_state",            2);
pref("offline.send.unsent_messages",            0);
pref("offline.download.download_messages",  0);
pref("offline.autoDetect", true);
pref("network.http.speculative-parallel-limit", 0);
pref("network.protocol-handler.expose-all", false);
pref("network.protocol-handler.expose.mailto", true);
pref("network.protocol-handler.expose.mid", true);
pref("network.protocol-handler.expose.news", true);
pref("network.protocol-handler.expose.snews", true);
pref("network.protocol-handler.expose.nntp", true);
pref("network.protocol-handler.expose.imap", true);
pref("network.protocol-handler.expose.pop", true);
pref("network.protocol-handler.expose.mailbox", true);
pref("network.protocol-handler.expose.about", true);
pref("network.protocol-handler.expose.blob", true);
pref("network.protocol-handler.expose.data", true);
pref("network.protocol-handler.expose.file", true);
pref("network.protocol-handler.expose.http", true);
pref("network.protocol-handler.expose.https", true);
pref("network.protocol-handler.expose.javascript", true);
pref("network.protocol-handler.expose.moz-extension", true);
pref("network.protocol-handler.warn-external.http", false);
pref("network.protocol-handler.warn-external.https", false);
pref("network.protocol-handler.warn-external.ftp", false);
pref("network.protocol-handler.external.cid", false);
pref("network.protocol-handler.external.mid", false);
pref("network.protocol-handler.external.mailto", false);
pref("network.protocol-handler.external.imap", false);
pref("network.protocol-handler.external.imap-message", false);
pref("network.protocol-handler.external.pop", false);
pref("network.protocol-handler.external.pop3", false);
pref("network.protocol-handler.external.mailbox", false);
pref("network.protocol-handler.external.mailbox-message", false);
pref("network.protocol-handler.external.smtp", false);
pref("network.protocol-handler.external.smtps", false);
pref("network.protocol-handler.external.nntp", false);
pref("network.protocol-handler.external.news", false);
pref("network.protocol-handler.external.news-message", false);
pref("network.protocol-handler.external.snews", false);
pref("network.protocol-handler.external.ldap", false);
pref("network.protocol-handler.external.ldaps", false);
pref("network.protocol-handler.external.webcal", false);
pref("network.protocol-handler.external.webcals", false);
pref("network.protocol-handler.external.moz-cal-handle-itip", false);
pref("network.protocol-handler.external.smile", false);
pref("network.hosts.smtp_server",           "mail");
pref("network.hosts.pop_server",            "mail");
pref("dom.security.skip_about_page_has_csp_assert", true);
pref("security.warn_entering_secure", false);
pref("security.warn_entering_weak", false);
pref("security.warn_leaving_secure", false);
pref("security.warn_viewing_mixed", false);
pref("security.aboutcertificate.enabled", true);
pref("security.intermediate_preloading_healer.enabled", false);
pref("security.external_protocol_requires_permission", false);
pref("security.prompt_for_master_password_on_startup", true);
pref("general.config.obscure_value", 0); // for MCD .cfg files
pref("browser.display.auto_quality_min_font_size", 0);
pref("view_source.syntax_highlight", false);
pref("dom.serviceWorkers.enabled", true);
pref("browser.send_pings", false);
pref("browser.xul.error_pages.expert_bad_cert", false);
pref("browser.download.useDownloadDir", false);
pref("browser.download.folderList", 0);
pref("browser.download.manager.showAlertOnComplete", false);
pref("browser.download.manager.showAlertInterval", 2000);
pref("browser.download.manager.retention", 1);
pref("browser.download.manager.showWhenStarting", false);
pref("browser.download.manager.closeWhenDone", true);
pref("browser.download.manager.focusWhenStarting", false);
pref("browser.download.manager.flashCount", 0);
pref("browser.download.manager.addToRecentDocs", true);
//@line 513 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("browser.helperApps.deleteTempFileOnExit", true);
//@line 515 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("browser.startup.homepage.abouthome_cache.enabled", true);
pref("spellchecker.dictionary", "");
pref("spellchecker.dictionaries.download.url", "https://addons.thunderbird.net/%LOCALE%/%APP%/dictionaries/");
pref("profile.force.migration", "");
//@line 530 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("alerts.totalOpenTime", 10000);
//@line 532 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 535 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("alerts.useSystemBackend", false);
//@line 537 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.phishing.detection.enabled", true);
pref("mail.phishing.detection.ipaddresses", true);
pref("mail.phishing.detection.mismatched_hosts", true);
pref("mail.phishing.detection.disallow_form_actions", true);
pref("browser.safebrowsing.reportPhishURL", "https://%LOCALE%.phish-report.mozilla.com/?hl=%LOCALE%");
pref("dom.disable_window_status_change",          true);
pref("mail.openMessageBehavior", 2);
pref("mail.openMessageBehavior.version", 0);
pref("mail.tabs.loadInBackground", true);
pref("mail.tabs.tabMinWidth", 100);
pref("mail.tabs.tabMaxWidth", 250);
pref("mail.tabs.tabClipWidth", 140);
pref("mail.tabs.autoHide", true);
pref("mail.tabs.closeWindowWithLastTab", true);
pref("mail.tabs.drawInTitlebar", true);
pref("breakpad.reportURL", "https://crash-stats.mozilla.com/report/index/");
//@line 576 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.winsearch.enable", false);
pref("mail.winsearch.firstRunDone", false);
//@line 584 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 587 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.winsearch.loglevel", "Warn");
//@line 593 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 598 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("toolbar.customization.usesheet", false);
//@line 600 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.compose.show_attachment_pane", false);
pref("mail.compose.attachment_reminder", true);
pref("mail.compose.attachment_reminder_keywords", "chrome://messenger/locale/messengercompose/composeMsgs.properties");
pref("mail.compose.attachment_reminder_aggressive", true);
pref("mail.compose.big_attachments.notify", true);
pref("mail.compose.big_attachments.threshold_kb", 5120);
pref("mail.compose.big_attachments.insert_notification", true);
pref("mail.compose.warned_about_customize_from", false);
pref("browser.formfill.enable", true);
pref("media.autoplay.enabled", false);
pref("gloda.facetview.hidetimeline", true);
pref("gloda.facetview.sortby", 2);
pref("mailnews.database.global.indexer.enabled", true);
pref("mailnews.database.global.search.msg.limit", 1000);
pref("font.default", "sans-serif");
pref("font.default.x-unicode", "sans-serif");
pref("font.default.x-western", "sans-serif");
pref("font.default.x-cyrillic", "sans-serif");
pref("font.default.el", "sans-serif");
//@line 655 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("font.name.monospace.x-unicode", "Consolas");
pref("font.name.sans-serif.x-unicode", "Calibri");
pref("font.name.serif.x-unicode", "Cambria");
pref("font.size.monospace.x-unicode", 14);
pref("font.size.variable.x-unicode", 17);
pref("font.name.monospace.x-western", "Consolas");
pref("font.name.sans-serif.x-western", "Calibri");
pref("font.name.serif.x-western", "Cambria");
pref("font.size.monospace.x-western", 14);
pref("font.size.variable.x-western", 17);
pref("font.name.monospace.x-cyrillic", "Consolas");
pref("font.name.sans-serif.x-cyrillic", "Calibri");
pref("font.name.serif.x-cyrillic", "Cambria");
pref("font.size.monospace.x-cyrillic", 14);
pref("font.size.variable.x-cyrillic", 17);
pref("font.name.monospace.el", "Consolas");
pref("font.name.sans-serif.el", "Calibri");
pref("font.name.serif.el", "Cambria");
pref("font.size.monospace.el", 14);
pref("font.size.variable.el", 17);
pref("mail.font.windows.version", 2);
//@line 681 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 711 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 736 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.setup.loglevel", "Warn");
pref("browser.link.open_newwindow", 3);
pref("browser.link.open_newwindow.restriction", 0);
pref("browser.tabs.loadDivertedInBackground", false);
pref("browser.tabs.remote.autostart", true);
pref("browser.tabs.remote.desktopbehavior", true);
pref("extensions.webextensions.remote", true);
pref("extensions.webextensions.background-delayed-startup", true);
pref("browser.chrome.site_icons", true);
pref("browser.chrome.favicons", true);
pref("places.history.enabled", true);
pref("places.frecency.numVisits", 10);
pref("places.frecency.firstBucketCutoff", 4);
pref("places.frecency.secondBucketCutoff", 14);
pref("places.frecency.thirdBucketCutoff", 31);
pref("places.frecency.fourthBucketCutoff", 90);
pref("places.frecency.firstBucketWeight", 100);
pref("places.frecency.secondBucketWeight", 70);
pref("places.frecency.thirdBucketWeight", 50);
pref("places.frecency.fourthBucketWeight", 30);
pref("places.frecency.defaultBucketWeight", 10);
pref("places.frecency.embedVisitBonus", 0);
pref("places.frecency.framedLinkVisitBonus", 0);
pref("places.frecency.linkVisitBonus", 100);
pref("places.frecency.typedVisitBonus", 2000);
pref("places.frecency.bookmarkVisitBonus", 75);
pref("places.frecency.downloadVisitBonus", 0);
pref("places.frecency.permRedirectVisitBonus", 0);
pref("places.frecency.tempRedirectVisitBonus", 0);
pref("places.frecency.reloadVisitBonus", 0);
pref("places.frecency.defaultVisitBonus", 0);
pref("places.frecency.unvisitedBookmarkBonus", 140);
pref("places.frecency.unvisitedTypedBonus", 200);
pref("places.frecency.origins.alternative.featureGate", false);
pref("places.loglevel", "Error");
//@line 816 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.taskbar.lists.enabled", true);
pref("mail.taskbar.lists.tasks.enabled", true);
//@line 819 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.provider.providerList", "https://broker.thunderbird.net/provider/list");
pref("mail.provider.suggestFromName", "https://broker.thunderbird.net/provider/suggest");
pref("mail.provider.enabled", true);
pref("mail.chat.enabled", true);
pref("mail.chat.show_desktop_notifications", true);
pref("mail.chat.notification_info", 0);
pref("mail.chat.play_sound", true);
pref("mail.chat.play_sound.type", 0);
pref("mail.chat.play_sound.url", "");
pref("chat.otr.enable", true);
pref("chat.otr.default.requireEncryption", false);
pref("chat.otr.default.verifyNudge", true);
pref("chat.otr.default.allowMsgLog", true);
pref("mail.cloud_files.enabled", true);
pref("mail.cloud_files.learn_more_url", "https://support.thunderbird.net/kb/filelink-large-attachments");
pref("mail.ignore_thread.learn_more_url", "https://support.thunderbird.net/kb/ignore-threads");
pref("mail.uidensity", 1);
pref("mail.uifontsize", 0);
pref("privacy.cpd.history", true);
pref("privacy.cpd.cookies", true);
pref("privacy.cpd.cache", true);
pref("privacy.sanitize.timeSpan", 1);
pref("privacy.userContext.enabled", false);
pref("privacy.webrtc.globalMuteToggles", false);
pref("mail.main_menu.collapse_by_default", true);
pref("mail.save_msg_filename_underscores_for_space", false);
//@line 893 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("security.webauth.u2f", true);
pref("intl.regional_prefs.use_os_locales", true);
pref("intl.multilingual.enabled", true);
//@line 910 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("intl.multilingual.downloadEnabled", true);
pref("intl.multilingual.liveReload", false);
pref("intl.multilingual.liveReloadBidirectional", false);
//@line 918 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("browser.zoom.full", true);
pref("toolkit.osKeyStore.loglevel", "Warn");
pref("devtools.chrome.enabled", true);
pref("devtools.debugger.remote-enabled", true);
pref("devtools.selfxss.count", 5);
pref("devtools.storage.extensionStorage.enabled", true);
pref("devtools.toolbox.footer.height", 250);
pref("devtools.toolbox.sidebar.width", 500);
pref("devtools.toolbox.host", "bottom");
pref("devtools.toolbox.previousHost", "right");
pref("devtools.toolbox.selectedTool", "inspector");
pref("devtools.toolbox.sideEnabled", true);
pref("devtools.toolbox.zoomValue", "1");
pref("devtools.toolbox.splitconsoleEnabled", false);
pref("devtools.toolbox.splitconsoleHeight", 100);
pref("devtools.toolbox.tabsOrder", "");
pref("devtools.netmonitor.features.newEditAndResend", false);
//@line 950 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.browsertoolbox.fission", false);
//@line 952 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.browsertoolbox.scope", "everything");
pref("devtools.command-button-pick.enabled", true);
pref("devtools.command-button-frames.enabled", true);
pref("devtools.command-button-splitconsole.enabled", true);
pref("devtools.command-button-responsive.enabled", true);
pref("devtools.command-button-screenshot.enabled", false);
pref("devtools.command-button-rulers.enabled", false);
pref("devtools.command-button-measure.enabled", false);
pref("devtools.command-button-noautohide.enabled", false);
pref("devtools.command-button-errorcount.enabled", true);
//@line 973 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.inspector.enabled", true);
pref("devtools.inspector.selectedSidebar", "layoutview");
pref("devtools.inspector.activeSidebar", "layoutview");
pref("devtools.inspector.remote", false);
pref("devtools.inspector.three-pane-enabled", true);
pref("devtools.inspector.chrome.three-pane-enabled", false);
pref("devtools.inspector.show_pseudo_elements", false);
pref("devtools.inspector.imagePreviewTooltipSize", 300);
pref("devtools.inspector.showUserAgentStyles", false);
pref("devtools.inspector.showAllAnonymousContent", false);
pref("devtools.inspector.ruleview.inline-compatibility-warning.enabled", false);
pref("devtools.inspector.compatibility.enabled", true);
pref("devtools.inspector.color-scheme-simulation.enabled", true);
pref("devtools.gridinspector.gridOutlineMaxColumns", 50);
pref("devtools.gridinspector.gridOutlineMaxRows", 50);
pref("devtools.gridinspector.showGridAreas", false);
pref("devtools.gridinspector.showGridLineNumbers", false);
pref("devtools.gridinspector.showInfiniteLines", false);
pref("devtools.gridinspector.maxHighlighters", 3);
pref("devtools.inspector.simple-highlighters-reduced-motion", false);
pref("devtools.layout.boxmodel.opened", true);
pref("devtools.layout.flexbox.opened", true);
pref("devtools.layout.flex-container.opened", true);
pref("devtools.layout.flex-item.opened", true);
pref("devtools.layout.grid.opened", true);
//@line 1030 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.layout.boxmodel.highlightProperty", false);
//@line 1032 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.eyedropper.zoom", 6);
pref("devtools.markup.collapseAttributes", true);
pref("devtools.markup.collapseAttributeLength", 120);
pref("devtools.markup.beautifyOnCopy", false);
pref("devtools.markup.mutationBreakpoints.enabled", true);
pref("devtools.defaultColorUnit", "authored");
pref("devtools.memory.enabled", true);
pref("devtools.memory.custom-census-displays", "{}");
pref("devtools.memory.custom-label-displays", "{}");
pref("devtools.memory.custom-tree-map-displays", "{}");
pref("devtools.memory.max-individuals", 1000);
pref("devtools.memory.max-retaining-paths", 10);
pref("devtools.performance.enabled", true);
pref("devtools.performance.popup.feature-flag", false);
pref("devtools.performance.recording.preset", "firefox-platform");
pref("devtools.performance.recording.preset.remote", "firefox-platform");
pref("devtools.cache.disabled", false);
pref("devtools.serviceWorkers.testing.enabled", false);
pref("devtools.netmonitor.enabled", true);
pref("devtools.netmonitor.features.search", true);
pref("devtools.netmonitor.features.requestBlocking", true);
pref("devtools.application.enabled", false);
pref("devtools.custom-formatters", false);
pref("devtools.custom-formatters.enabled", false);
pref("devtools.netmonitor.panes-network-details-width", 550);
pref("devtools.netmonitor.panes-network-details-height", 450);
pref("devtools.netmonitor.panes-search-width", 550);
pref("devtools.netmonitor.panes-search-height", 450);
pref("devtools.netmonitor.filters", "[\"all\"]");
pref("devtools.netmonitor.visibleColumns",
  "[\"status\",\"method\",\"domain\",\"file\",\"initiator\",\"type\",\"transferred\",\"contentSize\",\"waterfall\"]"
);
pref("devtools.netmonitor.columnsData",
  '[{"name":"status","minWidth":30,"width":5}, {"name":"method","minWidth":30,"width":5}, {"name":"domain","minWidth":30,"width":10}, {"name":"file","minWidth":30,"width":25}, {"name":"url","minWidth":30,"width":25},{"name":"initiator","minWidth":30,"width":10},{"name":"type","minWidth":30,"width":5},{"name":"transferred","minWidth":30,"width":10},{"name":"contentSize","minWidth":30,"width":5},{"name":"waterfall","minWidth":150,"width":15}]');
pref("devtools.netmonitor.msg.payload-preview-height", 128);
pref("devtools.netmonitor.msg.visibleColumns",
  '["data", "time"]'
);
pref("devtools.netmonitor.msg.displayed-messages.limit", 500);
pref("devtools.netmonitor.response.ui.limit", 10240);
pref("devtools.netmonitor.saveRequestAndResponseBodies", true);
pref("devtools.netmonitor.har.defaultLogDir", "");
pref("devtools.netmonitor.har.defaultFileName", "%hostname_Archive [%date]");
pref("devtools.netmonitor.har.jsonp", false);
pref("devtools.netmonitor.har.jsonpCallback", "");
pref("devtools.netmonitor.har.includeResponseBodies", true);
pref("devtools.netmonitor.har.compress", false);
pref("devtools.netmonitor.har.forceExport", false);
pref("devtools.netmonitor.har.pageLoadedTimeout", 1500);
pref("devtools.netmonitor.har.enableAutoExportToFile", false);
pref("devtools.netmonitor.features.webSockets", true);
pref("devtools.netmonitor.audits.slow", 500);
pref("devtools.netmonitor.features.serverSentEvents", false);
pref("devtools.storage.enabled", true);
pref("devtools.styleeditor.enabled", true);
pref("devtools.styleeditor.autocompletion-enabled", true);
pref("devtools.styleeditor.showMediaSidebar", true);
pref("devtools.styleeditor.mediaSidebarWidth", 238);
pref("devtools.styleeditor.navSidebarWidth", 245);
pref("devtools.styleeditor.transitions", true);
pref("devtools.screenshot.clipboard.enabled", false);
pref("devtools.screenshot.audio.enabled", true);
pref("devtools.dom.enabled", false);
pref("devtools.accessibility.enabled", true);
pref("devtools.webconsole.filter.error", true);
pref("devtools.webconsole.filter.warn", true);
pref("devtools.webconsole.filter.info", true);
pref("devtools.webconsole.filter.log", true);
pref("devtools.webconsole.filter.debug", true);
pref("devtools.webconsole.filter.css", false);
pref("devtools.webconsole.filter.net", false);
pref("devtools.webconsole.filter.netxhr", false);
pref("devtools.webconsole.input.autocomplete",true);
//@line 1166 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.webconsole.input.context", false);
//@line 1168 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.webconsole.input.eagerEvaluation", true);
pref("devtools.browserconsole.filter.error", true);
pref("devtools.browserconsole.filter.warn", true);
pref("devtools.browserconsole.filter.info", true);
pref("devtools.browserconsole.filter.log", true);
pref("devtools.browserconsole.filter.debug", true);
pref("devtools.browserconsole.filter.css", false);
pref("devtools.browserconsole.filter.net", false);
pref("devtools.browserconsole.filter.netxhr", false);
pref("devtools.webconsole.inputHistoryCount", 300);
pref("devtools.webconsole.persistlog", false);
pref("devtools.netmonitor.persistlog", false);
pref("devtools.webconsole.timestampMessages", false);
//@line 1201 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.webconsole.sidebarToggle", false);
//@line 1203 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.webconsole.input.editor", false);
pref("devtools.browserconsole.input.editor", false);
pref("devtools.webconsole.input.editorWidth", 0);
pref("devtools.browserconsole.input.editorWidth", 0);
pref("devtools.webconsole.input.editorOnboarding", true);
pref("devtools.webconsole.groupWarningMessages", true);
pref("devtools.browserconsole.contentMessages", true);
pref("devtools.browserconsole.enableNetworkMonitoring", false);
pref("devtools.source-map.client-service.enabled", true);
pref("devtools.hud.loglimit", 10000);
pref("devtools.editor.tabsize", 2);
pref("devtools.editor.expandtab", true);
pref("devtools.editor.keymap", "default");
pref("devtools.editor.autoclosebrackets", true);
pref("devtools.editor.detectindentation", true);
pref("devtools.editor.enableCodeFolding", true);
pref("devtools.editor.autocomplete", true);
pref("devtools.responsive.viewport.angle", 0);
pref("devtools.responsive.viewport.width", 320);
pref("devtools.responsive.viewport.height", 480);
pref("devtools.responsive.viewport.pixelRatio", 0);
pref("devtools.responsive.leftAlignViewport.enabled", false);
pref("devtools.responsive.reloadConditions.touchSimulation", false);
pref("devtools.responsive.reloadConditions.userAgent", false);
pref("devtools.responsive.reloadNotification.enabled", true);
pref("devtools.responsive.touchSimulation.enabled", false);
pref("devtools.responsive.userAgent", "");
//@line 1270 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.responsive.showUserAgentInput", false);
//@line 1272 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 1275 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.aboutdebugging.local-tab-debugging", false);
//@line 1279 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.aboutdebugging.process-debugging", true);
pref("devtools.aboutdebugging.network-locations", "[]");
pref("devtools.aboutdebugging.collapsibilities.installedExtension", false);
pref("devtools.aboutdebugging.collapsibilities.otherWorker", false);
pref("devtools.aboutdebugging.collapsibilities.serviceWorker", false);
pref("devtools.aboutdebugging.collapsibilities.sharedWorker", false);
pref("devtools.aboutdebugging.collapsibilities.tab", false);
pref("devtools.aboutdebugging.collapsibilities.temporaryExtension", false);
//@line 1295 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("devtools.aboutdebugging.showHiddenAddons", false);
//@line 1299 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("devtools.debugger.features.map-await-expression", true);
pref("devtools.debugger.features.async-captured-stacks", true);
pref("devtools.debugger.features.async-live-stacks", false);
pref("devtools.popup.disable_autohide", false);
pref("devtools.overflow.debugging.enabled", true);
pref("devtools.inspector.draggable_properties", true);
pref("toolkit.telemetry.server", "https://incoming-telemetry.thunderbird.net");
pref("toolkit.telemetry.server_owner", "Thunderbird");
pref("toolkit.telemetry.archive.enabled", true);
pref("toolkit.telemetry.shutdownPingSender.enabled", true);
pref("toolkit.telemetry.shutdownPingSender.enabledFirstSession", false);
pref("toolkit.telemetry.firstShutdownPing.enabled", true);
pref("toolkit.telemetry.newProfilePing.enabled", true);
pref("toolkit.telemetry.updatePing.enabled", true);
pref("toolkit.telemetry.bhrPing.enabled", true);
//@line 1341 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
  pref("toolkit.telemetry.ecosystemtelemetry.enabled", false);
//@line 1343 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
//@line 1345 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("mail.minimizeToTray", false);
//@line 1347 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("prompts.defaultModalType", 3);
pref("prompts.contentPromptSubDialog", false);
pref("extensions.recommendations.privacyPolicyUrl", "https://www.mozilla.org/en-US/privacy/thunderbird/#addons");
pref("pdfjs.firstRun", true);
pref("pdfjs.previousHandler.preferredAction", 0);
pref("pdfjs.previousHandler.alwaysAskBeforeHandling", false);
pref("mail.activity.loglevel", "Warn");
pref("mail.compose.warn_public_recipients.threshold", 15);
pref("mail.compose.warn_public_recipients.aggressive", false);
pref("print.print_headerleft", "");
pref("print.print_headercenter", "&T");
pref("print.print_headerright", "");
pref("layout.css.grid-template-masonry-value.enabled", true);
//@line 1413 "$SRCDIR/comm/mail/app/profile/all-thunderbird.js"
pref("app.donation.eoy.version", 2);
pref("app.donation.eoy.version.viewed", 0);
pref("app.donation.eoy.url", "https://www.thunderbird.net/thunderbird/115.0/appeal/");
pref("mailnews.imap.jsmodule", false);
pref("toolbar.unifiedtoolbar.buttonstyle", 0);
