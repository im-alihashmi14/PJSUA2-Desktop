{
  "targets": [
    {
      "target_name": "sipaddon",
      "sources": [ "binding.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "../../sip-core-cpp",
        "../../sip-core-cpp/common",
        "../../sip-core-cpp/pjsip_build/include"
      ],
      "cflags_cc": [ "-std=c++17" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "RuntimeLibrary": 2
        }
      },
      "conditions": [
        ["OS=='mac'", {
          "libraries": [
            "../../../build/sip-core-cpp/libpjsip_core.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjsua2-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjsua-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjsip-ua-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjsip-simple-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjsip-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjmedia-codec-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjmedia-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjmedia-videodev-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjmedia-audiodev-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjnath-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpjlib-util-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libpj-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libresample-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libgsmcodec-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libspeex-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libilbccodec-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libg7221codec-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libsrtp-arm-apple-darwin24.5.0.a",
            "../../../sip-core-cpp/pjsip_build/lib/libwebrtc-arm-apple-darwin24.5.0.a",
            "-framework CoreAudio",
            "-framework AudioToolbox",
            "-framework Foundation",
            "-framework AppKit",
            "-framework CoreServices",
            "-framework AudioUnit",
            "-lpthread"
          ]
        }],
        ["OS=='win'", {
          "libraries": [
            "../../../build/sip-core-cpp/Release/pjsip_core.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjsua2-lib-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjsua-lib-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjsip-ua-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjsip-simple-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjsip-core-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjmedia-codec-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjmedia-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjmedia-videodev-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjmedia-audiodev-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjnath-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjlib-util-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/pjlib-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libresample-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libgsmcodec-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libspeex-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libilbccodec-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libg7221codec-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libsrtp-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libwebrtc-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libbaseclasses-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libmilenage-ARM64-ARM64-vc14-Release.lib",
            "../../../sip-core-cpp/pjsip_build/lib/libyuv-ARM64-ARM64-vc14-Release.lib",
            "ws2_32.lib"
          ]
        }],
        ["OS=='linux'", {
          "libraries": [
            "../../../build/sip-core-cpp/libpjsip_core.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjsua2-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjsua-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjsip-ua-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjsip-simple-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjsip-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjmedia-codec-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjmedia-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjmedia-videodev-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjmedia-audiodev-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjnath-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpjlib-util-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libpj-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libresample-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libgsmcodec-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libspeex-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libilbccodec-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libg7221codec-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libsrtp-linux.a",
            "../../sip-core-cpp/pjsip_build/lib/libwebrtc-linux.a",
            "-lpthread"
          ]
        }]
      ]
    }
  ]
} 