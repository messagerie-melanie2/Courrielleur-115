


compose-send-format-menu =
    .label = Format d’expédition
    .accesskey = F
compose-send-auto-menu-item =
    .label = Automatique
    .accesskey = A
compose-send-both-menu-item =
    .label = HTML et texte brut
    .accesskey = H
compose-send-html-menu-item =
    .label = Uniquement en HTML
    .accesskey = U
compose-send-plain-menu-item =
    .label = Uniquement en texte brut
    .accesskey = b


remove-address-row-button =
    .title = Supprimer le champ { $type }
address-input-type-aria-label =
    { $count ->
        [0] { $type }
        [one] { $type } avec une adresse, utilisez la touche flèche gauche pour la sélectionner.
       *[other] { $type } avec { $count } adresses, utilisez la touche flèche gauche pour les sélectionner.
    }
pill-aria-label =
    { $count ->
        [one] { $email } : appuyez sur Entrée pour modifier, ou Supprimer pour retirer.
       *[other] { $email }, 1 sur { $count } : appuyez sur Entrée pour modifier, ou Supprimer pour retirer.
    }
pill-tooltip-invalid-address = { $email } n’est pas une adresse e-mail valide
pill-tooltip-not-in-address-book = { $email } ne figure pas dans votre carnet d’adresses
pill-action-edit =
    .label = Modifier l’adresse
    .accesskey = M
pill-action-select-all-sibling-pills =
    .label = Sélectionner toutes les adresses dans { $type }
    .accesskey = a
pill-action-select-all-pills =
    .label = Sélectionner toutes les adresses
    .accesskey = S
pill-action-move-to =
    .label = Déplacer vers Pour
    .accesskey = p
pill-action-move-cc =
    .label = Déplacer vers Copie à
    .accesskey = c
pill-action-move-bcc =
    .label = Déplacer vers Copie cachée à
    .accesskey = h
pill-action-expand-list =
    .label = Développer la liste
    .accesskey = D


ctrl-cmd-shift-pretty-prefix =
    { PLATFORM() ->
        [macos] ⇧ ⌘{ " " }
       *[other] Ctrl+Maj+
    }
trigger-attachment-picker-key = A
toggle-attachment-pane-key = M
menuitem-toggle-attachment-pane =
    .label = Panneau des pièces jointes
    .accesskey = n
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key }
toolbar-button-add-attachment =
    .label = Joindre
    .tooltiptext = Ajouter une pièce jointe ({ ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key })
add-attachment-notification-reminder2 =
    .label = Ajouter une pièce jointe…
    .accesskey = j
    .tooltiptext = { toolbar-button-add-attachment.tooltiptext }
menuitem-attach-files =
    .label = Fichier(s)…
    .accesskey = F
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key }
context-menuitem-attach-files =
    .label = Joindre fichier(s)…
    .accesskey = f
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key }
context-menuitem-attach-vcard =
    .label = Ma vCard
    .accesskey = C
context-menuitem-attach-openpgp-key =
    .label = Ma clé publique OpenPGP
    .accesskey = O
attachment-bucket-count-value =
    { $count ->
        [1] { $count } pièce jointe
       *[other] { $count } pièces jointes
    }
attachment-area-show =
    .title = Afficher le volet des pièces jointes ({ ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key })
attachment-area-hide =
    .title = Masquer le volet des pièces jointes ({ ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key })


drop-file-label-attachment =
    { $count ->
        [one] Ajouter comme pièce jointe
       *[other] Ajouter comme pièces jointes
    }
drop-file-label-inline =
    { $count ->
        [one] Ajouter au corps du message
       *[other] Ajouter au corps du message
    }


move-attachment-first-panel-button =
    .label = En premier
move-attachment-left-panel-button =
    .label = Vers la gauche
move-attachment-right-panel-button =
    .label = Vers la droite
move-attachment-last-panel-button =
    .label = En dernier
button-return-receipt =
    .label = Accusé de réception
    .tooltiptext = Demander un accusé de réception pour ce message


encryption-menu =
    .label = Sécurité
    .accesskey = c
encryption-toggle =
    .label = Chiffrer
    .tooltiptext = Utiliser le chiffrement de bout en bout pour ce message
encryption-options-openpgp =
    .label = OpenPGP
    .tooltiptext = Voir ou modifier les paramètres de chiffrement OpenPGP
encryption-options-smime =
    .label = S/MIME
    .tooltiptext = Voir ou modifier les paramètres de chiffrement S/MIME
signing-toggle =
    .label = Signer
    .tooltiptext = Signer numériquement ce message
menu-openpgp =
    .label = OpenPGP
    .accesskey = O
menu-smime =
    .label = S/MIME
    .accesskey = S
menu-encrypt =
    .label = Chiffrer
    .accesskey = C
menu-encrypt-subject =
    .label = Chiffrer le sujet
    .accesskey = u
menu-sign =
    .label = Signer numériquement
    .accesskey = n
menu-manage-keys =
    .label = Assistant de clés
    .accesskey = A
menu-view-certificates =
    .label = Voir les certificats des destinataires
    .accesskey = V
menu-open-key-manager =
    .label = Gestionnaire de clés
    .accesskey = G
openpgp-key-issue-notification-one = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de clé pour { $addr }
openpgp-key-issue-notification-many = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de clés pour { $count } destinataires.
smime-cert-issue-notification-one = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de certificat pour { $addr }
smime-cert-issue-notification-many = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de certificat pour { $count } destinataires.
openpgp-key-issue-notification-from = Votre compte { $addr } n’est pas configuré pour envoyer des messages chiffrés de bout en bout.
openpgp-key-issue-notification-single = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de clés pour { $addr }.
openpgp-key-issue-notification-multi =
    { $count ->
        [one] Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de clés pour { $count } destinataire.
       *[other] Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de clés pour { $count } destinataires.
    }
smime-cert-issue-notification-single = Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de certificat pour { $addr }.
smime-cert-issue-notification-multi =
    { $count ->
        [one] Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de certificat pour { $count } destinataire.
       *[other] Pour utiliser le chiffrement de bout en bout vous devez résoudre les problèmes de certificat pour { $count } destinataires.
    }
key-notification-disable-encryption =
    .label = Ne pas chiffrer
    .accesskey = N
    .tooltiptext = Désactiver le chiffrement de bout en bout
key-notification-resolve =
    .label = Résoudre…
    .accesskey = R
    .tooltiptext = Ouvrir l’assistant de clés OpenPGP
can-encrypt-smime-notification = Chiffrement S/MIME de bout en bout disponible.
can-encrypt-openpgp-notification = Chiffrement OpenPGP de bout en bout disponible.
can-e2e-encrypt-button =
    .label = Chiffrer
    .accesskey = C


to-address-row-label =
    .value = Pour
show-to-row-main-menuitem =
    .label = Champ Pour
    .accesskey = P
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }
show-to-row-extra-menuitem =
    .label = Pour
    .accesskey = P
show-to-row-button = Pour
    .title = Afficher le champ Pour ({ ctrl-cmd-shift-pretty-prefix }{ $key })
cc-address-row-label =
    .value = Copie à
show-cc-row-main-menuitem =
    .label = Champ Copie à
    .accesskey = C
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }
show-cc-row-extra-menuitem =
    .label = Copie à
    .accesskey = C
show-cc-row-button = Copie à
    .title = Afficher le champ Copie à ({ ctrl-cmd-shift-pretty-prefix }{ $key })
bcc-address-row-label =
    .value = Copie cachée à
show-bcc-row-main-menuitem =
    .label = Champ Copie cachée à
    .accesskey = h
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }
show-bcc-row-extra-menuitem =
    .label = Copie cachée à
    .accesskey = h
show-bcc-row-button = Copie cachée à
    .title = Afficher le champ Copie cachée à ({ ctrl-cmd-shift-pretty-prefix }{ $key })
extra-address-rows-menu-button =
    .title = Autres champs d’adressage à afficher
many-public-recipients-notice =
    { $count ->
        [one] Votre message a un destinataire public. Vous pouvez éviter de révéler les destinataires en utilisant plutôt « Copie cachée à ».
       *[other] Les { $count } destinataires en « Pour » et « Copie à » verront les adresses des autres. Vous pouvez éviter de révéler les destinataires en utilisant plutôt « Copie cachée à ».
    }
public-recipients-notice-single = Votre message a un destinataire public. Vous pouvez éviter de divulguer le destinataire en utilisant plutôt « Copie cachée à ».
public-recipients-notice-multi =
    { $count ->
        [one] Le destinataire en « Pour » ou « Copie à » verra les adresses des autres destinataires. Vous pouvez éviter de révéler les destinataires en utilisant plutôt « Copie cachée à ».
       *[other] Les { $count } destinataires en « Pour » et « Copie à » verront les adresses des autres destinataires. Vous pouvez éviter de révéler les destinataires en utilisant plutôt « Copie cachée à ».
    }
many-public-recipients-bcc =
    .label = Utiliser plutôt la Copie cachée
    .accesskey = U
many-public-recipients-ignore =
    .label = Garder les destinataires publics
    .accesskey = G
many-public-recipients-prompt-title = Trop de destinataires publics
many-public-recipients-prompt-msg =
    { $count ->
        [one] Votre message a un destinataire public. Cela peut être un problème de confidentialité. Vous pouvez l’éviter en déplaçant plutôt le destinataire vers « Copie cachée à ».
       *[other] Votre message a { $count } destinataires publics, qui pourront voir les adresses les uns des autres. Cela peut être un problème de confidentialité. Vous pouvez éviter de divulguer les destinataires en déplaçant plutôt ceux-ci vers « Copie cachée à ».
    }
many-public-recipients-prompt-cancel = Annuler l’envoi
many-public-recipients-prompt-send = Envoyer quand même


compose-missing-identity-warning = Une identité unique correspondant à l’adresse d’expédition n’a pas été trouvée. Le message sera envoyé en utilisant l’adresse d’expédition actuelle avec les paramètres de l’identité { $identity }.
encrypted-bcc-warning = Lors de l’envoi d’un message chiffré, les destinataires en copie cachée ne sont pas complètement masqués. Tous les destinataires pourraient les identifier.
encrypted-bcc-ignore-button = C’est compris
auto-disable-e2ee-warning = Le chiffrement de bout en bout de ce message a été automatiquement désactivé.




compose-tool-button-remove-text-styling =
    .tooltiptext = Supprimer le style du texte


cloud-file-unknown-account-tooltip = Envoyé sur un compte Filelink inconnu.


cloud-file-placeholder-title = { $filename } - Pièce jointe Filelink
cloud-file-placeholder-intro = Le fichier { $filename } a été joint en tant que Filelink. Il peut être téléchargé à partir du lien ci-dessous.


cloud-file-count-header =
    { $count ->
        [one] J’ai lié un fichier à ce message :
       *[other] J’ai lié { $count } fichiers à ce message :
    }
cloud-file-service-provider-footer-single = En savoir plus sur { $link }.
cloud-file-service-provider-footer-multiple = En savoir plus sur { $firstLinks } et { $lastLink }.
cloud-file-tooltip-password-protected-link = Lien protégé par mot de passe
cloud-file-template-service-name = Service Filelink :
cloud-file-template-size = Taille :
cloud-file-template-link = Lien :
cloud-file-template-password-protected-link = Lien protégé par mot de passe :
cloud-file-template-expiry-date = Date d’expiration :
cloud-file-template-download-limit = Limite de téléchargement :


cloud-file-connection-error-title = Erreur de connexion
cloud-file-connection-error = { -brand-short-name } est hors ligne. Impossible de se connecter à { $provider }.
cloud-file-upload-error-with-custom-message-title = Échec de l’envoi de { $filename } à { $provider }
cloud-file-rename-error-title = Erreur de renommage
cloud-file-rename-error = Un problème est survenu lors du changement de nom de { $filename } sur { $provider }.
cloud-file-rename-error-with-custom-message-title = Échec du changement de nom de { $filename } sur { $provider }
cloud-file-rename-not-supported = { $provider } ne prend pas en charge le changement de nom des fichiers déjà téléchargés.
cloud-file-attachment-error-title = Erreur de pièce jointe Filelink
cloud-file-attachment-error = Échec de la mise à jour de la pièce jointe Filelink { $filename }, car son fichier local a été déplacé ou supprimé.
cloud-file-account-error-title = Erreur de compte Filelink
cloud-file-account-error = Échec de la mise à jour de la pièce jointe Filelink { $filename }, car son compte Filelink a été supprimé.


link-preview-title = Aperçu du lien
link-preview-description = { -brand-short-name } peut ajouter un aperçu intégré lors du collage des liens.
link-preview-autoadd = Ajouter automatiquement un aperçu des liens lorsque cela est possible
link-preview-replace-now = Ajouter un aperçu pour ce lien ?
link-preview-yes-replace = Oui


spell-add-dictionaries =
    .label = Ajouter des dictionnaires…
    .accesskey = A
