# Analog Way Eikos EKS500

This module controls the original Eikos EKS500 over its ASCII third-party protocol.

## Configuration

- Enter the Eikos IP address and port. The factory protocol port is `10500`.
- TCP is recommended because it provides reliable status feedback. UDP is retained for installations configured for UDP in the Eikos LAN menu.
- Polling keeps button feedbacks and variables synchronized when changes are made from the front panel or another controller.

## Features

- Take and T-bar control
- Source selection for current, next, previous, and all eight memory presets
- Frame, logo, live-background, PIP, audio, and matrix-layer selection
- Recall and store preset memories with full/output-specific copy scope
- Input freeze, auto-set, image adjustment, aspect ratio, and keying
- Layer position, size, crop, alpha, border, smooth move, and opening/closing transitions
- Mixer/matrix/quadravision mode and quadravision layouts
- Output black, test pattern, format, rate, and background color
- Audio routing, mute, volume, balance, delay, and SDI channel selection
- Front-panel lock/brightness, T-bar enable, auto-take, auto-stepback, and standby/wake
- Feedbacks and variables for sources, signal state, freeze, output black, audio mute, operating mode, TAKE availability, and stored frame/logo validity
- Raw custom command and documented-parameter actions for advanced programming

## Protocol notes

Commands are case-sensitive and do not need a terminator. A write consists of optional comma-separated indexes, a value, then its command code. A read omits the value. For example, `1,2,4IN` selects Input 4 on the next-preset background layer, while `1,2,IN` reads it.

The **Custom command** action is intentionally unrestricted. Use it carefully: the EKS500 protocol also contains factory-reset, firmware-update, image-delete, and network-configuration commands.
