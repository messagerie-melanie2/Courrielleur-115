

message-header-show-security-info-key = S

message-security-button =
    .title = { PLATFORM() ->
        [macos] Show Message Security (⌃ ⌘ { message-header-show-security-info-key })
        *[other] Show Message Security (Ctrl+Alt+{ message-header-show-security-info-key })
    }

openpgp-view-signer-key =
    .label = View signer key
openpgp-view-your-encryption-key =
    .label = View your decryption key
openpgp-openpgp = OpenPGP

openpgp-no-sig = No Digital Signature
openpgp-no-sig-info = This message does not include the sender’s digital signature. The absence of a digital signature means that the message could have been sent by someone pretending to have this email address. It is also possible that the message has been altered while in transit over the network.
openpgp-uncertain-sig = Uncertain Digital Signature
openpgp-uncertain-sig-with-date = Uncertain Digital Signature - Signed on { $date }
openpgp-invalid-sig = Invalid Digital Signature
openpgp-invalid-sig-with-date = Invalid Digital Signature - Signed on { $date }
openpgp-good-sig = Good Digital Signature
openpgp-good-sig-with-date = Good Digital Signature - Signed on { $date }

openpgp-sig-uncertain-no-key = This message contains a digital signature, but it is uncertain if it is correct. To verify the signature, you need to obtain a copy of the sender’s public key.
openpgp-sig-uncertain-uid-mismatch = This message contains a digital signature, but a mismatch was detected. The message was sent from an email address that doesn’t match the signer’s public key.
openpgp-sig-uncertain-not-accepted = This message contains a digital signature, but you haven’t yet decided if the signer’s key is acceptable to you.
openpgp-sig-invalid-rejected = This message contains a digital signature, but you have previously decided to reject the signer key.
openpgp-sig-invalid-technical-problem = This message contains a digital signature, but a technical error was detected. Either the message has been corrupted, or the message has been modified by someone else.
openpgp-sig-valid-unverified = This message includes a valid digital signature from a key that you have already accepted. However, you have not yet verified that the key is really owned by the sender.
openpgp-sig-valid-verified = This message includes a valid digital signature from a verified key.
openpgp-sig-valid-own-key = This message includes a valid digital signature from your personal key.

openpgp-sig-key-id = Signer key ID: { $key }
openpgp-sig-key-id-with-subkey-id = Signer key ID: { $key } (Sub key ID: { $subkey })

openpgp-enc-key-id = Your decryption key ID: { $key }
openpgp-enc-key-with-subkey-id = Your decryption key ID: { $key } (Sub key ID: { $subkey })

openpgp-enc-none = Message Is Not Encrypted
openpgp-enc-none-label = This message was not encrypted before it was sent. Information sent over the Internet without encryption can be seen by other people while in transit.

openpgp-enc-invalid-label = Message Cannot Be Decrypted
openpgp-enc-invalid = This message was encrypted before it was sent to you, but it cannot be decrypted.

openpgp-enc-clueless = There are unknown problems with this encrypted message.

openpgp-enc-valid-label = Message Is Encrypted
openpgp-enc-valid = This message was encrypted before it was sent to you. Encryption ensures the message can only be read by the recipients it was intended for.

openpgp-unknown-key-id = Unknown key

openpgp-other-enc-additional-key-ids = In addition, the message was encrypted to the owners of the following keys:
openpgp-other-enc-all-key-ids = The message was encrypted to the owners of the following keys:

openpgp-message-header-encrypted-ok-icon =
    .alt = Decryption successful
openpgp-message-header-encrypted-notok-icon =
    .alt = Decryption failed

openpgp-message-header-signed-ok-icon =
    .alt = Good signature
openpgp-message-header-signed-mismatch-icon =
    .alt = Bad signature
openpgp-message-header-signed-unknown-icon =
    .alt = Unknown signature status
openpgp-message-header-signed-verified-icon =
    .alt = Verified signature
openpgp-message-header-signed-unverified-icon =
    .alt = Unverified signature
