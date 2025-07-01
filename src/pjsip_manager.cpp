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

void PJSIPManager::init() {
    if (initialized_) return;
    ep_ = std::make_unique<Endpoint>();
    ep_->libCreate();
    EpConfig ep_cfg;
    ep_cfg.logConfig.level = 5;
    // Set STUN server for NAT traversal (uaConfig only)
    ep_cfg.uaConfig.stunServer.clear();
    ep_cfg.uaConfig.stunServer.push_back("stun.l.google.com:19302");
    // Do NOT force audio settings; let CoreAudio use its defaults for best compatibility
    ep_->libInit(ep_cfg);
    TransportConfig tcfg;
    tcfg.port = 5060;
    ep_->transportCreate(PJSIP_TRANSPORT_UDP, tcfg);
    ep_->libStart();
    // Explicitly select default audio devices
    ep_->audDevManager().setPlaybackDev(0);
    ep_->audDevManager().setCaptureDev(0);
    std::cout << "[PJSIP] Initialized" << std::endl;
    initialized_ = true;
}

void PJSIPManager::register_account(const std::string& uri, const std::string& username, const std::string& password) {
    if (!initialized_) init();
    AccountConfig acfg;
    acfg.idUri = uri;
    // Correct registrar URI: sip:<domain>
    auto at_pos = uri.find('@');
    if (at_pos != std::string::npos) {
        auto domain = uri.substr(at_pos + 1);
        acfg.regConfig.registrarUri = "sip:" + domain;
    }
    acfg.sipConfig.authCreds.push_back(AuthCredInfo("digest", "*", username, 0, password));
    // Enable ICE for this account
    acfg.natConfig.iceEnabled = true;
    acfg.natConfig.mediaStunUse = PJSUA_STUN_USE_DEFAULT;
    // Disable SRTP for diagnosis
    acfg.mediaConfig.srtpUse = PJMEDIA_SRTP_DISABLED;
    acfg.mediaConfig.srtpSecureSignaling = 0;
    // Restrict codecs to only PCMU/PCMA
    auto codecs = ep_->codecEnum2();
    for (auto &codec : codecs) {
        if (codec.codecId.find("PCMU/8000") != std::string::npos || codec.codecId.find("PCMA/8000") != std::string::npos) {
            ep_->codecSetPriority(codec.codecId, 255);
        } else {
            ep_->codecSetPriority(codec.codecId, 0);
        }
    }
    account_ = std::make_shared<MyAccount>();
    account_->create(acfg);
    std::cout << "[PJSIP] Registering account: " << uri << ", user: " << username << std::endl;
}

void PJSIPManager::call(int acc_id, const std::string& destination) {
    if (!account_) {
        std::cout << "[PJSIP] No account registered" << std::endl;
        return;
    }
    call_ = std::make_shared<MyCall>(*account_);
    CallOpParam prm(true);
    call_->makeCall(destination, prm);
    std::cout << "[PJSIP] Calling " << destination << std::endl;
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

// --- MyCall implementation ---
void MyCall::onCallState(OnCallStateParam &prm) {
    CallInfo ci = getInfo();
    std::cout << "[PJSIP] Call: " << ci.remoteUri << " [" << ci.stateText << "]" << std::endl;
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
            std::cout << "[PJSIP] Audio media active" << std::endl;
        } catch (Error &err) {
            std::cout << "[PJSIP] Media error: " << err.info() << std::endl;
        }
    }
}
