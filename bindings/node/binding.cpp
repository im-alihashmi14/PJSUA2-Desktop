#include <napi.h>
#include <string>
#include "../../sip-core-cpp/pjsip_manager.hpp"

PJSIPManager g_manager; // Global instance

// Helper: Convert JS string to TransportType enum
TransportType parseTransportType(const std::string& str) {
  if (str == "tcp" || str == "TCP") return TransportType::TCP;
  if (str == "tls" || str == "TLS") return TransportType::TLS;
  return TransportType::UDP;
}

// Expose: init()
Napi::Value InitSIP(const Napi::CallbackInfo& info) {
  g_manager.init();
  return info.Env().Undefined();
}
// Expose: register_account(uri, username, password)
Napi::Value RegisterAccount(const Napi::CallbackInfo& info) {
  if (info.Length() < 3) {
    Napi::TypeError::New(info.Env(), "Expected 3 arguments").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  std::string uri = info[0].As<Napi::String>();
  std::string username = info[1].As<Napi::String>();
  std::string password = info[2].As<Napi::String>();
  g_manager.register_account(uri, username, password);
  return info.Env().Undefined();
}
// Expose: call(acc_id, destination)
Napi::Value Call(const Napi::CallbackInfo& info) {
  if (info.Length() < 2) {
    Napi::TypeError::New(info.Env(), "Expected 2 arguments").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int acc_id = info[0].As<Napi::Number>();
  std::string destination = info[1].As<Napi::String>();
  g_manager.call(acc_id, destination);
  return info.Env().Undefined();
}
// Expose: mute(call_id)
Napi::Value Mute(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.mute(call_id);
  return info.Env().Undefined();
}
// Expose: unmute(call_id)
Napi::Value Unmute(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.unmute(call_id);
  return info.Env().Undefined();
}
// Expose: hold(call_id)
Napi::Value Hold(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.hold(call_id);
  return info.Env().Undefined();
}
// Expose: unhold(call_id)
Napi::Value Unhold(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.unhold(call_id);
  return info.Env().Undefined();
}
// Expose: hangup(call_id)
Napi::Value Hangup(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.hangup(call_id);
  return info.Env().Undefined();
}
// Expose: hangup_all()
Napi::Value HangupAll(const Napi::CallbackInfo& info) {
  g_manager.hangup_all();
  return info.Env().Undefined();
}
// Expose: cleanup()
Napi::Value Cleanup(const Napi::CallbackInfo& info) {
  g_manager.cleanup();
  return info.Env().Undefined();
}
// Expose: set_transport_type(type)
Napi::Value SetTransportType(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  std::string type = info[0].As<Napi::String>();
  g_manager.set_transport_type(parseTransportType(type));
  return info.Env().Undefined();
}
// Expose: accept(call_id)
Napi::Value Accept(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.accept(call_id);
  return info.Env().Undefined();
}
// Expose: reject(call_id)
Napi::Value Reject(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int call_id = info[0].As<Napi::Number>();
  g_manager.reject(call_id);
  return info.Env().Undefined();
}
// Expose: set_ice_enabled(enabled)
Napi::Value SetIceEnabled(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  bool enabled = info[0].As<Napi::Boolean>();
  g_manager.set_ice_enabled(enabled);
  return info.Env().Undefined();
}
// Expose: set_interface_ip(ip)
Napi::Value SetInterfaceIp(const Napi::CallbackInfo& info) {
  if (info.Length() < 1) {
    Napi::TypeError::New(info.Env(), "Expected 1 argument").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  std::string ip = info[0].As<Napi::String>();
  g_manager.set_interface_ip(ip);
  return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("initSIP", Napi::Function::New(env, InitSIP));
  exports.Set("registerAccount", Napi::Function::New(env, RegisterAccount));
  exports.Set("call", Napi::Function::New(env, Call));
  exports.Set("mute", Napi::Function::New(env, Mute));
  exports.Set("unmute", Napi::Function::New(env, Unmute));
  exports.Set("hold", Napi::Function::New(env, Hold));
  exports.Set("unhold", Napi::Function::New(env, Unhold));
  exports.Set("hangup", Napi::Function::New(env, Hangup));
  exports.Set("hangupAll", Napi::Function::New(env, HangupAll));
  exports.Set("cleanup", Napi::Function::New(env, Cleanup));
  exports.Set("setTransportType", Napi::Function::New(env, SetTransportType));
  exports.Set("accept", Napi::Function::New(env, Accept));
  exports.Set("reject", Napi::Function::New(env, Reject));
  exports.Set("setIceEnabled", Napi::Function::New(env, SetIceEnabled));
  exports.Set("setInterfaceIp", Napi::Function::New(env, SetInterfaceIp));
  return exports;
}

NODE_API_MODULE(sipaddon, Init) 