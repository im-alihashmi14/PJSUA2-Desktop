#ifndef PJ_IS_LITTLE_ENDIAN
#define PJ_IS_LITTLE_ENDIAN 1
#endif
#ifndef PJ_IS_BIG_ENDIAN
#define PJ_IS_BIG_ENDIAN 0
#endif
#pragma once
#include <string>
#include <memory>
#include <pjsua2.hpp>
#include <map>

class MyAccount;
class MyCall;

enum class TransportType { UDP, TCP, TLS };

class PJSIPManager {
public:
    PJSIPManager();
    ~PJSIPManager();
    void init();
    void register_account(const std::string& uri, const std::string& username, const std::string& password);
    void call(int acc_id, const std::string& destination);
    void mute(int call_id);
    void unmute(int call_id);
    void hold(int call_id);
    void unhold(int call_id);
    void hangup(int call_id);
    void hangup_all();
    void cleanup();
    void set_transport_type(TransportType type);
    void accept(int call_id);
    void reject(int call_id);
    void set_ice_enabled(bool enabled);
    void set_interface_ip(const std::string& ip);
private:
    std::unique_ptr<pj::Endpoint> ep_;
    std::shared_ptr<MyAccount> account_;
    std::shared_ptr<MyCall> call_;
    std::map<int, std::shared_ptr<MyCall>> calls_;
    bool initialized_ = false;
    TransportType transport_type_ = TransportType::UDP;
    bool ice_enabled_ = true;
    std::string interface_ip_;
    friend class MyAccount;
};

class MyAccount : public pj::Account {
public:
    MyAccount(PJSIPManager* mgr) : mgr_(mgr) {}
    void onRegState(pj::OnRegStateParam &prm) override;
    void onIncomingCall(pj::OnIncomingCallParam &iprm) override;
private:
    PJSIPManager* mgr_;
};

class MyCall : public pj::Call {
public:
    MyCall(pj::Account &acc, int call_id = PJSUA_INVALID_ID) : pj::Call(acc, call_id) {}
    void onCallState(pj::OnCallStateParam &prm) override;
    void onCallMediaState(pj::OnCallMediaStateParam &prm) override;
};
