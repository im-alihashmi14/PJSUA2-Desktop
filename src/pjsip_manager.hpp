#pragma once
#include <string>
#include <memory>
#include <pjsua2.hpp>

class MyAccount;
class MyCall;

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
private:
    std::unique_ptr<pj::Endpoint> ep_;
    std::shared_ptr<MyAccount> account_;
    std::shared_ptr<MyCall> call_;
    bool initialized_ = false;
};

class MyAccount : public pj::Account {
public:
    void onRegState(pj::OnRegStateParam &prm) override;
};

class MyCall : public pj::Call {
public:
    MyCall(pj::Account &acc, int call_id = PJSUA_INVALID_ID) : pj::Call(acc, call_id) {}
    void onCallState(pj::OnCallStateParam &prm) override;
    void onCallMediaState(pj::OnCallMediaStateParam &prm) override;
};
