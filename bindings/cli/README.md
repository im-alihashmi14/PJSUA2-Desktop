# CLI Binding

This folder contains the CLI entry point for the SIP core, allowing you to run and test the SIP functionality from the command line.

## Purpose
- Provide a simple CLI interface to the reusable C++ SIP core in `../../sip-core-cpp/`.

## Build & Run Instructions

### 1. Build PJSIP (if not already built)
From the project root:
```sh
./scripts/build_pjsip.sh
```

### 2. Build the CLI
From the project root:
```sh
cmake -S . -B build
cmake --build build
```

### 3. Run the CLI
From the project root:
```sh
./build/bindings/cli/pjsip-cli
```

## Usage
- The CLI allows you to initialize, register, make calls, and manage SIP sessions interactively.
- Type `help` or see the usage instructions printed when you start the CLI.

See the main project README for more details.