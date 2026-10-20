## 2.0.1

- Added an upgrade script so buttons created with v1.0.2 (legacy input, frame, logo and user preset actions) keep valid dropdown and number values.
- A forced status refresh no longer runs alongside a scheduled poll.
- Current / Next source variables now label frame and logo layers correctly, and show "Unknown" until the device has reported a value.
- Changing the connection settings now clears the previous device's variables and feedbacks straight away.
- Repository tooling aligned with the module template (.gitattributes, .gitignore, .prettierignore, husky pre-commit hook, CI workflow).

## 2.0.0

- Rebuilt for the current Companion module API, Node 22 runtime, and TypeScript toolchain.
- Added TCP and UDP lifecycle handling with reconnect status and response parsing.
- Added live state polling, feedbacks, and variables.
- Added comprehensive switching, layer, input, output, audio, memory, system, and custom controls.
- Added modern preset groups with source tally, frames, logos, memories, takes, output, and audio controls.
- Preserved the original action IDs for existing Companion configurations.
- Fixed the broken legacy input/frame preset action references and incorrect mappings for presets 5–8.
