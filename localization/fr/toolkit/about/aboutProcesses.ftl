
about-processes-title = Gestionnaire de processus

about-processes-column-action =
    .title = Actions


about-processes-shutdown-process =
    .title = Décharger les onglets et tuer le processus
about-processes-shutdown-tab =
    .title = Fermer l’onglet

about-processes-profile-process =
    .title =
        { $duration ->
            [one] Profilez tous les threads de ce processus pendant { $duration } seconde
           *[other] Profilez tous les threads de ce processus pendant { $duration } secondes
        }


about-processes-column-name = Nom
about-processes-column-memory-resident = Mémoire
about-processes-column-cpu-total = Processeur


about-processes-browser-process = { -brand-short-name } ({ $pid })
about-processes-web-process = Processus web partagé ({ $pid })
about-processes-file-process = Fichiers ({ $pid })
about-processes-extension-process = Extensions ({ $pid })
about-processes-privilegedabout-process = Pages « about: » ({ $pid })
about-processes-plugin-process = Plugins ({ $pid })
about-processes-privilegedmozilla-process = Sites { -vendor-short-name } ({ $pid })
about-processes-gmp-plugin-process = Plugins multimédia Gecko ({ $pid })
about-processes-gpu-process = Processeur graphique ({ $pid })
about-processes-vr-process = Réalité virtuelle ({ $pid })
about-processes-rdd-process = Décodeur de données ({ $pid })
about-processes-socket-process = Réseau ({ $pid })
about-processes-remote-sandbox-broker-process = Broker du bac à sable distant ({ $pid })
about-processes-fork-server-process = Copie du serveur ({ $pid })
about-processes-preallocated-process = Préalloué ({ $pid })
about-processes-utility-process = Utilitaire ({ $pid })

about-processes-unknown-process = Autre : { $type } ({ $pid })


about-processes-web-isolated-process = { $origin } ({ $pid })
about-processes-web-serviceworker = { $origin } ({ $pid }, ServiceWorker)
about-processes-with-coop-coep-process = { $origin } ({ $pid }, processus multiorigine isolé)
about-processes-web-isolated-process-private = { $origin } — Privé ({ $pid })
about-processes-with-coop-coep-process-private = { $origin } — Privé ({ $pid }, processus multiorigine isolé)


about-processes-active-threads =
    { $active ->
        [one] { $active } thread actif sur { $number } : { $list }
       *[other] { $active } threads actifs sur { $number } : { $list }
    }

about-processes-inactive-threads =
    { $number ->
        [one] { $number } thread inactif
       *[other] { $number } threads inactifs
    }

about-processes-thread-name-and-id = { $name }
    .title = Identifiant du thread : { $tid }

about-processes-tab-name = Onglet : { $name }
about-processes-preloaded-tab = Nouvel onglet préchargé

about-processes-frame-name-one = Iframe imbriqué : { $url }

about-processes-frame-name-many = Iframes imbriqués ({ $number }) : { $shortUrl }


about-processes-utility-actor-unknown = Utilitaire inconnu
about-processes-utility-actor-audio-decoder-generic = Décodeur audio générique
about-processes-utility-actor-audio-decoder-applemedia = Décodeur audio multimédia Apple
about-processes-utility-actor-audio-decoder-wmf = Décodeur audio Windows Media Framework
about-processes-utility-actor-mf-media-engine = CDM du moteur multimédia Windows Media Foundation
about-processes-utility-actor-js-oracle = Oracle JavaScript
about-processes-utility-actor-windows-utils = Utilitaires Windows


about-processes-cpu = { NUMBER($percent, maximumSignificantDigits: 2, style: "percent") }
    .title = Temps total de CPU : { NUMBER($total, maximumFractionDigits: 0) } { $unit }

about-processes-cpu-user-and-kernel-not-ready = (mesure en cours)

about-processes-cpu-almost-idle = < 0,1 %
    .title = Temps CPU total : { NUMBER($total, maximumFractionDigits: 0) } { $unit }

about-processes-cpu-fully-idle = inactif
    .title = Temps total de CPU : { NUMBER($total, maximumFractionDigits: 0) } { $unit }


about-processes-total-memory-size-changed = { NUMBER($total, maximumFractionDigits: 0) } { $totalUnit }
    .title = Évolution : { $deltaSign }{ NUMBER($delta, maximumFractionDigits: 0) } { $deltaUnit }

about-processes-total-memory-size-no-change = { NUMBER($total, maximumFractionDigits: 0) } { $totalUnit }


duration-unit-ns = ns
duration-unit-us = µs
duration-unit-ms = ms
duration-unit-s = s
duration-unit-m = m
duration-unit-h = h
duration-unit-d = j


memory-unit-B = o
memory-unit-KB = Ko
memory-unit-MB = Mo
memory-unit-GB = Go
memory-unit-TB = To
memory-unit-PB = Po
memory-unit-EB = Eo
