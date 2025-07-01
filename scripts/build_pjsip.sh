#!/bin/bash
set -e

PJSIP_VERSION=2.13
PREFIX=$(pwd)/../pjsip_build

if [ ! -d "pjsip" ]; then
    echo "Downloading PJSIP..."
    curl -LO https://github.com/pjsip/pjproject/archive/refs/tags/${PJSIP_VERSION}.tar.gz
    tar xzf ${PJSIP_VERSION}.tar.gz
    mv pjproject-${PJSIP_VERSION} pjsip
fi

cd pjsip
./configure --prefix=$PREFIX --disable-video
make -j$(nproc || sysctl -n hw.ncpu)
make install

echo "PJSIP built and installed to $PREFIX"
