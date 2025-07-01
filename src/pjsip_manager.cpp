#ifndef PJ_IS_LITTLE_ENDIAN
#define PJ_IS_LITTLE_ENDIAN 1
#endif
#ifndef PJ_IS_BIG_ENDIAN
#define PJ_IS_BIG_ENDIAN 0
#endif
#include "pjsip_manager.hpp"
#include <iostream>

using namespace pj;

PJSIPManager::PJSIPManager() {}
PJSIPManager::~PJSIPManager() { cleanup(); }

void PJSIPManager::set_transport_type(TransportType type) {
    if (initialized_) {
        std::cout << "[PJSIP] Cannot change transport after initialization" << std::endl;
        return;
    }
    transport_type_ = type;
}

void PJSIPManager::init() {
    if (initialized_) return;
    ep_ = std::make_unique<Endpoint>();
    ep_->libCreate();
    EpConfig ep_cfg;
    ep_cfg.logConfig.level = 6;
    ep_cfg.logConfig.consoleLevel = 6;
    // Set STUN server for NAT traversal (uaConfig only)
    ep_cfg.uaConfig.stunServer.clear();
    ep_cfg.uaConfig.stunServer.push_back("stun.l.google.com:19302");
    // Do NOT force audio settings; let CoreAudio use its defaults for best compatibility
    ep_->libInit(ep_cfg);
    TransportConfig tcfg;
    tcfg.port = 5060;
    pjsip_transport_type_e pj_transport;
    switch (transport_type_) {
        case TransportType::UDP:
            pj_transport = PJSIP_TRANSPORT_UDP;
            break;
        case TransportType::TCP:
            pj_transport = PJSIP_TRANSPORT_TCP;
            break;
        case TransportType::TLS:
            pj_transport = PJSIP_TRANSPORT_TLS;
            tcfg.port = 5061; // Standard SIP TLS port
            break;
        default:
            pj_transport = PJSIP_TRANSPORT_UDP;
    }
    ep_->transportCreate(pj_transport, tcfg);
    ep_->libStart();
    // Explicitly select default audio devices
    ep_->audDevManager().setPlaybackDev(0);
    ep_->audDevManager().setCaptureDev(0);
    std::cout << "[PJSIP] Initialized with transport: ";
    switch (transport_type_) {
        case TransportType::UDP: std::cout << "UDP"; break;
        case TransportType::TCP: std::cout << "TCP"; break;
        case TransportType::TLS: std::cout << "TLS"; break;
    }
    std::cout << std::endl;
    initialized_ = true;
}

void PJSIPManager::set_ice_enabled(bool enabled) {
    ice_enabled_ = enabled;
}
void PJSIPManager::set_interface_ip(const std::string& ip) {
    interface_ip_ = ip;
}

void PJSIPManager::register_account(const std::string& uri, const std::string& username, const std::string& password) {
    if (!initialized_) init();
    AccountConfig acfg;
    acfg.idUri = uri;
    auto at_pos = uri.find('@');
    if (at_pos != std::string::npos) {
        auto domain = uri.substr(at_pos + 1);
        acfg.regConfig.registrarUri = "sip:" + domain;
    }
    acfg.sipConfig.authCreds.push_back(AuthCredInfo("digest", "*", username, 0, password));
    // Set ICE and interface options
    acfg.natConfig.iceEnabled = ice_enabled_;
    if (!interface_ip_.empty()) {
        acfg.sipConfig.proxies.clear();
        acfg.sipConfig.proxies.push_back("sip:" + interface_ip_);
    }
    account_ = std::make_shared<MyAccount>(this);
    account_->create(acfg);
    std::cout << "[PJSIP] Registering account: " << uri << ", user: " << username << std::endl;
}

void PJSIPManager::call(int acc_id, const std::string& destination) {
    if (!account_) {
        std::cout << "[PJSIP] No account registered" << std::endl;
        return;
    }
    CallOpParam prm(true);
    prm.opt.audioCount = 1;
    prm.opt.videoCount = 0;
    // Set ICE and interface options for the call if needed
    // (PJSUA2 does not expose direct per-call ICE toggle, but account setting applies)
    call_ = std::make_shared<MyCall>(*account_, acc_id);
    calls_[call_->getId()] = call_;
    call_->makeCall(destination, prm);
    std::cout << "[PJSIP] Calling " << destination << std::endl;
}

void PJSIPManager::accept(int call_id) {
    auto it = calls_.find(call_id);
    if (it != calls_.end()) {
        CallOpParam prm(true);
        it->second->answer(prm);
        std::cout << "[PJSIP] Accepted call " << call_id << std::endl;
    } else {
        std::cout << "[PJSIP] No such call to accept: " << call_id << std::endl;
    }
}

void PJSIPManager::reject(int call_id) {
    auto it = calls_.find(call_id);
    if (it != calls_.end()) {
        CallOpParam prm;
        prm.statusCode = PJSIP_SC_DECLINE;
        it->second->hangup(prm);
        std::cout << "[PJSIP] Rejected call " << call_id << std::endl;
    } else {
        std::cout << "[PJSIP] No such call to reject: " << call_id << std::endl;
    }
}

void PJSIPManager::mute(int call_id) {
    std::cout << "[PJSIP] Mute not implemented (PJSUA2)" << std::endl;
}
void PJSIPManager::unmute(int call_id) {
    std::cout << "[PJSIP] Unmute not implemented (PJSUA2)" << std::endl;
}
void PJSIPManager::hold(int call_id) {
    if (call_) {
        CallOpParam prm;
        prm.statusCode = PJSIP_SC_OK;
        call_->setHold(prm);
        std::cout << "[PJSIP] Holding call" << std::endl;
    }
}
void PJSIPManager::unhold(int call_id) {
    if (call_) {
        CallOpParam prm;
        prm.statusCode = PJSIP_SC_OK;
        call_->reinvite(prm);
        std::cout << "[PJSIP] Unholding call" << std::endl;
    }
}
void PJSIPManager::hangup(int call_id) {
    if (call_) {
        CallOpParam prm(true);
        prm.statusCode = PJSIP_SC_DECLINE;
        call_->hangup(prm);
        std::cout << "[PJSIP] Hanging up call" << std::endl;
    }
}
void PJSIPManager::hangup_all() {
    if (ep_) ep_->hangupAllCalls();
    std::cout << "[PJSIP] Hanging up all calls" << std::endl;
}
void PJSIPManager::cleanup() {
    if (ep_ && initialized_) {
        ep_->libDestroy();
        ep_.reset();
        initialized_ = false;
        std::cout << "[PJSIP] Cleanup" << std::endl;
    }
}

// --- MyAccount implementation ---
void MyAccount::onRegState(OnRegStateParam &prm) {
    AccountInfo ai = getInfo();
    std::cout << (ai.regIsActive ? "[PJSIP] Registered" : "[PJSIP] Unregistered")
              << " code=" << prm.code << std::endl;
}

void MyAccount::onIncomingCall(OnIncomingCallParam &iprm) {
    std::cout << "[PJSIP] Incoming call (call_id=" << iprm.callId << ")";
    // Try to print info if available
    // If info is a string, print it; otherwise, just print call_id
    // This is a fallback for unknown struct layout
    std::cout << std::endl;
    if (mgr_) {
        auto new_call = std::make_shared<MyCall>(*this, iprm.callId);
        mgr_->calls_[iprm.callId] = new_call;
        std::cout << "Type 'accept " << iprm.callId << "' to answer or 'reject " << iprm.callId << "' to decline." << std::endl;
    }
}

// --- MyCall implementation ---
void MyCall::onCallState(OnCallStateParam &prm) {
    CallInfo ci = getInfo();
    std::cout << "[PJSIP] Call: " << ci.remoteUri << " [" << ci.stateText << "] (state=" << ci.state << ")" << std::endl;
    std::cout << "  Call ID: " << ci.id << std::endl;
    if (ci.state == PJSIP_INV_STATE_DISCONNECTED) {
        std::cout << "[PJSIP] Call disconnected" << std::endl;
    }
}
void MyCall::onCallMediaState(OnCallMediaStateParam &prm) {
    CallInfo ci = getInfo();
    if (ci.media.size() > 0 && ci.media[0].type == PJMEDIA_TYPE_AUDIO && ci.media[0].status == PJSUA_CALL_MEDIA_ACTIVE) {
        try {
            AudioMedia aud_med = getAudioMedia(-1);
            // Connect both directions for audio (like pjsua_conf_connect)
            aud_med.startTransmit(Endpoint::instance().audDevManager().getPlaybackDevMedia());
            Endpoint::instance().audDevManager().getCaptureDevMedia().startTransmit(aud_med);
            std::cout << "[PJSIP] Audio media active (call_id=" << ci.id << ")" << std::endl;
            std::cout << "  Media count: " << ci.media.size() << ", Media status: " << ci.media[0].status << std::endl;
        } catch (Error &err) {
            std::cout << "[PJSIP] Media error: " << err.info() << std::endl;
        }
    } else {
        std::cout << "[PJSIP] Media not active or not audio (call_id=" << ci.id << ")" << std::endl;
    }
}
