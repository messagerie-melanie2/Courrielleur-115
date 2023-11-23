

shortcut-key = { $key }

meta-shortcut-key = {
  PLATFORM() ->
    [macos] ⌘ { $key }
   *[other] Meta+{ $key }
}

ctrl-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ { $key }
   *[other] Ctrl+{ $key }
}

shift-shortcut-key = {
  PLATFORM() ->
    [macos] ⇧ { $key }
   *[other] Shift+{ $key }
}

alt-shortcut-key = {
  PLATFORM() ->
    [macos] ⌥ { $key }
   *[other] Alt+{ $key }
}

meta-ctrl-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ ⌘ { $key }
   *[other] Meta+Ctrl+{ $key }
}

meta-alt-shortcut-key = {
  PLATFORM() ->
    [macos] ⌥ ⌘ { $key }
   *[other] Meta+Alt+{ $key }
}

ctrl-alt-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ ⌥ { $key }
   *[other] Ctrl+Alt+{ $key }
}

meta-ctrl-alt-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ ⌥ ⌘ { $key }
   *[other] Meta+Ctrl+Alt+{ $key }
}

meta-shift-shortcut-key = {
  PLATFORM() ->
    [macos] ⇧ ⌘ { $key }
   *[other] Meta+Shift+{ $key }
}

ctrl-shift-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ ⇧ { $key }
   *[other] Ctrl+Shift+{ $key }
}

meta-ctrl-shift-shortcut-key = {
  PLATFORM() ->
    [macos] ⌃ ⇧ ⌘ { $key }
   *[other] Meta+Ctrl+Shift+{ $key }
}

alt-shift-shortcut-key = {
  PLATFORM() ->
    [macos] ⌥ ⇧ { $key }
   *[other] Alt+Shift+{ $key }
}

meta-shift-alt-shortcut-key2 = {
  PLATFORM() ->
    [macos] ⌥ ⇧ ⌘ { $key }
   *[other] Meta+Alt+Shift+{ $key }
}

ctrl-shift-alt-shortcut-key2 = {
  PLATFORM() ->
    [macos] ⌃ ⌥ ⇧ { $key }
   *[other] Ctrl+Alt+Shift+{ $key }
}

meta-ctrl-shift-alt-shortcut-key2 = {
  PLATFORM() ->
    [macos] ⌃ ⌥ ⇧ ⌘ { $key }
   *[other] Meta+Ctrl+Alt+Shift+{ $key }
}


button-shortcut-string =
    .title = { $title } ({ $shortcut })

menuitem-shortcut-string =
    .label = { $label }
    .acceltext = { $shortcut }
