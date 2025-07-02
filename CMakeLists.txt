cmake_minimum_required(VERSION 3.15)
project(pjsip_cli LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include platform-specific settings
if(APPLE)
    include(platform/CMakeLists.macos.txt)
elseif(WIN32)
    include(platform/CMakeLists.windows.txt)
elseif(UNIX)
    include(platform/CMakeLists.linux.txt)
endif()

add_subdirectory(src)
