cmake_minimum_required(VERSION 3.15)
project(pjsip_cli LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(pjsip-cli main.cpp)

target_include_directories(pjsip-cli PRIVATE
    ${CMAKE_SOURCE_DIR}/sip-core-cpp
    ${CMAKE_SOURCE_DIR}/sip-core-cpp/common
    ${CMAKE_SOURCE_DIR}/sip-core-cpp/pjsip_build/include
)

target_link_directories(pjsip-cli PRIVATE
    ${CMAKE_SOURCE_DIR}/sip-core-cpp/pjsip_build/lib
)

target_link_libraries(pjsip-cli PRIVATE pjsip_core) 