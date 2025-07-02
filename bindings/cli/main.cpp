#ifndef PJ_IS_LITTLE_ENDIAN
#define PJ_IS_LITTLE_ENDIAN 1
#endif
#ifndef PJ_IS_BIG_ENDIAN
#define PJ_IS_BIG_ENDIAN 0
#endif
#include "../../sip-core-cpp/pjsip_manager.hpp"
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

void print_usage() {
    std::cout << "Usage:\n"
              << "  init\n"
              << "  transport <udp|tcp|tls>\n"
              << "  register <uri> <username> <password>\n"
              << "  call <acc_id> <destination>\n"
              << "  mute <call_id>\n"
              << "  unmute <call_id>\n"
              << "  hold <call_id>\n"
              << "  unhold <call_id>\n"
              << "  hangup <call_id>\n"
              << "  hangup-all\n"
              << "  cleanup\n"
              << "  exit | quit\n"
              << "  accept <call_id>\n"
              << "  reject <call_id>\n"
              << "  ice <on|off>\n"
              << "  interface <ip>\n"
              << "  status\n";
}

int main() {
    PJSIPManager manager;
    print_usage();
    std::string line;
    std::string ice_status = "on";
    std::string interface_ip = "";
    while (true) {
        std::cout << "\npjsip> ";
        if (!std::getline(std::cin, line)) break;
        std::istringstream iss(line);
        std::vector<std::string> args;
        std::string arg;
        while (iss >> arg) args.push_back(arg);
        if (args.empty()) continue;
        std::string cmd = args[0];
        if (cmd == "exit" || cmd == "quit") {
            manager.cleanup();
            break;
        } else if (cmd == "init") {
            manager.init();
        } else if (cmd == "transport" && args.size() == 2) {
            if (args[1] == "udp") {
                manager.set_transport_type(TransportType::UDP);
                std::cout << "[CLI] Transport set to UDP" << std::endl;
            } else if (args[1] == "tcp") {
                manager.set_transport_type(TransportType::TCP);
                std::cout << "[CLI] Transport set to TCP" << std::endl;
            } else if (args[1] == "tls") {
                manager.set_transport_type(TransportType::TLS);
                std::cout << "[CLI] Transport set to TLS" << std::endl;
            } else {
                std::cout << "[CLI] Unknown transport: " << args[1] << std::endl;
            }
        } else if (cmd == "register" && args.size() == 4) {
            manager.register_account(args[1], args[2], args[3]);
        } else if (cmd == "call" && args.size() == 3) {
            manager.call(std::stoi(args[1]), args[2]);
        } else if (cmd == "mute" && args.size() == 2) {
            manager.mute(std::stoi(args[1]));
        } else if (cmd == "unmute" && args.size() == 2) {
            manager.unmute(std::stoi(args[1]));
        } else if (cmd == "hold" && args.size() == 2) {
            manager.hold(std::stoi(args[1]));
        } else if (cmd == "unhold" && args.size() == 2) {
            manager.unhold(std::stoi(args[1]));
        } else if (cmd == "hangup" && args.size() == 2) {
            manager.hangup(std::stoi(args[1]));
        } else if (cmd == "hangup-all") {
            manager.hangup_all();
        } else if (cmd == "cleanup") {
            manager.cleanup();
        } else if (cmd == "accept" && args.size() == 2) {
            manager.accept(std::stoi(args[1]));
        } else if (cmd == "reject" && args.size() == 2) {
            manager.reject(std::stoi(args[1]));
        } else if (cmd == "ice" && args.size() == 2) {
            if (args[1] == "on") {
                ice_status = "on";
                manager.set_ice_enabled(true);
                std::cout << "[PJSIP] ICE enabled" << std::endl;
            } else if (args[1] == "off") {
                ice_status = "off";
                manager.set_ice_enabled(false);
                std::cout << "[PJSIP] ICE disabled" << std::endl;
            } else {
                std::cout << "Usage: ice <on|off>" << std::endl;
            }
        } else if (cmd == "interface" && args.size() == 2) {
            interface_ip = args[1];
            manager.set_interface_ip(interface_ip);
            std::cout << "[PJSIP] Using interface IP: " << interface_ip << std::endl;
        } else if (cmd == "status") {
            std::cout << "ICE: " << ice_status << ", Interface: " << (interface_ip.empty() ? "default" : interface_ip) << std::endl;
        } else {
            print_usage();
        }
    }
    return 0;
}
