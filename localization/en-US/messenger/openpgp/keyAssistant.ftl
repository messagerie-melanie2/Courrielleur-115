
openpgp-key-assistant-title = OpenPGP Key Assistant

openpgp-key-assistant-rogue-warning = Avoid accepting a counterfeit key. To ensure you have obtained the right key you should verify it. <a data-l10n-name="openpgp-link">Learn more…</a>


openpgp-key-assistant-recipients-issue-header = Cannot Encrypt

openpgp-key-assistant-recipients-issue-description =
    { $count ->
        [one] To encrypt, you must obtain and accept a usable key for one recipient. <a data-l10n-name="openpgp-link">Learn more…</a>
        *[other] To encrypt, you must obtain and accept usable keys for { $count } recipients. <a data-l10n-name="openpgp-link">Learn more…</a>
    }

openpgp-key-assistant-info-alias = { -brand-short-name } normally requires that the recipient’s public key contains a user ID with a matching email address. This can be overridden by using OpenPGP recipient alias rules. <a data-l10n-name="openpgp-link">Learn more…</a>

openpgp-key-assistant-recipients-description =
    { $count ->
        [one] You already have a usable and accepted key for one recipient.
        *[other] You already have usable and accepted keys for { $count } recipients.
    }

openpgp-key-assistant-recipients-description-no-issues = This message can be encrypted. You have usable and accepted keys for all recipients.


openpgp-key-assistant-resolve-title =
    { $numKeys ->
        [one] { -brand-short-name } found the following key for { $recipient }.
        *[other] { -brand-short-name } found the following keys for { $recipient }.
    }

openpgp-key-assistant-valid-description = Select the key that you want to accept

openpgp-key-assistant-invalid-title =
    { $numKeys ->
        [one] The following key cannot be used, unless you obtain an update.
        *[other] The following keys cannot be used, unless you obtain an update.
    }

openpgp-key-assistant-no-key-available = No key available.

openpgp-key-assistant-multiple-keys = Multiple keys are available.

openpgp-key-assistant-key-unaccepted =
    { $count ->
        [one] A key is available, but it hasn’t been accepted yet.
        *[other] Multiple keys are available, but none of them have been accepted yet.
    }

openpgp-key-assistant-key-accepted-expired = An accepted key has expired on { $date }.

openpgp-key-assistant-keys-accepted-expired = Multiple accepted keys have expired.

openpgp-key-assistant-this-key-accepted-expired = This key was previously accepted but expired on { $date }.

openpgp-key-assistant-key-unaccepted-expired-one =
    The key expired on { $date }.
openpgp-key-assistant-key-unaccepted-expired-many =
    Multiple keys have expired.

openpgp-key-assistant-key-fingerprint = Fingerprint

openpgp-key-assistant-key-source =
  { $count ->
      [one] Source
      *[other] Sources
  }

openpgp-key-assistant-key-collected-attachment = email attachment
openpgp-key-assistant-key-collected-autocrypt = Autocrypt header
openpgp-key-assistant-key-collected-keyserver = keyserver
openpgp-key-assistant-key-collected-wkd = Web Key Directory
openpgp-key-assistant-key-collected-gnupg = GnuPG keyring

openpgp-key-assistant-keys-has-collected =
  { $count ->
      [one] A key was found, but it hasn’t been accepted yet.
      *[other] Multiple keys were found, but none of them have been accepted yet.
  }

openpgp-key-assistant-key-rejected = This key has been previously rejected.
openpgp-key-assistant-key-accepted-other = This key has been previously accepted for a different email address.

openpgp-key-assistant-resolve-discover-info =
  Discover additional or updated keys for { $recipient } online, or import them from a file.


openpgp-key-assistant-discover-title = Online discovery in progress.

openpgp-key-assistant-discover-keys = Discovering keys for { $recipient }…

openpgp-key-assistant-expired-key-update =
    An update was found for one of the previously accepted keys for { $recipient }.
    It can now be used as it is no longer expired.


openpgp-key-assistant-discover-online-button = Discover Public Keys Online…

openpgp-key-assistant-import-keys-button = Import Public Keys From File…

openpgp-key-assistant-issue-resolve-button = Resolve…

openpgp-key-assistant-view-key-button = View Key…

openpgp-key-assistant-recipients-show-button = Show

openpgp-key-assistant-recipients-hide-button = Hide

openpgp-key-assistant-cancel-button = Cancel

openpgp-key-assistant-back-button = Back

openpgp-key-assistant-accept-button = Accept

openpgp-key-assistant-close-button = Close

openpgp-key-assistant-disable-button = Disable Encryption

openpgp-key-assistant-confirm-button = Send Encrypted

openpgp-key-assistant-key-created = created on { $date }
