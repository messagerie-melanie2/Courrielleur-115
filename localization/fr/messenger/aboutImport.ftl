
import-page-title = Importation

export-page-title = Exporter


import-start = Outil d’importation

import-start-title = Importez des paramètres ou des données à partir d’une application ou d’un fichier.

import-start-description = Sélectionnez la source à partir de laquelle vous souhaitez importer des données. Vous pourrez ensuite choisir les données à importer.

import-from-app = Importer depuis l’application

import-file = Importer depuis un fichier

import-file-title = Sélectionnez un fichier pour importer son contenu.

import-file-description = Choisissez d’importer un profil, des carnets d’adresses ou des agendas précédemment sauvegardés.

import-address-book-title = Importer le fichier d’un carnet d’adresses

import-calendar-title = Importer le fichier d’un agenda

export-profile = Exporter


button-back = Retour

button-continue = Continuer

button-export = Exporter

button-finish = Terminer


app-name-thunderbird = Thunderbird

app-name-seamonkey = SeaMonkey

app-name-outlook = Outlook

app-name-becky = Becky! Internet Mail

app-name-apple-mail = Apple Mail

source-thunderbird = Importer depuis une autre installation de { app-name-thunderbird }

source-thunderbird-description = Importer les paramètres, les filtres, les messages et d’autres données à partir d’un profil { app-name-thunderbird }.

source-seamonkey = Importer depuis une installation de { app-name-seamonkey }

source-seamonkey-description = Importer les paramètres, les filtres, les messages et d’autres données à partir d’un profil { app-name-seamonkey }.

source-outlook = Importer depuis { app-name-outlook }

source-outlook-description = Importer les comptes, les carnets d’adresses et les messages depuis { app-name-outlook }.

source-becky = Importer depuis { app-name-becky }

source-becky-description = Importer les carnets d’adresses et les messages depuis { app-name-becky }.

source-apple-mail = Importer depuis { app-name-apple-mail }

source-apple-mail-description = Importer les messages depuis { app-name-apple-mail }.

source-file2 = Importer depuis un fichier

source-file-description = Sélectionnez un fichier pour importer les carnets d’adresses, les agendas ou une sauvegarde de profil (fichier ZIP).


file-profile2 = Importer un profil sauvegardé

file-profile-description = Sélectionnez un profil Thunderbird précédemment sauvegardé (.zip)

file-calendar = Importer des agendas

file-calendar-description = Sélectionnez un fichier contenant des agendas ou des évènements exportés (.ics)

file-addressbook = Importer des carnets d’adresses

file-addressbook-description = Sélectionnez un fichier contenant des carnets d’adresses et des contacts exportés


from-app-thunderbird = Importer à partir d’un profil { app-name-thunderbird }

from-app-seamonkey = Importer à partir d’un profil { app-name-seamonkey }

from-app-outlook = Importer depuis { app-name-outlook }

from-app-becky = Importer depuis { app-name-becky }

from-app-apple-mail = Importer depuis { app-name-apple-mail }

profiles-pane-title-thunderbird = Importer les paramètres et les données depuis un profil { app-name-thunderbird }.

profiles-pane-title-seamonkey = Importer les paramètres et les données depuis un profil { app-name-seamonkey }.

profiles-pane-title-outlook = Importer les données depuis { app-name-outlook }.

profiles-pane-title-becky = Importer les données depuis { app-name-becky }.

profiles-pane-title-apple-mail = Importer les messages depuis { app-name-apple-mail }.

profile-source = Importer depuis un profil

profile-source-named = Importer depuis le profil <strong>« { $profileName } »</strong>

profile-file-picker-directory = Choisir un dossier de profil

profile-file-picker-archive = Choisissez un fichier <strong>ZIP</strong>

profile-file-picker-archive-description = Le fichier ZIP doit être inférieur à 2 Go.

profile-file-picker-archive-title = Choisissez un fichier ZIP (inférieur à 2 Go)

items-pane-title2 = Choisissez ce que vous souhaitez importer :

items-pane-directory = Répertoire :

items-pane-profile-name = Nom du profil :

items-pane-checkbox-accounts = Comptes et paramètres

items-pane-checkbox-address-books = Carnets d’adresses

items-pane-checkbox-calendars = Agendas

items-pane-checkbox-mail-messages = Courriers

items-pane-override = Les données existantes ou identiques ne seront pas écrasées.


import-from-addr-book-file-description = Choisissez le format de fichier contenant les données de votre carnet d’adresses.

addr-book-csv-file = Fichier séparé par des virgules ou des tabulations (.csv, .tsv)

addr-book-ldif-file = Fichier LDIF (.ldif)

addr-book-vcard-file = Fichier vCard (.vcf, .vcard)

addr-book-sqlite-file = Fichier de base de données SQLite (.sqlite)

addr-book-mab-file = Base de données Mork (.mab)

addr-book-file-picker = Sélectionner un fichier de carnet d’adresses

addr-book-csv-field-map-title = Faire correspondre les noms de champs

addr-book-csv-field-map-desc = Sélectionnez les champs du carnet d’adresses correspondant aux champs source. Décochez les champs que vous ne voulez pas importer.

addr-book-directories-title = Choisissez où importer les données sélectionnées

addr-book-directories-pane-source = Fichier source :

addr-book-import-into-new-directory2 = Créer un nouveau répertoire sous le nom <strong>« { $addressBookName } »</strong>

addr-book-summary-title = Importer les données choisies dans le répertoire « { $addressBookName } »

addr-book-summary-description = Un nouveau carnet d’adresses sous le nom « { $addressBookName } » sera créé.


import-from-calendar-file-desc = Sélectionnez le fichier iCalendar (.ics) que vous voulez importer.

calendar-items-title = Sélectionnez les éléments à importer.

calendar-items-loading = Chargement des éléments…

calendar-items-filter-input =
    .placeholder = Filtrer les éléments…

calendar-select-all-items = Tout sélectionner

calendar-deselect-all-items = Tout désélectionner

calendar-target-title = Choisissez où importer les éléments sélectionnés.

calendar-import-into-new-calendar2 = Créer un nouvel agenda sous le nom <strong>« { $targetCalendar } »</strong>

calendar-summary-title =
    { $itemCount ->
        [one] Importer un élément dans l’agenda « { $targetCalendar } »
       *[other] Importer { $itemCount } éléments dans l’agenda « { $targetCalendar } »
    }

calendar-summary-description = Un nouvel agenda sous le nom « { $targetCalendar } » sera créé.


progress-pane-importing2 = Importation… { $progressPercent }

progress-pane-exporting2 = Exportation… { $progressPercent }

progress-pane-finished-desc2 = Terminé.

error-pane-title = Erreur

error-message-zip-file-too-big2 = La taille du fichier ZIP sélectionné est supérieure à 2 Go. Veuillez d’abord l’extraire, puis importer les données à partir du dossier d’extraction.

error-message-extract-zip-file-failed2 = Échec de l’extraction du fichier ZIP. Veuillez plutôt l’extraire manuellement, puis l’importer depuis le dossier extrait.

error-message-failed = L’importation a échoué de manière inattendue, des informations supplémentaires peuvent être disponibles dans la console d’erreurs.

error-failed-to-parse-ics-file = Aucun élément importable trouvé dans le fichier.

error-export-failed = L’exportation a échoué de manière inattendue, des informations supplémentaires peuvent être disponibles dans la console d’erreurs.

error-message-no-profile = Aucun profil trouvé.


csv-first-row-contains-headers = La première ligne contient le nom des champs

csv-source-field = Champ source

csv-source-first-record = Premier enregistrement

csv-source-second-record = Deuxième enregistrement

csv-target-field = Champ du carnet d’adresses


export-profile-title = Exporter les comptes de messagerie, messages, carnets d’adresses et paramètres dans un fichier au format ZIP.

export-profile-description = Si votre profil actuel est supérieur à 2 Go, nous vous recommandons de le sauvegarder vous-même.

export-open-profile-folder = Ouvrir le dossier de profil

export-file-picker2 = Exporter vers un fichier au format Zip

export-brand-name = { -brand-product-name }


summary-pane-title = Données à importer

summary-pane-start = Lancer l’importation

summary-pane-warning = { -brand-product-name } devra être redémarré une fois l’importation terminée.

summary-pane-start-over = Redémarrer l’outil d’importation


footer-help = Besoin d’aide ?

footer-import-documentation = Documentation sur l’importation

footer-export-documentation = Documentation sur l’exportation

footer-support-forum = Forum d’assistance


step-list =
    .aria-label = Étapes d’importation

step-confirm = Confirmation

step-count = { $number }
