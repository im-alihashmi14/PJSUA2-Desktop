# Node.js SIP Binding

This folder will contain the Node.js native addon that wraps the C++ SIP core from `../../sip-core-cpp/` for use in Electron or Node.js apps.

## Purpose
- Expose SIP functionality to JavaScript via Node.js native addon (N-API/node-addon-api).

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- node-gyp (for building native addons)
- C++ build tools (Xcode, MSVC, or build-essential)

## Build Instructions

1. Install dependencies:
   ```sh
   cd bindings/node
   npm install
   # or yarn install
   ```
2. Build the native addon:
   ```sh
   npm run build
   # or node-gyp configure build
   ```

## Usage
- After building, require the addon in your Electron app:
  ```js
  const sipAddon = require('../../bindings/node/build/Release/sipaddon.node');
  ```
- See the Electron app README for integration details. 