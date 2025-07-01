cmake_minimum_required(VERSION 3.15)
project(pjsip_cli LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set PJSIP_LIBS and EXTRA_LIBS based on platform
if(APPLE)
    set(PJSIP_LIBS
        pjsua2-arm-apple-darwin24.5.0
        pjsua-arm-apple-darwin24.5.0
        pjsip-ua-arm-apple-darwin24.5.0
        pjsip-simple-arm-apple-darwin24.5.0
        pjsip-arm-apple-darwin24.5.0
        pjmedia-codec-arm-apple-darwin24.5.0
        pjmedia-arm-apple-darwin24.5.0
        pjmedia-videodev-arm-apple-darwin24.5.0
        pjmedia-audiodev-arm-apple-darwin24.5.0
        pjnath-arm-apple-darwin24.5.0
        pjlib-util-arm-apple-darwin24.5.0
        pj-arm-apple-darwin24.5.0
        resample-arm-apple-darwin24.5.0
        gsmcodec-arm-apple-darwin24.5.0
        speex-arm-apple-darwin24.5.0
        ilbccodec-arm-apple-darwin24.5.0
        g7221codec-arm-apple-darwin24.5.0
        srtp-arm-apple-darwin24.5.0
        webrtc-arm-apple-darwin24.5.0
        pthread
    )
    find_library(COREAUDIO_FRAMEWORK CoreAudio)
    find_library(AUDIOTOOLBOX_FRAMEWORK AudioToolbox)
    find_library(FOUNDATION_FRAMEWORK Foundation)
    find_library(APPKIT_FRAMEWORK AppKit)
    find_library(CORESERVICES_FRAMEWORK CoreServices)
    find_library(AUDIOUNIT_FRAMEWORK AudioUnit)
    set(EXTRA_LIBS
        ${COREAUDIO_FRAMEWORK}
        ${AUDIOTOOLBOX_FRAMEWORK}
        ${FOUNDATION_FRAMEWORK}
        ${APPKIT_FRAMEWORK}
        ${CORESERVICES_FRAMEWORK}
        ${AUDIOUNIT_FRAMEWORK}
    )
    include(platform/CMakeLists.macos.txt)
elseif(WIN32)
    set(PJSIP_LIBS
        pjsua2
        pjsua
        pjsip-ua
        pjsip-simple
        pjsip
        pjmedia-codec
        pjmedia
        pjmedia-videodev
        pjmedia-audiodev
        pjnath
        pjlib-util
        pjlib
        resample
        gsmcodec
        speex
        ilbccodec
        g7221codec
        srtp
        webrtc
    )
    set(EXTRA_LIBS ws2_32)
    include(platform/CMakeLists.windows.txt)
elseif(UNIX)
    set(PJSIP_LIBS
        pjsua2
        pjsua
        pjsip-ua
        pjsip-simple
        pjsip
        pjmedia-codec
        pjmedia
        pjmedia-videodev
        pjmedia-audiodev
        pjnath
        pjlib-util
        pjlib
        resample
        gsmcodec
        speex
        ilbccodec
        g7221codec
        srtp
        webrtc
        pthread
    )
    set(EXTRA_LIBS "")
    include(platform/CMakeLists.linux.txt)
endif()

add_subdirectory(src)
