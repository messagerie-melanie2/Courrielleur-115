/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const lazy = {};
ChromeUtils.defineModuleGetter(lazy, "AddonManager", "resource://gre/modules/AddonManager.jsm");

// Immutable for export.
export var AppConstants = Object.freeze({
  // See this wiki page for more details about channel specific build
  // defines: https://wiki.mozilla.org/Platform/Channel-specific_build_defines
  NIGHTLY_BUILD:
  false,

  RELEASE_OR_BETA:
  true,

  EARLY_BETA_OR_EARLIER:
  false,

  IS_ESR:
  false,

  ACCESSIBILITY:
  true,

  // Official corresponds, roughly, to whether this build is performed
  // on Mozilla's continuous integration infrastructure. You should
  // disable developer-only functionality when this flag is set.
  MOZILLA_OFFICIAL:
  true,

  MOZ_OFFICIAL_BRANDING:
  true,

  MOZ_DEV_EDITION:
  false,

  MOZ_SERVICES_SYNC:
  false,

  MOZ_SERVICES_HEALTHREPORT:
  true,

  MOZ_DATA_REPORTING:
  true,

  MOZ_SANDBOX:
  true,

  MOZ_TELEMETRY_REPORTING:
  true,

  MOZ_TELEMETRY_ON_BY_DEFAULT:
  false,

  MOZ_UPDATER:
  true,

  MOZ_SWITCHBOARD:
  false,

  MOZ_WEBRTC:
  true,

  MOZ_WIDGET_GTK:
  false,

  XP_UNIX:
  false,

// NOTE! XP_LINUX has to go after MOZ_WIDGET_ANDROID otherwise Android
// builds will be misidentified as linux.
  platform:
  "win",

// Most of our frontend code assumes that any desktop Unix platform
// is "linux". Add the distinction for code that needs it.
  unixstyle:
    "other",

  isPlatformAndVersionAtLeast(platform, version) {
    let platformVersion = Services.sysinfo.getProperty("version");
    return platform == this.platform &&
           Services.vc.compare(platformVersion, version) >= 0;
  },

  isPlatformAndVersionAtMost(platform, version) {
    let platformVersion = Services.sysinfo.getProperty("version");
    return platform == this.platform &&
           Services.vc.compare(platformVersion, version) <= 0;
  },

  MOZ_CRASHREPORTER:
  true,

  MOZ_NORMANDY:
  false,

  MOZ_MAINTENANCE_SERVICE:
  true,

  MOZ_BACKGROUNDTASKS:
  true,

  MOZ_UPDATE_AGENT:
  false,

  MOZ_BITS_DOWNLOAD:
  true,

  DEBUG:
  false,

  ASAN:
  false,

  ASAN_REPORTER:
  false,

  TSAN:
  false,

  MOZ_SYSTEM_NSS:
  false,

  MOZ_PLACES:
  true,

  MOZ_REQUIRE_SIGNING:
  false,

  get MOZ_UNSIGNED_SCOPES() {
    let result = 0;
    return result;
  },

  MOZ_ALLOW_ADDON_SIDELOAD:
  false,

  MOZ_WEBEXT_WEBIDL_ENABLED:
  false,

  MENUBAR_CAN_AUTOHIDE:
  true,

  MOZ_ANDROID_HISTORY:
  false,

  MOZ_GECKO_PROFILER:
  true,

  DLL_PREFIX: "",
  DLL_SUFFIX: ".dll",

  MOZ_APP_NAME: "thunderbird",
  MOZ_APP_BASENAME: "Thunderbird",
  // N.b.: you almost certainly want brandShortName/brand-short-name:
  // MOZ_APP_DISPLAYNAME should only be used for static user-visible
  // fields (e.g., DLL properties, Mac Bundle name, or similar).
  MOZ_APP_DISPLAYNAME_DO_NOT_USE: "Thunderbird",
  MOZ_APP_VERSION: "115.2.0",
  MOZ_APP_VERSION_DISPLAY: "115.2.0",
  MOZ_BUILDID: "20230828145448",
  MOZ_BUILD_APP: "comm/mail",
  MOZ_MACBUNDLE_ID: "org.mozilla.thunderbird",
  MOZ_MACBUNDLE_NAME: "Thunderbird.app",
  MOZ_UPDATE_CHANNEL: "release",
  MOZ_WIDGET_TOOLKIT: "windows",
  ANDROID_PACKAGE_NAME: "org.mozilla.thunderbird",

  DEBUG_JS_MODULES: "",

  MOZ_BING_API_CLIENTID: "no-bing-api-clientid",
  MOZ_BING_API_KEY: "no-bing-api-key",
  MOZ_GOOGLE_LOCATION_SERVICE_API_KEY: "no-google-location-service-api-key",
  MOZ_GOOGLE_SAFEBROWSING_API_KEY: "no-google-safebrowsing-api-key",
  MOZ_MOZILLA_API_KEY: "no-mozilla-api-key",

  BROWSER_CHROME_URL: "chrome://messenger/content/extensionPopup.xhtml",

  OMNIJAR_NAME: "omni.ja",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
  SOURCE_REVISION_URL: "https://hg.mozilla.org/releases/comm-esr115/rev/ffd49506d62c329824f7adb4896602a8c77ec7e8",

  HAVE_USR_LIB64_DIR:
    false,

  HAVE_SHELL_SERVICE:
    true,

  MOZ_CODE_COVERAGE:
    false,

  TELEMETRY_PING_FORMAT_VERSION: 4,

  MOZ_NEW_NOTIFICATION_STORE:
    false,

  ENABLE_WEBDRIVER:
    true,

  REMOTE_SETTINGS_SERVER_URL:
    "https://thunderbird-settings.thunderbird.net/v1",

  REMOTE_SETTINGS_VERIFY_SIGNATURE:
    false,

  REMOTE_SETTINGS_DEFAULT_BUCKET:
    "thunderbird",

  MOZ_GLEAN_ANDROID:
    false,

  MOZ_JXL:
    false,

  MOZ_CAN_FOLLOW_SYSTEM_TIME:
    true,

  MOZ_SYSTEM_POLICIES:
    true,

  // Returns true for CN region build when distibution id set as 'MozillaOnline'
  isChinaRepack() {
    return (
      Services.prefs
      .getDefaultBranch("")
      .getCharPref("distribution.id", "default") === "MozillaOnline"
    );
  },
});
