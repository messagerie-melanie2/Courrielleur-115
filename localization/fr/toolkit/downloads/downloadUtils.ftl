

download-utils-short-seconds =
    { $timeValue ->
        [one] s
       *[other] s
    }
download-utils-short-minutes =
    { $timeValue ->
        [one] min
       *[other] min
    }
download-utils-short-hours =
    { $timeValue ->
        [one] h
       *[other] h
    }
download-utils-short-days =
    { $timeValue ->
        [one] j
       *[other] j
    }


download-utils-status = { $timeLeft } — { $transfer } ({ $rate } { $unit }/s)
download-utils-status-infinite-rate = { $timeLeft } — { $transfer } (Très rapide)
download-utils-status-no-rate = { $timeLeft } — { $transfer }

download-utils-bytes = octets
download-utils-kilobyte = Ko
download-utils-megabyte = Mo
download-utils-gigabyte = Go

download-utils-transfer-same-units = { $progress } sur { $total } { $totalUnits }
download-utils-transfer-diff-units = { $progress } { $progressUnits } sur { $total } { $totalUnits }
download-utils-transfer-no-total = { $progress } { $progressUnits }

download-utils-time-pair = { $time } { $unit }
download-utils-time-left-single = Temps restant : { $time }
download-utils-time-left-double = Temps restant : { $time1 } { $time2 }
download-utils-time-few-seconds = Quelques secondes restantes
download-utils-time-unknown = Temps restant indéterminé

download-utils-done-scheme = Ressource { $scheme }
download-utils-done-file-scheme = fichier local

download-utils-yesterday = Hier
