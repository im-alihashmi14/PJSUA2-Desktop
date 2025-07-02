# SIP Multi-Platform Core & Bindings

This project provides a cross-platform, reusable C++ SIP core (using PJSUA2) with bindings for Node.js (Electron) and React Native (Android/iOS), plus demo apps for each platform.

## Project Structure

- **/sip-core-cpp/**: Pure C++ SIP core logic (no platform code)
- **/bindings/node/**: Node.js native addon (for Electron, etc.)
- **/bindings/react-native/jsi/**: JSI binding for React Native Android/iOS
- **/apps/electron-app/**: Electron app (React/JS/TS UI)
- **/apps/react-native-app/**: React Native app (Android/iOS UI)
- **/platform/**: Platform-specific CMake configs
- **/scripts/**: Build scripts

## Building & Usage

- See platform-specific guides:
  - [macOS Guide](platform/README.macos.md)
  - [Windows Guide](platform/README.Windows.md)
- See binding-specific guides in their respective folders.
- See demo app READMEs for usage instructions.

## Quick Start

1. Build the SIP core in `/sip-core-cpp/` (see CMake instructions in the folder).
2. Build the desired binding (Node.js or React Native).
3. Run the demo app for your platform.

## Contributing

- Keep the C++ SIP core platform-agnostic.
- Add new bindings in `/bindings/`.
- Add new demo apps in `/apps/`.

## More Info

- For platform-specific build issues, see the guides in `/platform/`.
- For binding usage, see `/bindings/node/README.md` or `/bindings/react-native/jsi/README.md`.
- For app usage, see `/apps/electron-app/README.md` or `/apps/react-native-app/README.md`. 