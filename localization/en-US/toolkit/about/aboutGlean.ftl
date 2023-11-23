

-fog-brand-name = FOG
-glean-brand-name = Glean
glean-sdk-brand-name = { -glean-brand-name } SDK
glean-debug-ping-viewer-brand-name = { -glean-brand-name } Debug Ping Viewer

about-glean-page-title2 = About { -glean-brand-name }
about-glean-header = About { -glean-brand-name }
about-glean-interface-description =
  The <a data-l10n-name="glean-sdk-doc-link">{ glean-sdk-brand-name }</a>
  is a data collection library used in { -vendor-short-name } projects.
  This interface is designed to be used by developers and testers to manually
  <a data-l10n-name="fog-link">test instrumentation</a>.

about-glean-upload-enabled = Data upload is enabled.
about-glean-upload-disabled = Data upload is disabled.
about-glean-upload-enabled-local = Data upload is enabled only for sending to a local server.
about-glean-upload-fake-enabled =
  Data upload is disabled,
  but we’re lying and telling the { glean-sdk-brand-name } it is enabled
  so that data is still recorded locally.
  Note: If you set a debug tag, pings will be uploaded to the
  <a data-l10n-name="glean-debug-ping-viewer">{ glean-debug-ping-viewer-brand-name }</a> regardless of settings.

about-glean-prefs-and-defines = Relevant <a data-l10n-name="fog-prefs-and-defines-doc-link">preferences and defines</a> include:
about-glean-data-upload = <code>datareporting.healthreport.uploadEnabled</code>: { $data-upload-pref-value }
about-glean-local-port = <code>telemetry.fog.test.localhost_port</code>: { $local-port-pref-value }
about-glean-glean-android = <code>MOZ_GLEAN_ANDROID</code>: { $glean-android-define-value }
about-glean-moz-official =<code>MOZILLA_OFFICIAL</code>: { $moz-official-define-value }

about-glean-about-testing-header = About Testing
about-glean-manual-testing =
  Full instructions are documented in the
  <a data-l10n-name="fog-instrumentation-test-doc-link">{ -fog-brand-name } instrumentation testing docs</a>
  and in the <a data-l10n-name="glean-sdk-doc-link">{ glean-sdk-brand-name } documentation</a>,
  but, in short, to manually test that your instrumentation works, you should:

about-glean-no-ping-label = (don’t submit any ping)
about-glean-label-for-tag-pings =
  In the preceding field ensure there is a memorable debug tag so you can recognize your pings later.
about-glean-label-for-ping-names =
  Select from the preceding list the ping your instrumentation is in.
  If it’s in a <a data-l10n-name="custom-ping-link">custom ping</a>, choose that one.
  Otherwise, the default for <code>event</code> metrics is
  the <code>events</code> ping
  and the default for all other metrics is
  the <code>metrics</code> ping.
about-glean-label-for-log-pings =
  (Optional. Check the preceding box if you want pings to also be logged when they are submitted.
  You will additionally need to <a data-l10n-name="enable-logging-link">enable logging</a>.)
about-glean-label-for-controls-submit =
  Press the preceding button to tag all { -glean-brand-name } pings with your tag and submit the selected ping.
  (All pings submitted from then until you restart the application will be tagged with
  <code>{ $debug-tag }</code>.)
about-glean-li-for-visit-gdpv =
  <a data-l10n-name="gdpv-tagged-pings-link">Visit the { glean-debug-ping-viewer-brand-name } page for pings with your tag</a>.
  It shouldn’t take more than a few seconds from pushing the button to your ping arriving.
  Sometimes it may take a small handful of minutes.

about-glean-adhoc-explanation =
  For more <i>ad hoc</i> testing,
  you can also determine the current value of a particular piece of instrumentation
  by opening a devtools console here on <code>about:glean</code>
  and using the <code>testGetValue()</code> API like
  <code>Glean.metricCategory.metricName.testGetValue()</code>.


controls-button-label-verbose = Apply settings and submit ping

about-glean-about-data-header = About Data
about-glean-about-data-explanation =
  To browse the list of collected data, please consult the
  <a data-l10n-name="glean-dictionary-link">{ -glean-brand-name } Dictionary</a>.
