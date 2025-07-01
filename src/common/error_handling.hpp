#pragma once
#include <stdexcept>
#include <string>

inline void throw_error(const std::string& msg) {
    throw std::runtime_error(msg);
}
