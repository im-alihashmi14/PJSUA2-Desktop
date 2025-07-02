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
      ],
      "cflags_cc": [ "-std=c++17" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ],
  "conditions": [
    ["OS=='win'", {
      "targets": [
        {
          "libraries": [
            "../../../build/sip-core-cpp/pjsip_core.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjsua2-lib-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjsua-lib-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjsip-ua-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjsip-simple-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjsip-core-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjmedia-codec-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjmedia-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjmedia-videodev-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjmedia-audiodev-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjnath-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjlib-util-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/pjlib-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libresample-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libgsmcodec-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libspeex-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libilbccodec-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libg7221codec-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libsrtp-x86_64-x64-vc14-Release.lib",
            "../../sip-core-cpp/pjsip_build/lib/libwebrtc-x86_64-x64-vc14-Release.lib",
            "ws2_32.lib"
          ]
        }
      ]
    }],
    ["OS=='linux'", {
      "targets": [
        {
          "libraries": [
            # You must fill in the actual .a filenames for your Linux build here, based on your CMakeLists.linux.txt and pjsip_build/lib contents
            # Example:
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
        }
      ]
    }]
  ]
} 