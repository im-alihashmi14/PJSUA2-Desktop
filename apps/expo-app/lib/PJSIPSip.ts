// TypeScript interface for the SIP API exposed by Electron
export interface ISipApi {
  initSIP(): Promise<any>;
  registerAccount(uri: string, user: string, pass: string): Promise<any>;
  call(accId: number, dest: string): Promise<any>;
  mute(callId: number): Promise<any>;
  unmute(callId: number): Promise<any>;
  hold(callId: number): Promise<any>;
  unhold(callId: number): Promise<any>;
  hangup(callId: number): Promise<any>;
  hangupAll(): Promise<any>;
  cleanup(): Promise<any>;
  setTransportType(type: string): Promise<any>;
  accept(callId: number): Promise<any>;
  reject(callId: number): Promise<any>;
  setIceEnabled(enabled: boolean): Promise<any>;
  setInterfaceIp(ip: string): Promise<any>;
}

// Fallback/mock implementation for web
class PJSIPSipMock implements ISipApi {
  initSIP() { return Promise.resolve('Mock initSIP (web)'); }
  registerAccount(uri: string, user: string, pass: string) { return Promise.resolve('Mock registerAccount (web)'); }
  call(accId: number, dest: string) { return Promise.resolve('Mock call (web)'); }
  mute(callId: number) { return Promise.resolve('Mock mute (web)'); }
  unmute(callId: number) { return Promise.resolve('Mock unmute (web)'); }
  hold(callId: number) { return Promise.resolve('Mock hold (web)'); }
  unhold(callId: number) { return Promise.resolve('Mock unhold (web)'); }
  hangup(callId: number) { return Promise.resolve('Mock hangup (web)'); }
  hangupAll() { return Promise.resolve('Mock hangupAll (web)'); }
  cleanup() { return Promise.resolve('Mock cleanup (web)'); }
  setTransportType(type: string) { return Promise.resolve('Mock setTransportType (web)'); }
  accept(callId: number) { return Promise.resolve('Mock accept (web)'); }
  reject(callId: number) { return Promise.resolve('Mock reject (web)'); }
  setIceEnabled(enabled: boolean) { return Promise.resolve('Mock setIceEnabled (web)'); }
  setInterfaceIp(ip: string) { return Promise.resolve('Mock setInterfaceIp (web)'); }
}

// Dynamic implementation that checks window.sip at call time
class PJSIPSipDynamic implements ISipApi {
  private sip(): ISipApi {
    if (typeof window !== 'undefined' && (window as any).sip) {
      return (window as any).sip;
    }
    return this.mock;
  }
  private mock: ISipApi = new PJSIPSipMock();

  initSIP() { return this.sip().initSIP(); }
  registerAccount(uri: string, user: string, pass: string) { return this.sip().registerAccount(uri, user, pass); }
  call(accId: number, dest: string) { return this.sip().call(accId, dest); }
  mute(callId: number) { return this.sip().mute(callId); }
  unmute(callId: number) { return this.sip().unmute(callId); }
  hold(callId: number) { return this.sip().hold(callId); }
  unhold(callId: number) { return this.sip().unhold(callId); }
  hangup(callId: number) { return this.sip().hangup(callId); }
  hangupAll() { return this.sip().hangupAll(); }
  cleanup() { return this.sip().cleanup(); }
  setTransportType(type: string) { return this.sip().setTransportType(type); }
  accept(callId: number) { return this.sip().accept(callId); }
  reject(callId: number) { return this.sip().reject(callId); }
  setIceEnabled(enabled: boolean) { return this.sip().setIceEnabled(enabled); }
  setInterfaceIp(ip: string) { return this.sip().setInterfaceIp(ip); }
}

export const PJSIPSip: ISipApi = new PJSIPSipDynamic(); 