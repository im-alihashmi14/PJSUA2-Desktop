#include "pjsip_manager.hpp"
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

void print_usage() {
    std::cout << "Usage:\n"
              << "  init\n"
              << "  register <uri> <username> <password>\n"
              << "  call <acc_id> <destination>\n"
              << "  mute <call_id>\n"
              << "  unmute <call_id>\n"
              << "  hold <call_id>\n"
              << "  unhold <call_id>\n"
              << "  hangup <call_id>\n"
              << "  hangup-all\n"
              << "  cleanup\n"
              << "  exit | quit\n";
}

int main() {
    PJSIPManager manager;
    print_usage();
    std::string line;
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
        } else {
            print_usage();
        }
    }
    return 0;
}
