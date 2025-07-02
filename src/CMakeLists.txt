# NOTE: All platform-specific libraries/settings must be listed in platform/CMakeLists.*.txt only.
# This file is platform-agnostic and works for both macOS and Windows.

add_library(pjsip_core STATIC
    pjsip_manager.cpp
)

target_include_directories(pjsip_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/common
    ${CMAKE_SOURCE_DIR}/pjsip_build/include
)

target_link_directories(pjsip_core PUBLIC
    ${CMAKE_SOURCE_DIR}/pjsip_build/lib
)

target_compile_definitions(pjsip_core PUBLIC PJ_IS_LITTLE_ENDIAN=1 PJ_IS_BIG_ENDIAN=0)

target_link_libraries(pjsip_core PUBLIC ${PJSIP_LIBS} ${EXTRA_LIBS})

add_executable(pjsip-cli
    main.cpp
)

target_link_libraries(pjsip-cli PRIVATE pjsip_core) 