



-fog-brand-name = FOG
-glean-brand-name = Glean
glean-sdk-brand-name = SDK { -glean-brand-name }
glean-debug-ping-viewer-brand-name = Visionneuse des pings de débogage { -glean-brand-name }

about-glean-page-title2 = À propos de { -glean-brand-name }
about-glean-header = À propos de { -glean-brand-name }
about-glean-interface-description = <a data-l10n-name="glean-sdk-doc-link">{ glean-sdk-brand-name }</a> est une bibliothèque de collecte de données utilisée dans les projets de { -vendor-short-name }. Cette interface est conçue pour être utilisée par les développeurs et les testeurs pour effectuer manuellement des <a data-l10n-name="fog-link">tests d’instrumentation</a>.

about-glean-upload-enabled = L’envoi de données est activé.
about-glean-upload-disabled = L’envoi de données est désactivé.
about-glean-upload-enabled-local = L'envoi de données est activé uniquement vers un serveur local.
about-glean-upload-fake-enabled =
    L’envoi de données est désactivé, mais nous mentons au { glean-sdk-brand-name } et lui disons que cet envoi est activé afin que les données soient toujours enregistrées localement.
    Note : si vous définissez une balise de débogage, les pings seront envoyés sur le <a data-l10n-name="glean-debug-ping-viewer">{ glean-debug-ping-viewer-brand-name }</a> quels que soient les paramètres.

about-glean-prefs-and-defines = Les <a data-l10n-name="fog-prefs-and-defines-doc-link">préférences et définitions pertinentes</a> incluent :
about-glean-data-upload = <code>datareporting.healthreport.uploadEnabled</code> : { $data-upload-pref-value }
about-glean-local-port = <code>telemetry.fog.test.localhost_port</code> : { $local-port-pref-value }
about-glean-glean-android = <code>MOZ_GLEAN_ANDROID</code> : { $glean-android-define-value }
about-glean-moz-official = <code>MOZILLA_OFFICIAL</code> : { $moz-official-define-value }

about-glean-about-testing-header = À propos des tests
about-glean-manual-testing = Les instructions complètes sont détaillées dans la <a data-l10n-name="fog-instrumentation-test-doc-link">documentation des tests d’instrumentation de { -fog-brand-name }</a> et dans la <a data-l10n-name="glean-sdk-doc-link">documentation de { glean-sdk-brand-name }</a> mais, en résumé, pour tester manuellement que votre instrumentation fonctionne, voici ce que vous devriez faire :

about-glean-no-ping-label = (n’envoyer aucun ping)
about-glean-label-for-tag-pings = Dans le champ précédent, assurez-vous qu’il y ait une balise de débogage mémorisable afin que vous puissiez reconnaître vos pings plus tard.
about-glean-label-for-ping-names =
    Sélectionnez dans la liste précédente le ping dans lequel se trouve votre instrumentation. Si elle est dans un <a data-l10n-name="custom-ping-link">ping personnalisé</a>, choisissez celui-ci. Sinon, la valeur par défaut pour les mesures <code>event</code> est le ping <code>events</code> et pour toutes les autres mesures,
    le ping <code>metrics</code>.
about-glean-label-for-log-pings = (Facultatif. Cochez la case précédente si vous voulez que les pings soient également enregistrés quand ils sont envoyés. Vous devrez également <a data-l10n-name="enable-logging-link">activer la journalisation</a>.)
about-glean-label-for-controls-submit = Appuyez sur le bouton précédent pour marquer tous les pings { -glean-brand-name } avec votre étiquette et soumettre le ping sélectionné (tous les pings envoyés à partir de ce moment et jusqu’au redémarrage de l’application seront étiquetés avec <code>{ $debug-tag }</code>.)
about-glean-li-for-visit-gdpv =
    <a data-l10n-name="gdpv-tagged-pings-link">Rendez-vous sur la page { glean-debug-ping-viewer-brand-name } pour consulter les pings avec votre étiquette</a>.
    Le ping devrait arriver quelques secondes après avoir appuyé sur le bouton.
    Parfois, cela peut prendre quelques minutes.

about-glean-adhoc-explanation =
    Pour plus de tests ponctuels, vous pouvez également déterminer la valeur actuelle d’un élément d’instrumentation particulier en ouvrant une console d’outils de développement ici sur <code>about:glean</code> et en utilisant l’API <code>testGetValue()</code>, par exemple
    <code>Glean.metricCategory.metricName.testGetValue()</code>.


controls-button-label-verbose = Appliquer les paramètres et envoyer le ping

about-glean-about-data-header = À propos des données
about-glean-about-data-explanation = Pour visualiser la liste des données collectées, veuillez consulter le <a data-l10n-name="glean-dictionary-link">dictionnaire de { -glean-brand-name }</a>
