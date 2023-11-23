

compose-send-format-menu =
    .label = Sending Format
    .accesskey = F

compose-send-auto-menu-item =
    .label = Automatic
    .accesskey = A

compose-send-both-menu-item =
    .label = Both HTML and Plain Text
    .accesskey = B

compose-send-html-menu-item =
    .label = Only HTML
    .accesskey = H

compose-send-plain-menu-item =
    .label = Only Plain Text
    .accesskey = P


remove-address-row-button =
    .title = Remove the { $type } field

address-input-type-aria-label = { $count ->
    [0]     { $type }
    [one]   { $type } with one address, use left arrow key to focus on it.
    *[other] { $type } with { $count } addresses, use left arrow key to focus on them.
}

pill-aria-label = { $count ->
    [one]   { $email }: press Enter to edit, Delete to remove.
    *[other] { $email }, 1 of { $count }: press Enter to edit, Delete to remove.
}

pill-tooltip-invalid-address = { $email } is not a valid email address

pill-tooltip-not-in-address-book = { $email } is not in your address book

pill-action-edit =
    .label = Edit Address
    .accesskey = E

pill-action-select-all-sibling-pills =
    .label = Select All Addresses in { $type }
    .accesskey = A

pill-action-select-all-pills =
    .label = Select All Addresses
    .accesskey = S

pill-action-move-to =
    .label = Move to To
    .accesskey = T

pill-action-move-cc =
    .label = Move to Cc
    .accesskey = C

pill-action-move-bcc =
    .label = Move to Bcc
    .accesskey = B

pill-action-expand-list =
    .label = Expand List
    .accesskey = x


ctrl-cmd-shift-pretty-prefix = {
  PLATFORM() ->
    [macos] ⇧ ⌘{" "}
   *[other] Ctrl+Shift+
}

trigger-attachment-picker-key = A
toggle-attachment-pane-key = M

menuitem-toggle-attachment-pane =
    .label = Attachment Pane
    .accesskey = m
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key }

toolbar-button-add-attachment =
    .label = Attach
    .tooltiptext = Add an Attachment ({ ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key })

add-attachment-notification-reminder2 =
    .label = Add Attachment…
    .accesskey = A
    .tooltiptext = { toolbar-button-add-attachment.tooltiptext }

menuitem-attach-files =
    .label = File(s)…
    .accesskey = F
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key }

context-menuitem-attach-files =
    .label = Attach File(s)…
    .accesskey = F
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ trigger-attachment-picker-key }

context-menuitem-attach-vcard =
    .label = My vCard
    .accesskey = C

context-menuitem-attach-openpgp-key =
    .label = My OpenPGP Public Key
    .accesskey = K

attachment-bucket-count-value = { $count ->
    [1]      { $count } Attachment
    *[other] { $count } Attachments
}

attachment-area-show =
    .title = Show the attachment pane ({ ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key })

attachment-area-hide =
    .title = Hide the attachment pane ({ ctrl-cmd-shift-pretty-prefix }{ toggle-attachment-pane-key })


drop-file-label-attachment = { $count ->
    [one]   Add as attachment
   *[other] Add as attachments
}

drop-file-label-inline = { $count ->
    [one]   Insert inline
   *[other] Insert inline
}


move-attachment-first-panel-button =
    .label = Move First
move-attachment-left-panel-button =
    .label = Move Left
move-attachment-right-panel-button =
    .label = Move Right
move-attachment-last-panel-button =
    .label = Move Last

button-return-receipt =
    .label = Receipt
    .tooltiptext = Request a return receipt for this message


encryption-menu =
  .label = Security
  .accesskey = c

encryption-toggle =
  .label = Encrypt
  .tooltiptext = Use end-to-end encryption for this message

encryption-options-openpgp =
  .label = OpenPGP
  .tooltiptext = View or change OpenPGP encryption settings

encryption-options-smime =
  .label = S/MIME
  .tooltiptext = View or change S/MIME encryption settings

signing-toggle =
  .label = Sign
  .tooltiptext = Use digital signing for this message

menu-openpgp =
    .label = OpenPGP
    .accesskey = O

menu-smime =
    .label = S/MIME
    .accesskey = S

menu-encrypt =
    .label = Encrypt
    .accesskey = E

menu-encrypt-subject =
    .label = Encrypt Subject
    .accesskey = B

menu-sign =
    .label = Digitally Sign
    .accesskey = i

menu-manage-keys =
    .label = Key Assistant
    .accesskey = A

menu-view-certificates =
    .label = View Certificates Of Recipients
    .accesskey = V

menu-open-key-manager =
    .label = Key Manager
    .accesskey = M

openpgp-key-issue-notification-from =
    You are not set up to send end-to-end encrypted messages from { $addr }.

openpgp-key-issue-notification-single = End-to-end encryption requires resolving key issues for { $addr }.

openpgp-key-issue-notification-multi =
    { $count ->
       *[other] End-to-end encryption requires resolving key issues for { $count } recipients.
    }

smime-cert-issue-notification-single = End-to-end encryption requires resolving certificate issues for { $addr }.

smime-cert-issue-notification-multi =
    { $count ->
       *[other] End-to-end encryption requires resolving certificate issues for { $count } recipients.
    }

key-notification-disable-encryption =
    .label = Do Not Encrypt
    .accesskey = D
    .tooltiptext = Disable end-to-end encryption

key-notification-resolve =
    .label = Resolve…
    .accesskey = R
    .tooltiptext = Open the OpenPGP Key Assistant

can-encrypt-smime-notification =
    S/MIME end-to-end encryption is possible.

can-encrypt-openpgp-notification =
    OpenPGP end-to-end encryption is possible.

can-e2e-encrypt-button =
    .label = Encrypt
    .accesskey = E


to-address-row-label =
    .value = To

show-to-row-main-menuitem =
    .label = To Field
    .accesskey = T
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }

show-to-row-extra-menuitem =
    .label = To
    .accesskey = T

show-to-row-button = To
    .title = Show To Field ({ ctrl-cmd-shift-pretty-prefix }{ $key })


cc-address-row-label =
    .value = Cc

show-cc-row-main-menuitem =
    .label = Cc Field
    .accesskey = C
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }

show-cc-row-extra-menuitem =
    .label = Cc
    .accesskey = C

show-cc-row-button = Cc
    .title = Show Cc Field ({ ctrl-cmd-shift-pretty-prefix }{ $key })


bcc-address-row-label =
    .value = Bcc

show-bcc-row-main-menuitem =
    .label = Bcc Field
    .accesskey = B
    .acceltext = { ctrl-cmd-shift-pretty-prefix }{ $key }

show-bcc-row-extra-menuitem =
    .label = Bcc
    .accesskey = B

show-bcc-row-button = Bcc
    .title = Show Bcc Field ({ ctrl-cmd-shift-pretty-prefix }{ $key })

extra-address-rows-menu-button =
    .title = Other addressing fields to show

public-recipients-notice-single =
    Your message has a public recipient. You can avoid disclosing the recipient by using Bcc instead.

public-recipients-notice-multi = { $count ->
  *[other] The { $count } recipients in To and Cc will see each other’s address. You can avoid disclosing recipients by using Bcc instead.
}

many-public-recipients-bcc =
  .label = Use Bcc Instead
  .accesskey = U

many-public-recipients-ignore =
  .label = Keep Recipients Public
  .accesskey  = K

many-public-recipients-prompt-title = Too Many Public Recipients

many-public-recipients-prompt-msg = { $count ->
  [one] Your message has a public recipient. This may be a privacy concern. You can avoid this by moving the recipient from To/Cc to Bcc instead.
  *[other] Your message has { $count } public recipients, who will be able to see each other’s addresses. This may be a privacy concern. You can avoid disclosing recipients by moving recipients from To/Cc to Bcc instead.
}

many-public-recipients-prompt-cancel = Cancel Sending
many-public-recipients-prompt-send = Send Anyway


compose-missing-identity-warning = A unique identity matching the From address was not found. The message will be sent using the current From field and settings from identity { $identity }.

encrypted-bcc-warning = When sending an encrypted message, recipients in Bcc are not fully hidden. All recipients may be able to identify them.

encrypted-bcc-ignore-button = Understood

auto-disable-e2ee-warning = End-to-end encryption for this message was automatically disabled.



compose-tool-button-remove-text-styling =
  .tooltiptext = Remove Text Styling


cloud-file-unknown-account-tooltip = Uploaded to an unknown Filelink account.


cloud-file-placeholder-title = { $filename } - Filelink Attachment

cloud-file-placeholder-intro = The file { $filename } was attached as a Filelink. It can be downloaded from the link below.


cloud-file-count-header = { $count ->
  [one] I’ve linked { $count } file to this email:
  *[other] I’ve linked { $count } files to this email:
}

cloud-file-service-provider-footer-single = Learn more about { $link }.

cloud-file-service-provider-footer-multiple = Learn more about { $firstLinks } and { $lastLink }.

cloud-file-tooltip-password-protected-link = Password protected link

cloud-file-template-service-name = Filelink Service:
cloud-file-template-size = Size:
cloud-file-template-link = Link:
cloud-file-template-password-protected-link = Password Protected Link:
cloud-file-template-expiry-date = Expiry Date:
cloud-file-template-download-limit = Download Limit:


cloud-file-connection-error-title = Connection Error
cloud-file-connection-error = { -brand-short-name } is offline. Could not connect to { $provider }.

cloud-file-upload-error-with-custom-message-title = Uploading { $filename } to { $provider } Failed

cloud-file-rename-error-title = Rename Error

cloud-file-rename-error = There was a problem renaming { $filename } on { $provider }.

cloud-file-rename-error-with-custom-message-title = Renaming { $filename } on { $provider } Failed

cloud-file-rename-not-supported = { $provider } does not support renaming already uploaded files.

cloud-file-attachment-error-title = Filelink Attachment Error

cloud-file-attachment-error = Failed to update the Filelink attachment { $filename }, because its local file has been moved or deleted.

cloud-file-account-error-title = Filelink Account Error

cloud-file-account-error = Failed to update the Filelink attachment { $filename }, because its Filelink account has been deleted.


link-preview-title = Link Preview
link-preview-description = { -brand-short-name } can add an embedded preview when pasting links.
link-preview-autoadd = Automatically add link previews when possible
link-preview-replace-now = Add a Link Preview for this link?
link-preview-yes-replace = Yes


spell-add-dictionaries =
    .label = Add Dictionaries…
    .accesskey = A
