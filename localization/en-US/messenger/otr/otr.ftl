
msgevent-encryption-required-part1 = You attempted to send an unencrypted message to { $name }. As a policy, unencrypted messages are not allowed.

msgevent-encryption-required-part2 = Attempting to start a private conversation. Your message will be resent when the private conversation starts.
msgevent-encryption-error = An error occurred when encrypting your message. The message was not sent.

msgevent-connection-ended = { $name } has already closed their encrypted connection to you. To avoid that you accidentally send a message without encryption, your message was not sent. Please end your encrypted conversation, or restart it.

msgevent-setup-error = An error occurred while setting up a private conversation with { $name }.

msgevent-msg-reflected = You are receiving your own OTR messages. You are either trying to talk to yourself, or someone is reflecting your messages back at you.

msgevent-msg-resent = The last message to { $name } was resent.

msgevent-rcvdmsg-not-private = The encrypted message received from { $name } is unreadable, as you are not currently communicating privately.

msgevent-rcvdmsg-unreadable = You received an unreadable encrypted message from { $name }.

msgevent-rcvdmsg-malformed = You received a malformed data message from { $name }.

msgevent-log-heartbeat-rcvd = Heartbeat received from { $name }.

msgevent-log-heartbeat-sent = Heartbeat sent to { $name }.

msgevent-rcvdmsg-general-err = An unexpected error occurred while trying to protect your conversation using OTR.

msgevent-rcvdmsg-unencrypted = The following message received from { $name } was not encrypted: { $msg }

msgevent-rcvdmsg-unrecognized = You received an unrecognized OTR message from { $name }.

msgevent-rcvdmsg-for-other-instance = { $name } has sent a message intended for a different session. If you are logged in multiple times, another session may have received the message.

context-gone-secure-private = Private conversation with { $name } started.

context-gone-secure-unverified = Encrypted, but unverified conversation with { $name } started.

context-still-secure = Successfully refreshed the encrypted conversation with { $name }.

error-enc = An error occurred while encrypting the message.

error-not-priv = You sent encrypted data to { $name }, who wasn’t expecting it.

error-unreadable = You transmitted an unreadable encrypted message.
error-malformed = You transmitted a malformed data message.

resent = [resent]

tlv-disconnected = { $name } has ended their encrypted conversation with you; you should do the same.

query-msg = { $name } has requested an Off-the-Record (OTR) encrypted conversation. However, you do not have a plugin to support that. See https://en.wikipedia.org/wiki/Off-the-Record_Messaging for more information.
