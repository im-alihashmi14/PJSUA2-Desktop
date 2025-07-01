# PJSUA2 - PJSIP-based C++ CLI Application

A PJSIP-based C++ CLI application for SIP communication, with a reusable core for platforms like React Native. It runs on Windows, macOS, and Linux, with the CLI isolated from the core C++ logic.

## Project Structure

- **src/main.cpp**: CLI entry point. Parses command-line arguments and calls PJSIPManager APIs.
- **src/pjsip_manager.hpp/cpp**: Core PJSIP logic, reusable for CLI, React Native, etc.
- **src/common/error_handling.hpp**: Shared error handling utilities.
- **scripts/build_pjsip.sh**: Script to build PJSIP library (for Unix-like systems).
- **CMakeLists.txt**: Main CMake file, includes platform-specific configs, builds core as a static library.
- **platform/CMakeLists.macos.txt**: macOS-specific CMake settings.
- **platform/CMakeLists.windows.txt**: Windows-specific CMake settings.
- **platform/CMakeLists.linux.txt**: Linux-specific CMake settings.

## Cross-Platform Build Instructions

### 1. Build PJSIP (Native Library)
- **macOS/Linux:**
  ```sh
  ./scripts/build_pjsip.sh
  ```
- **Windows:**
  - Use the official PJSIP build instructions for Visual Studio or MinGW.
  - Make sure the built libraries and headers are placed in `pjsip_build/lib` and `pjsip_build/include`.

### 2. Build the CLI Application

#### **Universal CMake Build Script**
You can use the following script (save as `build_all.sh` for macOS/Linux, or run the commands manually on Windows):

```sh
# For macOS/Linux
mkdir -p build
cd build
cmake ..
cmake --build .
```

- **Windows:**
  - Open a "Developer Command Prompt for VS" or use CMake GUI.
  - Run:
    ```bat
    mkdir build
    cd build
    cmake ..
    cmake --build . --config Release
    ```

#### **Platform Notes**
- On **macOS**, required frameworks are linked automatically.
- On **Windows**, ensure you have Visual Studio or MinGW and all dependencies in your PATH.
- On **Linux**, install `build-essential`, `cmake`, and any required dev packages.

### 3. Run the CLI
- **macOS/Linux:**
  ```sh
  ./build/src/pjsip-cli
  ```
- **Windows:**
  ```bat
  build\src\Release\pjsip-cli.exe
  ```

## CLI Usage

- `pjsip-cli init`: Initialize PJSIP.
- `pjsip-cli register <uri> <username> <password>`: Register a SIP account.
- `pjsip-cli call <acc_id> <destination>`: Make a call.
- `pjsip-cli mute <call_id>`: Mute a call.
- `pjsip-cli unmute <call_id>`: Unmute a call.
- `pjsip-cli hold <call_id>`: Put a call on hold.
- `pjsip-cli unhold <call_id>`: Unhold a call.
- `pjsip-cli hangup <call_id>`: Hang up a call.
- `pjsip-cli hangup-all`: Hang up all calls.
- `pjsip-cli cleanup`: Destroy PJSIP.

## Example Usage with Provided SIP Credentials

### Antisip (Public SIP)
```bash
./src/pjsip-cli init
./src/pjsip-cli register sip:alihashmi14@sip.antisip.com alihashmi14 AdvC8ptqSwPbkuA
./src/pjsip-cli call 1 sip:test@sip.antisip.com
```

### Linphone
```bash
./src/pjsip-cli init
./src/pjsip-cli register sip:im.alihashmi14@sip.linphone.org im.alihashmi14 '*vGnvSD2TyG*Ruk'
./src/pjsip-cli call 1 sip:test@sip.linphone.org
```

## Dependencies

- PJSIP library (built via `scripts/build_pjsip.sh` or manually on Windows).
- C++17 compiler (GCC, Clang, or MSVC).
- CMake 3.15 or higher.

## Notes

- The core logic in `pjsip_manager.hpp/cpp` is platform-agnostic and reusable for React Native or other applications.
- The CLI (`main.cpp`) only consumes `PJSIPManager` APIs, ensuring no CLI-specific logic affects the core.
- PJSIP is built with `--disable-video` for simplicity.
- Shared code is in `src/common/error_handling.hpp`.
- Callbacks in `pjsip_manager.cpp` handle call state and media events.

## Current Status

✅ Project structure implemented  
✅ CLI interface working  
✅ Build system configured  
✅ Basic command parsing functional  
⏳ PJSIP integration (currently using stubs)  
⏳ Real SIP communication (currently using stubs) 