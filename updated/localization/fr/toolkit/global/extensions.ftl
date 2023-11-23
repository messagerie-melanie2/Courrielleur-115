


webext-perms-header = Ajouter { $extension } ?
webext-perms-header-with-perms = Ajouter { $extension } ? Cette extension aura l’autorisation de :
webext-perms-header-unsigned = Ajouter { $extension } ? Cette extension n’a pas été vérifiée. Les extensions malveillantes peuvent voler vos informations personnelles ou compromettre votre ordinateur. Ne l’ajoutez que si vous faites confiance à la source.
webext-perms-header-unsigned-with-perms = Ajouter { $extension } ? Cette extension n’a pas été vérifiée. Les extensions malveillantes peuvent voler vos informations personnelles ou compromettre votre ordinateur. Ne l’ajoutez que si vous faites confiance à la source. Cette extension aura l’autorisation de :
webext-perms-sideload-header = { $extension } a été ajouté
webext-perms-optional-perms-header = { $extension } demande des permissions supplémentaires.


webext-perms-add =
    .label = Ajouter
    .accesskey = A
webext-perms-cancel =
    .label = Annuler
    .accesskey = n

webext-perms-sideload-text = Un programme de votre ordinateur a installé un module complémentaire qui pourrait affecter votre navigateur. Veuillez prendre connaissance des permissions que demande ce module et décider de l’activer ou d’annuler (afin de le laisser désactivé).
webext-perms-sideload-text-no-perms = Un programme de votre ordinateur a installé un module complémentaire qui pourrait affecter votre navigateur. Veuillez décider de l’activer ou d’annuler (afin de le laisser désactivé).
webext-perms-sideload-enable =
    .label = Activer
    .accesskey = A
webext-perms-sideload-cancel =
    .label = Annuler
    .accesskey = n

webext-perms-update-text = { $extension } a été mis à jour. Vous devez approuver les nouvelles autorisations avant que la version mise à jour ne soit installée. Sélectionner « Annuler » conservera la version actuelle de l’extension. Cette extension aura l’autorisation de :
webext-perms-update-accept =
    .label = Mettre à jour
    .accesskey = M

webext-perms-optional-perms-list-intro = L’extension souhaite :
webext-perms-optional-perms-allow =
    .label = Autoriser
    .accesskey = A
webext-perms-optional-perms-deny =
    .label = Refuser
    .accesskey = R

webext-perms-host-description-all-urls = Accéder à vos données pour tous les sites web

webext-perms-host-description-wildcard = Accéder à vos données pour les sites du domaine { $domain }

webext-perms-host-description-too-many-wildcards =
    { $domainCount ->
        [one] Accéder à vos données pour { $domainCount } autre domaine
       *[other] Accéder à vos données pour { $domainCount } autres domaines
    }
webext-perms-host-description-one-site = Accéder à vos données pour { $domain }

webext-perms-host-description-too-many-sites =
    { $domainCount ->
        [one] Accéder à vos données sur { $domainCount } autre site
       *[other] Accéder à vos données sur { $domainCount } autres sites
    }


webext-site-perms-header-with-gated-perms-midi = Ce module complémentaire donne accès aux périphériques MIDI à { $hostname }.
webext-site-perms-header-with-gated-perms-midi-sysex = Ce module complémentaire donne accès aux périphériques MIDI (avec la prise en charge de SysEx) à { $hostname }.


webext-site-perms-description-gated-perms-midi =
    Ces périphériques sont habituellement branchés à votre ordinateur, comme par exemple un synthétiseur audio, mais ils peuvent aussi être intégrés à votre ordinateur.
    
    Les sites web ne sont normalement pas autorisés à accéder aux périphériques MIDI. Une utilisation incorrecte pourrait provoquer des dommages ou compromettre la sécurité.


webext-site-perms-header-with-perms = Ajouter { $extension } ? Cette extension donne les capacités suivantes à { $hostname } :
webext-site-perms-header-unsigned-with-perms = Ajouter { $extension } ? Cette extension n’a pas été vérifiée. Une extension malveillante peut voler vos informations personnelles ou compromettre votre ordinateur. Ne l’ajoutez que si vous faites confiance à sa source. Cette extension donne les capacités suivantes à { $hostname } :


webext-site-perms-midi = Accéder aux appareils MIDI
webext-site-perms-midi-sysex = Accéder aux appareils MIDI prenant en charge SysEx
