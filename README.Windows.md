# PJSUA2-Desktop: Windows Build Guide

This guide explains how to build the PJSUA2-Desktop project on Windows, including prerequisites, step-by-step instructions, and solutions to common errors.

---

## Prerequisites

1. **Visual Studio 2022** (Community Edition is fine)
   - Install the "Desktop development with C++" workload.
2. **CMake 3.15 or higher**
   - [Download CMake](https://cmake.org/download/)
   - During install, select "Add CMake to the system PATH".
3. **PJSIP Source Code**
   - [Download from PJSIP.org](https://www.pjsip.org/download.htm)
   - Extract to a folder, e.g., `C:\pjproject-2.x.x`
4. **Python** (optional, for PJSIP configure script)

---

## Step 1: Build PJSIP Libraries

1. **Open "Developer Command Prompt for VS 2022"**
2. **Navigate to the PJSIP source directory:**
   ```cmd
   cd C:\pjproject-2.x.x
   ```
3. **Open the Visual Studio solution:**
   - Open `pjproject-vs14.sln` in Visual Studio.
   - When prompted, retarget to the latest toolset (v143 for VS 2022).
   - Set the configuration to `Release` and platform to `x64`.
   - Build the solution (Build > Rebuild Solution).
4. **Copy the built libraries and headers:**
   - Copy all `*.lib` files from the `lib` directories to your project's `pjsip_build/lib`.
   - Copy all `include` folders from PJSIP subdirectories to your project's `pjsip_build/include`.

---

## Step 2: Configure and Build This Project

1. **Open a new "Developer Command Prompt for VS 2022"**
2. **Navigate to your project root:**
   ```cmd
   cd C:\Users\Ali\PJSUA2-Desktop
   ```
3. **Clean any previous build:**
   ```cmd
   Remove-Item -Recurse -Force build
   mkdir build
   cd build
   ```
4. **Generate build files for x64:**
   ```cmd
   cmake -A x64 ..
   ```
5. **Build the project:**
   ```cmd
   cmake --build . --config Release
   ```
6. **Run the CLI:**
   ```cmd
   .\src\Release\pjsip-cli.exe
   ```

---

## Common Errors & Solutions

### 1. `cmake : The term 'cmake' is not recognized...`
- **Solution:** Add CMake to your system PATH or reinstall CMake and select the PATH option.

### 2. `fatal error LNK1181: cannot open input file 'xxx.lib'`
- **Solution:**
  - Make sure the `.lib` file exists in `pjsip_build/lib`.
  - If the file is named differently (e.g., `libxxx-...`), update `platform/CMakeLists.windows.txt` to match the actual filename (without `.lib`).

### 3. `Cannot open include file: 'pjsua2.hpp'`
- **Solution:** Ensure all PJSIP headers are copied to `pjsip_build/include`.

### 4. `No executable produced (only .lib)`
- **Solution:**
  - Make sure you are building for `x64` (not ARM64).
  - Regenerate build files with `cmake -A x64 ..`.
  - Check that `add_executable(pjsip-cli main.cpp)` is present in `src/CMakeLists.txt`.

### 5. `The build tools for Visual Studio 2015 (Platform Toolset = 'v140') cannot be found.`
- **Solution:**
  - Retarget the solution in Visual Studio to use the latest toolset (v143 for VS 2022).

### 6. `Cannot open include file: 'pj/config_site.h'`
- **Solution:**
  - Create an empty `config_site.h` in `pjlib/include/pj/` if it does not exist.

### 7. `The term 'nmake' is not recognized...`
- **Solution:**
  - Always use the "Developer Command Prompt for VS 2022" for building PJSIP.

---

## Tips
- Always match the architecture (x64) in both CMake and Visual Studio.
- If you change library names or add new dependencies, update `platform/CMakeLists.windows.txt`.
- Use PowerShell or Command Prompt, not Git Bash, for Windows builds.
- If you get stuck, clean the build directory and regenerate with CMake.

---

## Project Structure Reference
- `src/` — Main source code
- `platform/` — Platform-specific CMake configs
- `pjsip_build/` — PJSIP headers and libraries
- `build/` — CMake build output

---

For more help, see the main `README.md` or open an issue. 