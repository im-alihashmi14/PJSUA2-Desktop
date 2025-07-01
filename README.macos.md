# PJSUA2 - macOS Build & Usage Guide

This guide explains how to build and run the PJSUA2 C++ SIP CLI project on **macOS**.

---

## 1. Prerequisites

- **Xcode Command Line Tools**
  ```sh
  xcode-select --install
  ```
- **Homebrew** (recommended for dependencies)
  ```sh
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- **CMake**
  ```sh
  brew install cmake
  ```
- **(Optional) GnuTLS** (for secure SIP/TLS)
  ```sh
  brew install gnutls
  ```

---

## 2. Clone the Project

```sh
git clone <your-repo-url>
cd PJSUA2
```

---

## 3. Build PJSIP (Native, Static)

Run the provided script to download and build PJSIP:

```sh
chmod +x scripts/build_pjsip.sh
./scripts/build_pjsip.sh
```
- This will build PJSIP and install headers/libs to `../pjsip_build`.

---

## 4. Build the Project (CMake)

```sh
mkdir -p build
cd build
cmake ..
cmake --build .
```
- The CLI executable will be at `build/src/pjsip-cli`.

---

## 5. Run the CLI

```sh
./src/pjsip-cli
```

You will see an interactive prompt:
```
Usage:
  init
  transport <udp|tcp|tls>
  register <uri> <username> <password>
  call <acc_id> <destination>
  mute <call_id>
  unmute <call_id>
  hold <call_id>
  unhold <call_id>
  hangup <call_id>
  hangup-all
  cleanup
  exit | quit
  accept <call_id>
  reject <call_id>
  ice <on|off>
  interface <ip>
  status
pjsip>
```

---

## 6. Example Usage

### Register:
```sh
pjsip> register sip:alihashmi14@sip.antisip.com alihashmi14 AdvC8ptqSwPbkuA
```

### Make a Call:
```sh
pjsip> call 0 sip:im.alihashmi14@sip.linphone.org
```

### Accept Incoming Call:
```sh
pjsip> accept <call_id>
```

### Enable/Disable ICE:
```sh
pjsip> ice off
```

---

## 7. Troubleshooting

- **Linker errors for PJSIP libs:**
  - Ensure `../pjsip_build/lib` and `../pjsip_build/include` exist and are populated.
  - Re-run `./scripts/build_pjsip.sh` if needed.
- **Audio issues:**
  - Make sure your Mac's microphone and speakers are enabled.
- **ICE/NAT issues:**
  - Try `ice off` for simpler SDP and better compatibility.
- **Platform-specific settings:**
  - All macOS-specific libraries and frameworks are managed in `platform/CMakeLists.macos.txt`.

---

## 8. Clean Build

To clean and rebuild everything:
```sh
rm -rf build ../pjsip_build
./scripts/build_pjsip.sh
mkdir build && cd build
cmake .. && cmake --build .
```

---

## 9. Project Structure

- `src/` - Core C++ logic and CLI
- `scripts/build_pjsip.sh` - PJSIP build script
- `platform/` - Platform-specific CMake settings
- `../pjsip_build/` - PJSIP headers and libraries (auto-generated)

---

## 10. Support

If you encounter issues, check the logs for detailed SIP and media state. For further help, open an issue or contact the maintainer. 