
xpinstall-prompt = { -brand-short-name } a empêché ce site de vous demander d’installer un logiciel sur votre ordinateur.


xpinstall-prompt-header = Autoriser { $host } à installer un module complémentaire ?
xpinstall-prompt-message = Vous essayez d’installer un module complémentaire depuis { $host }. Assurez-vous qu’il s’agit d’un site digne de confiance avant de continuer.


xpinstall-prompt-header-unknown = Autoriser un site inconnu à installer un module complémentaire ?
xpinstall-prompt-message-unknown = Vous essayez d’installer un module complémentaire depuis un site inconnu. Assurez-vous qu’il s’agit d’un site digne de confiance avant de continuer.
xpinstall-prompt-dont-allow =
    .label = Ne pas autoriser
    .accesskey = P
xpinstall-prompt-never-allow =
    .label = Ne jamais autoriser
    .accesskey = N
xpinstall-prompt-never-allow-and-report =
    .label = Signaler un site suspect
    .accesskey = S
xpinstall-prompt-install =
    .label = Continuer l’installation
    .accesskey = C


site-permission-install-first-prompt-midi-header = Ce site demande l’accès à vos périphériques MIDI (Musical Instrument Digital Interface). L’accès aux périphériques peut être accordé par l’installation d’un module complémentaire.
site-permission-install-first-prompt-midi-message = La sécurité de cet accès n’est pas garantie. Ne continuez que si vous faites confiance à ce site.


xpinstall-disabled-locked = L’installation de logiciels a été désactivée par votre administrateur système.
xpinstall-disabled = L’installation de logiciels est actuellement désactivée. Cliquez sur « Activer » et essayez à nouveau.
xpinstall-disabled-button =
    .label = Activer
    .accesskey = C
addon-install-blocked-by-policy = { $addonName } ({ $addonId }) est bloqué par votre administrateur système.
addon-domain-blocked-by-policy = Votre administrateur système a empêché ce site d’installer un logiciel sur votre ordinateur.
addon-install-full-screen-blocked = L’installation de modules complémentaires n’est pas autorisée pendant ou avant le passage en mode plein écran.
webext-perms-sideload-menu-item = { $addonName } a été ajouté à { -brand-short-name }
webext-perms-update-menu-item = { $addonName } demande de nouvelles permissions


addon-removal-title = Supprimer { $name } ?
addon-removal-message = Supprimer { $name } de { -brand-shorter-name } ?
addon-removal-button = Supprimer
addon-removal-abuse-report-checkbox = Signaler cette extension à { -vendor-short-name }
addon-downloading-and-verifying =
    { $addonCount ->
        [one] Téléchargement et vérification du module…
       *[other] Téléchargement et vérification de { $addonCount } modules…
    }
addon-download-verifying = Vérification en cours
addon-install-cancel-button =
    .label = Annuler
    .accesskey = N
addon-install-accept-button =
    .label = Ajouter
    .accesskey = O


addon-confirm-install-message =
    { $addonCount ->
        [one] Ce site souhaite installer un module sur { -brand-short-name } :
       *[other] Ce site souhaite installer { $addonCount } modules sur { -brand-short-name } :
    }
addon-confirm-install-unsigned-message =
    { $addonCount ->
        [one] Attention, ce site souhaite installer un module non vérifié sur { -brand-short-name }. Poursuivez à vos risques et périls.
       *[other] Attention, ce site souhaite installer { $addonCount } modules non vérifiés sur { -brand-short-name }. Poursuivez à vos risques et périls.
    }
addon-confirm-install-some-unsigned-message = Attention, ce site souhaite installer { $addonCount } modules sur { -brand-short-name }, dont certains ne sont pas vérifiés. Poursuivez à vos risques et périls.


addon-install-error-network-failure = Le module complémentaire n’a pas pu être téléchargé à cause d’un échec de connexion.
addon-install-error-incorrect-hash = Le module complémentaire n’a pas pu être installé car il ne correspond pas au module attendu par { -brand-short-name }.
addon-install-error-corrupt-file = Le module complémentaire téléchargé depuis ce site n’a pas pu être installé car il semble corrompu.
addon-install-error-file-access = { $addonName } n’a pas pu être installé car un fichier n’a pas pu être modifié par { -brand-short-name }.
addon-install-error-not-signed = { -brand-short-name } a empêché ce site d’installer un module complémentaire non vérifié.
addon-install-error-invalid-domain = Le module complémentaire { $addonName } ne peut pas être installé depuis cet emplacement.
addon-local-install-error-network-failure = Ce module complémentaire n’a pas pu être installé à cause d’une erreur du système de fichiers.
addon-local-install-error-incorrect-hash = Ce module n’a pas pu être installé car il ne correspond pas au module attendu par { -brand-short-name }.
addon-local-install-error-corrupt-file = Ce module complémentaire n’a pas pu être installé car il semble être corrompu.
addon-local-install-error-file-access = { $addonName } n’a pas pu être installé car un fichier n’a pas pu être modifié par { -brand-short-name }.
addon-local-install-error-not-signed = Ce module complémentaire n’a pas pu être installé car il n’a pas été vérifié.
addon-install-error-incompatible = { $addonName } n’a pas pu être installé car il n’est pas compatible avec { -brand-short-name } { $appVersion }.
addon-install-error-blocklisted = { $addonName } n’a pas pu être installé car il présente un risque élevé de causer des problèmes de stabilité ou de sécurité.
