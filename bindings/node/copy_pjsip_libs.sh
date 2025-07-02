#!/bin/bash
# Copy all required PJSIP/PJSUA2 static libraries for Node bindings
# Usage: ./copy_pjsip_libs.sh /path/to/pjproject-build-lib

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 /path/to/pjproject-lib-dir"
  exit 1
fi

SRC_LIB="$1"
DEST_LIB="../../sip-core-cpp/pjsip_build/lib"

mkdir -p "$DEST_LIB"

# List of required libraries (update as needed for your platform)
LIBS=(
  "libpjsua2*.a"
  "libpjsua*.a"
  "libpjsip-ua*.a"
  "libpjsip-simple*.a"
  "libpjsip*.a"
  "libpjmedia-codec*.a"
  "libpjmedia*.a"
  "libpjmedia-videodev*.a"
  "libpjmedia-audiodev*.a"
  "libpjnath*.a"
  "libpjlib-util*.a"
  "libpj*.a"
  "libresample*.a"
  "libgsmcodec*.a"
  "libspeex*.a"
  "libilbccodec*.a"
  "libg7221codec*.a"
  "libsrtp*.a"
  "libwebrtc*.a"
)

for pattern in "${LIBS[@]}"; do
  for file in $SRC_LIB/$pattern; do
    if [ -f "$file" ]; then
      echo "Copying $file to $DEST_LIB/"
      cp "$file" "$DEST_LIB/"
    fi
  done
done

echo "All required PJSIP/PJSUA2 libraries copied to $DEST_LIB." 