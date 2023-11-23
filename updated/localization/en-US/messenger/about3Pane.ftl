

quick-filter-button =
  .title = Toggle the Quick Filter Bar
quick-filter-button-label = Quick Filter

thread-pane-header-display-button =
  .title = Message list display options

thread-pane-folder-message-count =
  { $count ->
    [one] { $count } Message
    *[other] { $count } Messages
  }

thread-pane-folder-selected-count =
  { $count ->
    *[other] { $count } Selected
  }

thread-pane-header-context-table-view =
  .label = Table View

thread-pane-header-context-cards-view =
  .label = Cards View

thread-pane-header-context-hide =
  .label = Hide Message List Header


quick-filter-bar-sticky =
    .title = Keep filters applied when switching folders

quick-filter-bar-dropdown =
    .title = Quick filter menu

quick-filter-bar-dropdown-unread =
    .label = Unread

quick-filter-bar-dropdown-starred =
    .label = Starred

quick-filter-bar-dropdown-inaddrbook =
    .label = Contact

quick-filter-bar-dropdown-tags =
    .label = Tags

quick-filter-bar-dropdown-attachment =
    .label = Attachment

quick-filter-bar-unread =
    .title = Show only unread messages
quick-filter-bar-unread-label = Unread

quick-filter-bar-starred =
    .title = Show only starred messages
quick-filter-bar-starred-label = Starred

quick-filter-bar-inaddrbook =
    .title = Show only messages from people in your address book
quick-filter-bar-inaddrbook-label = Contact

quick-filter-bar-tags =
    .title = Show only messages with tags on them
quick-filter-bar-tags-label = Tags

quick-filter-bar-attachment =
    .title = Show only messages with attachments
quick-filter-bar-attachment-label = Attachment

quick-filter-bar-no-results = No results

quick-filter-bar-results =
    { $count ->
         [one] { $count } message
        *[other] { $count } messages
    }

quick-filter-bar-textbox-shortcut =
    { PLATFORM() ->
        [macos] ⇧ ⌘ K
       *[other] Ctrl+Shift+K
    }

quick-filter-bar-textbox =
    .placeholder = Filter these messages <{ quick-filter-bar-textbox-shortcut }>

quick-filter-bar-boolean-mode =
    .title = Tag filtering mode
quick-filter-bar-boolean-mode-any =
    .label = Any of
    .title = At least one of the selected tag criteria should match
quick-filter-bar-boolean-mode-all =
    .label = All of
    .title = All of the selected tag criteria must match

quick-filter-bar-text-filter-explanation = Filter messages by:
quick-filter-bar-text-filter-sender = Sender
quick-filter-bar-text-filter-recipients = Recipients
quick-filter-bar-text-filter-subject = Subject
quick-filter-bar-text-filter-body = Body

quick-filter-bar-gloda-upsell-line1 = Continue this search across all folders
quick-filter-bar-gloda-upsell-line2 = Press ‘Enter’ again to continue your search for: { $text }


folder-pane-get-messages-button =
  .title = Get Messages

folder-pane-get-all-messages-menuitem =
  .label = Get All New Messages
  .accesskey = G

folder-pane-write-message-button = New Message
  .title = Compose a new message

folder-pane-more-menu-button =
  .title = Folder pane options

folder-pane-header-folder-modes =
  .label = Folder Modes

folder-pane-header-context-toggle-get-messages =
  .label = Show “Get Messages”

folder-pane-header-context-toggle-new-message =
  .label = Show “New Message”

folder-pane-header-context-hide =
  .label = Hide Folder Pane Header

folder-pane-show-total-toggle =
  .label = Show Total Message Count

folder-pane-header-toggle-folder-size =
  .label = Show Folder Size

folder-pane-header-hide-local-folders =
  .label = Hide Local Folders

folder-pane-mode-context-button =
  .title = Folder mode options

folder-pane-mode-context-toggle-compact-mode =
  .label = Compact View
  .accesskey = C

folder-pane-mode-move-up =
  .label = Move Up

folder-pane-mode-move-down =
  .label = Move Down

folder-pane-unread-aria-label =
  { $count ->
    [one] 1 unread message
    *[other] { $count } unread messages
  }

folder-pane-total-aria-label =
  { $count ->
    [one] 1 total message
    *[other] { $count } total messages
  }


threadpane-column-header-select =
  .title = Toggle select all messages
threadpane-column-header-select-all =
  .title = Select all messages
threadpane-column-header-deselect-all =
  .title = Deselect all messages
threadpane-column-label-select =
  .label = Select Messages

threadpane-column-header-thread =
  .title = Toggle message threads
threadpane-column-label-thread =
  .label = Thread

threadpane-column-header-flagged =
  .title = Sort by star
threadpane-column-label-flagged =
  .label = Starred

threadpane-flagged-cell-label = Starred

threadpane-column-header-attachments =
  .title = Sort by attachments
threadpane-column-label-attachments =
  .label = Attachments

threadpane-attachments-cell-label = Attachments

threadpane-column-header-spam =
  .title = Sort by spam status
threadpane-column-label-spam =
  .label = Spam

threadpane-spam-cell-label = Spam

threadpane-column-header-unread-button =
  .title = Sort by read status
threadpane-column-label-unread-button =
  .label = Read status

threadpane-read-cell-label = Read
threadpane-unread-cell-label = Unread

threadpane-column-header-sender = From
  .title = Sort by from
threadpane-column-label-sender =
  .label = From

threadpane-column-header-recipient = Recipient
  .title = Sort by recipient
threadpane-column-label-recipient =
  .label = Recipient

threadpane-column-header-correspondents = Correspondents
  .title = Sort by correspondents
threadpane-column-label-correspondents =
  .label = Correspondents

threadpane-column-header-subject = Subject
  .title = Sort by subject
threadpane-column-label-subject =
  .label = Subject

threadpane-column-header-date = Date
  .title = Sort by date
threadpane-column-label-date =
  .label = Date

threadpane-column-header-received = Received
  .title = Sort by date received
threadpane-column-label-received =
  .label = Received

threadpane-column-header-status = Status
  .title = Sort by status
threadpane-column-label-status =
  .label = Status

threadpane-column-header-size = Size
  .title = Sort by size
threadpane-column-label-size =
  .label = Size

threadpane-column-header-tags = Tags
  .title = Sort by tags
threadpane-column-label-tags =
  .label = Tags

threadpane-column-header-account = Account
  .title = Sort by account
threadpane-column-label-account =
  .label = Account

threadpane-column-header-priority = Priority
  .title = Sort by priority
threadpane-column-label-priority =
  .label = Priority

threadpane-column-header-unread = Unread
  .title = Number of unread messages in thread
threadpane-column-label-unread =
  .label = Unread

threadpane-column-header-total = Total
  .title = Total number of messages in thread
threadpane-column-label-total =
  .label = Total

threadpane-column-header-location = Location
  .title = Sort by location
threadpane-column-label-location =
  .label = Location

threadpane-column-header-id = Order Received
  .title = Sort by order received
threadpane-column-label-id =
  .label = Order Received

threadpane-column-header-delete =
  .title = Delete a message
threadpane-column-label-delete =
  .label = Delete


threadpane-message-new =
  .alt = New message indicator
  .title = New message

threadpane-message-replied =
  .alt = Replied indicator
  .title = Message replied

threadpane-message-redirected =
  .alt = Redirected indicator
  .title = Message redirected

threadpane-message-forwarded =
  .alt = Forwarded indicator
  .title = Message forwarded

threadpane-message-replied-forwarded =
  .alt = Replied and forwarded indicator
  .title = Message replied and forwarded

threadpane-message-replied-redirected =
  .alt = Replied and redirected indicator
  .title = Message replied and redirected

threadpane-message-forwarded-redirected =
  .alt = Forwarded and redirected indicator
  .title = Message forwarded and redirected

threadpane-message-replied-forwarded-redirected =
  .alt = Replied, forwarded, and redirected indicator
  .title = Message replied, forwarded, and redirected

apply-columns-to-menu =
  .label = Apply columns to…

apply-current-view-to-menu =
  .label = Apply current view to…

apply-current-view-to-folder =
  .label = Folder…

apply-current-view-to-folder-children =
  .label = Folder and its children…


apply-changes-to-folder-title = Apply Changes?

apply-current-columns-to-folder-message = Apply the current folder’s columns to { $name }?

apply-current-columns-to-folder-with-children-message = Apply the current folder’s columns to { $name } and its children?

apply-current-view-to-folder-message = Apply the current folder’s view to { $name }?
apply-current-view-to-folder-with-children-message = Apply the current folder’s view to { $name } and its children?
