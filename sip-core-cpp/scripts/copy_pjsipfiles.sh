#!/bin/bash

# Set source and destination paths
PJSIP_ROOT="/path/to/pjproject-2.15.1"
DEST_ROOT="/path/to/PJSUA2-Desktop/pjsip_build"

# Create destination directories if they don't exist
mkdir -p "$DEST_ROOT/include"
mkdir -p "$DEST_ROOT/lib"

# List of include source folders
INCLUDE_DIRS=(
    "pjlib/include"
    "pjlib-util/include"
    "pjmedia/include"
    "pjnath/include"
    "pjsip/include"
    "third_party/include"
)

# Copy all header files
for dir in "${INCLUDE_DIRS[@]}"; do
    SRC="$PJSIP_ROOT/$dir"
    if [ -d "$SRC" ]; then
        cp -r "$SRC/"* "$DEST_ROOT/include/"
    fi
done

# List of lib source folders
LIB_DIRS=(
    "pjlib/lib"
    "pjlib-util/lib"
    "pjmedia/lib"
    "pjnath/lib"
    "pjsip/lib"
    "third_party/lib"
    "lib"
)

# Copy all .a and .so/.dylib/.dll/.lib files (cross-platform)
for dir in "${LIB_DIRS[@]}"; do
    SRC="$PJSIP_ROOT/$dir"
    if [ -d "$SRC" ]; then
        cp "$SRC"/*.a "$DEST_ROOT/lib/" 2>/dev/null
        cp "$SRC"/*.so "$DEST_ROOT/lib/" 2>/dev/null
        cp "$SRC"/*.dylib "$DEST_ROOT/lib/" 2>/dev/null
        cp "$SRC"/*.dll "$DEST_ROOT/lib/" 2>/dev/null
        cp "$SRC"/*.lib "$DEST_ROOT/lib/" 2>/dev/null
    fi
done

echo "PJSIP headers and libraries copied successfully!"