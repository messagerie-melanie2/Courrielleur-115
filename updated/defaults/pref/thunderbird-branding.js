// Default start page
pref("mailnews.start_page.url", "");

// Start page override to load after an update. Balrog will set an appropriate
// url for this, see whats_new_page.yml
pref("mailnews.start_page.override_url", "");

// app.update.url.manual: URL user can browse to manually if for some reason
// all update installation attempts fail.
// app.update.url.details: a default value for the "More information about this
// update" link supplied in the "An update is available" page of the update
// wizard.
//@line 17 "$SRCDIR/comm/mail/branding/thunderbird/pref/thunderbird-branding.js"
  // release channel
  pref("app.update.url.manual", "");
  pref("app.update.url.details", "");
//@line 21 "$SRCDIR/comm/mail/branding/thunderbird/pref/thunderbird-branding.js"

// Interval: Time between checks for a new version (in seconds)
// nightly=8 hours, official=24 hours
pref("app.update.interval", 86400);

// Give the user x seconds to react before showing the big UI. default=24 hours
pref("app.update.promptWaitTime", 86400);

// The number of days a binary is permitted to be old
// without checking for an update.  This assumes that
// app.update.checkInstallTime is true.
pref("app.update.checkInstallTime.days", 63);

// Give the user x seconds to reboot before showing a badge on the hamburger
// button. default=4 days
pref("app.update.badgeWaitTime", 345600);

pref("app.vendorURL", "");

pref("browser.search.param.ms-pc", "MOZT");
