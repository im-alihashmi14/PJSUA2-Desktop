# Electron App Demo

This folder will contain a demo Electron app (React/JS/TS UI) that uses the Node.js SIP binding from `../../bindings/node/`.

## Purpose
- Demonstrate SIP functionality in a desktop app using the reusable C++ SIP core via Node.js native addon.

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Electron (will be installed as a dev dependency)

## Setup & Run

1. Install dependencies:
   ```sh
   cd apps/electron-app
   npm install
   # or yarn install
   ```
2. Build the Node.js native addon in `../../bindings/node/` (see its README for instructions).
3. Start the Electron app:
   ```sh
   npm start
   # or yarn start
   ```

## Usage
- The Electron app will load a basic HTML UI and communicate with the SIP native addon via Node.js APIs.
- See the code and UI for demo usage and integration examples. 