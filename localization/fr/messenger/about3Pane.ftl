


quick-filter-button =
    .title = Afficher/Masquer la barre de filtre rapide
quick-filter-button-label = Filtre rapide
thread-pane-header-display-button =
    .title = Options d’affichage de la liste des messages
thread-pane-folder-message-count =
    { $count ->
        [one] { $count } message
       *[other] { $count } messages
    }
thread-pane-folder-selected-count =
    { $count ->
        [one] { $count } message sélectionné
       *[other] { $count } messages sélectionnés
    }
thread-pane-header-context-table-view =
    .label = Vue tableau
thread-pane-header-context-cards-view =
    .label = Vue en fiches
thread-pane-header-context-hide =
    .label = Masquer l’en-tête de la liste de messages


quick-filter-bar-sticky =
    .title = Conserver les filtres lors des changements de dossiers ?
quick-filter-bar-dropdown =
    .title = Menu de filtre rapide
quick-filter-bar-dropdown-unread =
    .label = Non lus
quick-filter-bar-dropdown-starred =
    .label = Suivis
quick-filter-bar-dropdown-inaddrbook =
    .label = Contacts
quick-filter-bar-dropdown-tags =
    .label = Étiquettes
quick-filter-bar-dropdown-attachment =
    .label = Pièces jointes
quick-filter-bar-unread =
    .title = Afficher seulement les messages non lus.
quick-filter-bar-unread-label = Non lus
quick-filter-bar-starred =
    .title = Afficher seulement les messages suivis.
quick-filter-bar-starred-label = Suivis
quick-filter-bar-inaddrbook =
    .title = Afficher seulement les messages des personnes présentes dans mon carnet d’adresses.
quick-filter-bar-inaddrbook-label = Contacts
quick-filter-bar-tags =
    .title = Afficher seulement les messages ayant des étiquettes.
quick-filter-bar-tags-label = Étiquettes
quick-filter-bar-attachment =
    .title = Afficher seulement les messages ayant des pièces jointes.
quick-filter-bar-attachment-label = Pièces jointes
quick-filter-bar-no-results = Pas de résultats
quick-filter-bar-results =
    { $count ->
        [one] { $count } message
       *[other] { $count } messages
    }
quick-filter-bar-textbox-shortcut =
    { PLATFORM() ->
        [macos] ⇧ ⌘ K
       *[other] Ctrl+Maj+K
    }
quick-filter-bar-textbox =
    .placeholder = Filtrer ces messages <{ quick-filter-bar-textbox-shortcut }>
quick-filter-bar-boolean-mode =
    .title = Mode de filtrage par étiquettes
quick-filter-bar-boolean-mode-any =
    .label = Au moins une
    .title = Au moins une des étiquettes sélectionnées doit correspondre
quick-filter-bar-boolean-mode-all =
    .label = Toutes
    .title = Toutes les étiquettes sélectionnées doivent correspondre
quick-filter-bar-text-filter-explanation = Filtrer les messages selon :
quick-filter-bar-text-filter-sender = Expéditeur
quick-filter-bar-text-filter-recipients = Destinataires
quick-filter-bar-text-filter-subject = Sujet
quick-filter-bar-text-filter-body = Corps du message
quick-filter-bar-gloda-upsell-line1 = Continuer cette recherche dans tous les dossiers
quick-filter-bar-gloda-upsell-line2 = Appuyez sur la touche « Entrée » à nouveau pour continuer votre recherche pour : { $text }


folder-pane-get-messages-button =
    .title = Relever les nouveaux messages
folder-pane-get-all-messages-menuitem =
    .label = Relever tous les nouveaux messages
    .accesskey = R
folder-pane-write-message-button = Nouveau message
    .title = Rédiger un nouveau message
folder-pane-more-menu-button =
    .title = Options du panneau des dossiers
folder-pane-header-folder-modes =
    .label = Modes des dossiers
folder-pane-header-context-toggle-get-messages =
    .label = Afficher « Relever les messages »
folder-pane-header-context-toggle-new-message =
    .label = Afficher « Nouveau message »
folder-pane-header-context-hide =
    .label = Masquer l’en-tête du panneau des dossiers
folder-pane-show-total-toggle =
    .label = Afficher le nombre total de messages
folder-pane-header-toggle-folder-size =
    .label = Afficher la taille du dossier
folder-pane-header-hide-local-folders =
    .label = Masquer les dossiers locaux
folder-pane-mode-context-button =
    .title = Options du mode dossier
folder-pane-mode-context-toggle-compact-mode =
    .label = Vue compacte
    .accesskey = V
folder-pane-mode-move-up =
    .label = Déplacer vers le haut
folder-pane-mode-move-down =
    .label = Déplacer vers le bas
folder-pane-unread-aria-label =
    { $count ->
        [one] 1 message non lu
       *[other] { $count } messages non lus
    }
folder-pane-total-aria-label =
    { $count ->
        [one] 1 message au total
       *[other] { $count } messages au total
    }


threadpane-column-header-select =
    .title = Sélectionner/désélectionner tous les messages
threadpane-column-header-select-all =
    .title = Sélectionner tous les messages
threadpane-column-header-deselect-all =
    .title = Désélectionner tous les messages
threadpane-column-label-select =
    .label = Sélectionner des messages
threadpane-column-header-thread =
    .title = Grouper ou non par fils de discussion
threadpane-column-label-thread =
    .label = Discussion
threadpane-column-header-flagged =
    .title = Trier par suivi
threadpane-column-label-flagged =
    .label = Suivi
threadpane-flagged-cell-label = Suivi
threadpane-column-header-attachments =
    .title = Trier par pièces jointes
threadpane-column-label-attachments =
    .label = Pièces jointes
threadpane-attachments-cell-label = Pièces jointes
threadpane-column-header-spam =
    .title = Trier par statut indésirable
threadpane-column-label-spam =
    .label = Indésirables
threadpane-spam-cell-label = Indésirables
threadpane-column-header-unread-button =
    .title = Trier par statut de lecture
threadpane-column-label-unread-button =
    .label = Statut de lecture
threadpane-read-cell-label = Lu
threadpane-unread-cell-label = Non lu
threadpane-column-header-sender = Expéditeur
    .title = Trier par expéditeur
threadpane-column-label-sender =
    .label = Expéditeur
threadpane-column-header-recipient = Destinataire
    .title = Trier par destinataire
threadpane-column-label-recipient =
    .label = Destinataire
threadpane-column-header-correspondents = Correspondants
    .title = Trier par correspondants
threadpane-column-label-correspondents =
    .label = Correspondants
threadpane-column-header-subject = Sujet
    .title = Trier par sujet
threadpane-column-label-subject =
    .label = Sujet
threadpane-column-header-date = Date
    .title = Trier par date
threadpane-column-label-date =
    .label = Date
threadpane-column-header-received = Reçu
    .title = Trier par date de réception
threadpane-column-label-received =
    .label = Reçu
threadpane-column-header-status = Statut
    .title = Trier par statut
threadpane-column-label-status =
    .label = Statut
threadpane-column-header-size = Taille
    .title = Trier par taille
threadpane-column-label-size =
    .label = Taille
threadpane-column-header-tags = Étiquettes
    .title = Trier par étiquettes
threadpane-column-label-tags =
    .label = Étiquettes
threadpane-column-header-account = Compte
    .title = Trier par compte
threadpane-column-label-account =
    .label = Compte
threadpane-column-header-priority = Priorité
    .title = Trier par priorité
threadpane-column-label-priority =
    .label = Priorité
threadpane-column-header-unread = Non lu
    .title = Nombre de messages non lus dans le fil
threadpane-column-label-unread =
    .label = Non lu
threadpane-column-header-total = Total
    .title = Nombre total de messages dans le fil
threadpane-column-label-total =
    .label = Total
threadpane-column-header-location = Emplacement
    .title = Trier par adresse
threadpane-column-label-location =
    .label = Emplacement
threadpane-column-header-id = Ordre de réception
    .title = Trier par ordre de réception
threadpane-column-label-id =
    .label = Ordre de réception
threadpane-column-header-delete =
    .title = Supprimer un message
threadpane-column-label-delete =
    .label = Supprimer


threadpane-message-new =
    .alt = Indicateur de nouveau message
    .title = Nouveau message
threadpane-message-replied =
    .alt = Indicateur de réponse
    .title = Message répondu
threadpane-message-redirected =
    .alt = Indicateur de redirection
    .title = Message redirigé
threadpane-message-forwarded =
    .alt = Indicateur de transfert
    .title = Message transféré
threadpane-message-replied-forwarded =
    .alt = Indicateur de réponse et transfert
    .title = Message répondu et transféré
threadpane-message-replied-redirected =
    .alt = Indicateur de réponse et de redirection
    .title = Message répondu et redirigé
threadpane-message-forwarded-redirected =
    .alt = Indicateur de transfert et redirection
    .title = Message transféré et redirigé
threadpane-message-replied-forwarded-redirected =
    .alt = Indicateur de réponse, transfert et redirection
    .title = Message répondu, transféré et redirigé
apply-columns-to-menu =
    .label = Appliquer ces paramètres à…
apply-current-view-to-menu =
    .label = Appliquer la vue actuelle à…
apply-current-view-to-folder =
    .label = Dossier…
apply-current-view-to-folder-children =
    .label = Dossier et sous-dossiers…


apply-changes-to-folder-title = Appliquer les modifications ?
apply-current-columns-to-folder-message = Appliquer les paramètres de ce dossier à { $name } ?
apply-current-columns-to-folder-with-children-message = Appliquer les paramètres de ce dossier à { $name } et ses sous-dossiers ?
apply-current-view-to-folder-message = Appliquer la vue de ce dossier à { $name } ?
apply-current-view-to-folder-with-children-message = Appliquer la vue de ce dossier à { $name } et à ses sous-dossiers ?
