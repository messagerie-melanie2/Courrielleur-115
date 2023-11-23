

about-webrtc-document-title = WebRTC Internals

about-webrtc-save-page-dialog-title = save about:webrtc as


about-webrtc-aec-logging-msg-label = AEC Logging
about-webrtc-aec-logging-off-state-label = Start AEC Logging
about-webrtc-aec-logging-on-state-label = Stop AEC Logging
about-webrtc-aec-logging-on-state-msg = AEC logging active (speak with the caller for a few minutes and then stop the capture)

about-webrtc-auto-refresh-label = Auto Refresh


about-webrtc-peerconnection-id-label = PeerConnection ID:


about-webrtc-sdp-heading = SDP
about-webrtc-local-sdp-heading = Local SDP
about-webrtc-local-sdp-heading-offer = Local SDP (Offer)
about-webrtc-local-sdp-heading-answer = Local SDP (Answer)
about-webrtc-remote-sdp-heading = Remote SDP
about-webrtc-remote-sdp-heading-offer = Remote SDP (Offer)
about-webrtc-remote-sdp-heading-answer = Remote SDP (Answer)
about-webrtc-sdp-history-heading = SDP History
about-webrtc-sdp-parsing-errors-heading = SDP Parsing Errors


about-webrtc-rtp-stats-heading = RTP Stats


about-webrtc-ice-state = ICE State
about-webrtc-ice-stats-heading = ICE Stats
about-webrtc-ice-restart-count-label = ICE restarts:
about-webrtc-ice-rollback-count-label = ICE rollbacks:
about-webrtc-ice-pair-bytes-sent = Bytes sent:
about-webrtc-ice-pair-bytes-received = Bytes received:
about-webrtc-ice-component-id = Component ID


about-webrtc-type-local = Local
about-webrtc-type-remote = Remote


about-webrtc-nominated = Nominated

about-webrtc-selected = Selected

about-webrtc-save-page-label = Save Page
about-webrtc-debug-mode-msg-label = Debug Mode
about-webrtc-debug-mode-off-state-label = Start Debug Mode
about-webrtc-debug-mode-on-state-label = Stop Debug Mode
about-webrtc-stats-heading = Session Statistics
about-webrtc-stats-clear = Clear History
about-webrtc-log-heading = Connection Log
about-webrtc-log-clear = Clear Log
about-webrtc-log-show-msg = show log
    .title = click to expand this section
about-webrtc-log-hide-msg = hide log
    .title = click to collapse this section


about-webrtc-connection-open = [ { $browser-id } | { $id } ] { $url } { $now }
about-webrtc-connection-closed = [ { $browser-id } | { $id } ] { $url } (closed) { $now }


about-webrtc-local-candidate = Local Candidate
about-webrtc-remote-candidate = Remote Candidate
about-webrtc-raw-candidates-heading = All Raw Candidates
about-webrtc-raw-local-candidate = Raw Local Candidate
about-webrtc-raw-remote-candidate = Raw Remote Candidate
about-webrtc-raw-cand-show-msg = show raw candidates
    .title = click to expand this section
about-webrtc-raw-cand-hide-msg = hide raw candidates
    .title = click to collapse this section
about-webrtc-priority = Priority
about-webrtc-fold-show-msg = show details
    .title = click to expand this section
about-webrtc-fold-hide-msg = hide details
    .title = click to collapse this section
about-webrtc-dropped-frames-label = Dropped frames:
about-webrtc-discarded-packets-label = Discarded packets:
about-webrtc-decoder-label = Decoder
about-webrtc-encoder-label = Encoder
about-webrtc-show-tab-label = Show tab
about-webrtc-current-framerate-label = Framerate
about-webrtc-width-px = Width (px)
about-webrtc-height-px = Height (px)
about-webrtc-consecutive-frames = Consecutive Frames
about-webrtc-time-elapsed = Time Elapsed (s)
about-webrtc-estimated-framerate = Estimated Framerate
about-webrtc-rotation-degrees = Rotation (degrees)
about-webrtc-first-frame-timestamp = First Frame Reception Timestamp
about-webrtc-last-frame-timestamp = Last Frame Reception Timestamp


about-webrtc-local-receive-ssrc = Local Receiving SSRC
about-webrtc-remote-send-ssrc = Remote Sending SSRC


about-webrtc-pc-configuration-show-msg = Show Configuration
about-webrtc-pc-configuration-hide-msg = Hide Configuration


about-webrtc-configuration-element-provided = Provided

about-webrtc-configuration-element-not-provided = Not Provided

about-webrtc-custom-webrtc-configuration-heading = User Set WebRTC Preferences

about-webrtc-bandwidth-stats-heading = Estimated Bandwidth

about-webrtc-track-identifier = Track Identifier

about-webrtc-send-bandwidth-bytes-sec = Send Bandwidth (bytes/sec)

about-webrtc-receive-bandwidth-bytes-sec = Receive Bandwidth (bytes/sec)

about-webrtc-max-padding-bytes-sec = Maximum Padding (bytes/sec)

about-webrtc-pacer-delay-ms = Pacer Delay ms

about-webrtc-round-trip-time-ms = RTT ms

about-webrtc-frame-stats-heading = Video Frame Statistics - MediaStreamTrack ID: { $track-identifier }


about-webrtc-save-page-msg = page saved to: { $path }
about-webrtc-debug-mode-off-state-msg = trace log can be found at: { $path }
about-webrtc-debug-mode-on-state-msg = debug mode active, trace log at: { $path }
about-webrtc-aec-logging-off-state-msg = captured log files can be found in: { $path }


about-webrtc-frames =
  { $frames ->
      [one] { $frames } frame
     *[other] { $frames } frames
  }

about-webrtc-channels =
  { $channels ->
      [one] { $channels } channel
     *[other] { $channels } channels
  }

about-webrtc-received-label =
  { $packets ->
      [one] Received { $packets } packet
     *[other] Received { $packets } packets
  }

about-webrtc-lost-label =
  { $packets ->
      [one] Lost { $packets } packet
     *[other] Lost { $packets } packets
  }

about-webrtc-sent-label =
  { $packets ->
      [one] Sent { $packets } packet
     *[other] Sent { $packets } packets
  }

about-webrtc-jitter-label = Jitter { $jitter }

about-webrtc-trickle-caption-msg = Trickled candidates (arriving after answer) are highlighted in blue


about-webrtc-sdp-set-at-timestamp-local = Set Local SDP at timestamp { NUMBER($timestamp, useGrouping: "false") }

about-webrtc-sdp-set-at-timestamp-remote = Set Remote SDP at timestamp { NUMBER($timestamp, useGrouping: "false") }

about-webrtc-sdp-set-timestamp = Timestamp { NUMBER($timestamp, useGrouping: "false") } (+ { $relative-timestamp } ms)


about-webrtc-show-msg-sdp = Show SDP
about-webrtc-hide-msg-sdp = Hide SDP

