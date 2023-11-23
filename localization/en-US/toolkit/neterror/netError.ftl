

neterror-page-title = Problem loading page
certerror-page-title = Warning: Potential Security Risk Ahead
certerror-sts-page-title = Did Not Connect: Potential Security Issue
neterror-blocked-by-policy-page-title = Blocked Page
neterror-captive-portal-page-title = Log in to network
neterror-dns-not-found-title = Server Not Found
neterror-malformed-uri-page-title = Invalid URL


neterror-advanced-button = Advanced…
neterror-copy-to-clipboard-button = Copy text to clipboard
neterror-learn-more-link = Learn more…
neterror-open-portal-login-page-button = Open Network Login Page
neterror-override-exception-button = Accept the Risk and Continue
neterror-pref-reset-button = Restore default settings
neterror-return-to-previous-page-button = Go Back
neterror-return-to-previous-page-recommended-button = Go Back (Recommended)
neterror-try-again-button = Try Again
neterror-add-exception-button = Always continue for this site
neterror-settings-button = Change DNS settings
neterror-view-certificate-link = View Certificate
neterror-trr-continue-this-time = Continue this time
neterror-disable-native-feedback-warning = Always continue


neterror-pref-reset = It looks like your network security settings might be causing this. Do you want the default settings to be restored?
neterror-error-reporting-automatic = Report errors like this to help { -vendor-short-name } identify and block malicious sites


neterror-generic-error = { -brand-short-name } can’t load this page for some reason.

neterror-load-error-try-again = The site could be temporarily unavailable or too busy. Try again in a few moments.
neterror-load-error-connection = If you are unable to load any pages, check your computer’s network connection.
neterror-load-error-firewall = If your computer or network is protected by a firewall or proxy, make sure that { -brand-short-name } is permitted to access the web.

neterror-captive-portal = You must log in to this network before you can access the internet.

neterror-dns-not-found-with-suggestion = Did you mean to go to <a data-l10n-name="website">{ $hostAndPath }</a>?
neterror-dns-not-found-hint-header = <strong>If you entered the right address, you can:</strong>
neterror-dns-not-found-hint-try-again = Try again later
neterror-dns-not-found-hint-check-network = Check your network connection
neterror-dns-not-found-hint-firewall = Check that { -brand-short-name } has permission to access the web (you might be connected but behind a firewall)


neterror-dns-not-found-trr-only-reason = { -brand-short-name } can’t protect your request for this site’s address through our trusted DNS resolver. Here’s why:
neterror-dns-not-found-trr-third-party-warning2 = You can continue with your default DNS resolver. However, a third-party might be able to see what websites you visit.

neterror-dns-not-found-trr-only-could-not-connect = { -brand-short-name } wasn’t able to connect to { $trrDomain }.
neterror-dns-not-found-trr-only-timeout = The connection to { $trrDomain } took longer than expected.
neterror-dns-not-found-trr-offline = You are not connected to the internet.
neterror-dns-not-found-trr-unknown-host2 = This website wasn’t found by { $trrDomain }.
neterror-dns-not-found-trr-server-problem = There was a problem with { $trrDomain }.
neterror-dns-not-found-trr-unknown-problem = Unexpected problem.


neterror-dns-not-found-native-fallback-reason = { -brand-short-name } can’t protect your request for this site’s address through our trusted DNS resolver. Here’s why:
neterror-dns-not-found-native-fallback-heuristic = DNS over HTTPS has been disabled on your network.
neterror-dns-not-found-native-fallback-not-confirmed2 = { -brand-short-name } wasn’t able to connect to { $trrDomain }.


neterror-file-not-found-filename = Check the file name for capitalization or other typing errors.
neterror-file-not-found-moved = Check to see if the file was moved, renamed or deleted.

neterror-access-denied = It may have been removed, moved, or file permissions may be preventing access.

neterror-unknown-protocol = You might need to install other software to open this address.

neterror-redirect-loop = This problem can sometimes be caused by disabling or refusing to accept cookies.

neterror-unknown-socket-type-psm-installed = Check to make sure your system has the Personal Security Manager installed.
neterror-unknown-socket-type-server-config = This might be due to a non-standard configuration on the server.

neterror-not-cached-intro = The requested document is not available in { -brand-short-name }’s cache.
neterror-not-cached-sensitive = As a security precaution, { -brand-short-name } does not automatically re-request sensitive documents.
neterror-not-cached-try-again = Click Try Again to re-request the document from the website.

neterror-net-offline = Press “Try Again” to switch to online mode and reload the page.

neterror-proxy-resolve-failure-settings = Check the proxy settings to make sure that they are correct.
neterror-proxy-resolve-failure-connection = Check to make sure your computer has a working network connection.
neterror-proxy-resolve-failure-firewall = If your computer or network is protected by a firewall or proxy, make sure that { -brand-short-name } is permitted to access the web.

neterror-proxy-connect-failure-settings = Check the proxy settings to make sure that they are correct.
neterror-proxy-connect-failure-contact-admin = Contact your network administrator to make sure the proxy server is working.

neterror-content-encoding-error = Please contact the website owners to inform them of this problem.

neterror-unsafe-content-type = Please contact the website owners to inform them of this problem.

neterror-nss-failure-not-verified = The page you are trying to view cannot be shown because the authenticity of the received data could not be verified.
neterror-nss-failure-contact-website = Please contact the website owners to inform them of this problem.

certerror-intro = { -brand-short-name } detected a potential security threat and did not continue to <b>{ $hostname }</b>. If you visit this site, attackers could try to steal information like your passwords, emails, or credit card details.
certerror-sts-intro = { -brand-short-name } detected a potential security threat and did not continue to <b>{ $hostname }</b> because this website requires a secure connection.
certerror-expired-cert-intro = { -brand-short-name } detected an issue and did not continue to <b>{ $hostname }</b>. The website is either misconfigured or your computer clock is set to the wrong time.
certerror-mitm = <b>{ $hostname }</b> is most likely a safe site, but a secure connection could not be established. This issue is caused by <b>{ $mitm }</b>, which is either software on your computer or your network.

neterror-corrupted-content-intro = The page you are trying to view cannot be shown because an error in the data transmission was detected.
neterror-corrupted-content-contact-website = Please contact the website owners to inform them of this problem.

neterror-sslv3-used = Advanced info: SSL_ERROR_UNSUPPORTED_VERSION

neterror-inadequate-security-intro = <b>{ $hostname }</b> uses security technology that is outdated and vulnerable to attack. An attacker could easily reveal information which you thought to be safe. The website administrator will need to fix the server first before you can visit the site.
neterror-inadequate-security-code = Error code: NS_ERROR_NET_INADEQUATE_SECURITY

neterror-clock-skew-error = Your computer thinks it is { DATETIME($now, dateStyle: "medium") }, which prevents { -brand-short-name } from connecting securely. To visit <b>{ $hostname }</b>, update your computer clock in your system settings to the current date, time, and time zone, and then refresh <b>{ $hostname }</b>.

neterror-network-protocol-error-intro = The page you are trying to view cannot be shown because an error in the network protocol was detected.
neterror-network-protocol-error-contact-website = Please contact the website owners to inform them of this problem.

certerror-expired-cert-second-para = It’s likely the website’s certificate is expired, which prevents { -brand-short-name } from connecting securely. If you visit this site, attackers could try to steal information like your passwords, emails, or credit card details.
certerror-expired-cert-sts-second-para = It’s likely the website’s certificate is expired, which prevents { -brand-short-name } from connecting securely.

certerror-what-can-you-do-about-it-title = What can you do about it?

certerror-unknown-issuer-what-can-you-do-about-it-website = The issue is most likely with the website, and there is nothing you can do to resolve it.
certerror-unknown-issuer-what-can-you-do-about-it-contact-admin = If you are on a corporate network or using antivirus software, you can reach out to the support teams for assistance. You can also notify the website’s administrator about the problem.

certerror-expired-cert-what-can-you-do-about-it-clock = Your computer clock is set to { DATETIME($now, dateStyle: "medium") }. Make sure your computer is set to the correct date, time, and time zone in your system settings, and then refresh <b>{ $hostname }</b>.
certerror-expired-cert-what-can-you-do-about-it-contact-website = If your clock is already set to the right time, the website is likely misconfigured, and there is nothing you can do to resolve the issue. You can notify the website’s administrator about the problem.

certerror-bad-cert-domain-what-can-you-do-about-it = The issue is most likely with the website, and there is nothing you can do to resolve it. You can notify the website’s administrator about the problem.

certerror-mitm-what-can-you-do-about-it-antivirus = If your antivirus software includes a feature that scans encrypted connections (often called “web scanning” or “https scanning”), you can disable that feature. If that doesn’t work, you can remove and reinstall the antivirus software.
certerror-mitm-what-can-you-do-about-it-corporate = If you are on a corporate network, you can contact your IT department.
certerror-mitm-what-can-you-do-about-it-attack = If you are not familiar with <b>{ $mitm }</b>, then this could be an attack and you should not continue to the site.

certerror-mitm-what-can-you-do-about-it-attack-sts = If you are not familiar with <b>{ $mitm }</b>, then this could be an attack, and there is nothing you can do to access the site.

certerror-what-should-i-do-bad-sts-cert-explanation = <b>{ $hostname }</b> has a security policy called HTTP Strict Transport Security (HSTS), which means that { -brand-short-name } can only connect to it securely. You can’t add an exception to visit this site.
