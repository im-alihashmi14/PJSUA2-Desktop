import { PJSIPSip } from '@/lib/PJSIPSip';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Switch, ScrollView, StyleSheet, Platform, Image } from 'react-native';

declare global {
  interface Window {
    sip?: any;
  }
}

export default function HomeScreen() {
  // State for all controls
  const [transport, setTransport] = useState('udp');
  const [iceEnabled, setIceEnabled] = useState(false);
  const [interfaceIp, setInterfaceIp] = useState('');
  const [regUri, setRegUri] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [accId, setAccId] = useState('');
  const [dest, setDest] = useState('');
  const [callId, setCallId] = useState('');
  const [log, setLog] = useState<string[]>([]);

  // UI handlers (no SIP logic yet)
  const logAction = (msg: string) => setLog(l => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l]);

  useEffect(() => {
    // Log if window.sip is available
    console.log('window.sip:', typeof window !== 'undefined' ? window.sip : 'window is undefined');
  }, []);

  return (
    <ScrollView
      style={styles.outerContainer}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.title}>SIP POC UI - (Expo)</Text>
        <Image source={require('../assets/images/react-logo.png')} style={{ width: 100, height: 100 }} />
        <Button title='Test SIP' onPress={async () => {
          try {
            const result = await PJSIPSip.initSIP({});
            console.log('SIP init result:', result);
            logAction('SIP init result: ' + JSON.stringify(result));
          } catch (err) {
            console.error('SIP init error:', err);
            logAction('SIP init error: ' + err);
          }
        }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transport</Text>
        <View style={styles.row}>
          <Button title="UDP" onPress={async () => {
            setTransport('udp');
            try {
              const result = await PJSIPSip.setTransportType('udp');
              logAction('Transport set to UDP: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Transport set error: ' + err);
            }
          }} color={transport === 'udp' ? '#007AFF' : '#aaa'} />
          <Button title="TCP" onPress={async () => {
            setTransport('tcp');
            try {
              const result = await PJSIPSip.setTransportType('tcp');
              logAction('Transport set to TCP: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Transport set error: ' + err);
            }
          }} color={transport === 'tcp' ? '#007AFF' : '#aaa'} />
          <Button title="TLS" onPress={async () => {
            setTransport('tls');
            try {
              const result = await PJSIPSip.setTransportType('tls');
              logAction('Transport set to TLS: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Transport set error: ' + err);
            }
          }} color={transport === 'tls' ? '#007AFF' : '#aaa'} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>ICE Enabled</Text>
          <Switch value={iceEnabled} onValueChange={async (v) => {
            setIceEnabled(v);
            try {
              const result = await PJSIPSip.setIceEnabled(v);
              logAction('ICE set to ' + v + ': ' + JSON.stringify(result));
            } catch (err) {
              logAction('ICE set error: ' + err);
            }
          }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interface IP</Text>
          <TextInput style={styles.input} value={interfaceIp} onChangeText={setInterfaceIp} placeholder="Optional IP address" />
        </View>
        <Button title="Set Config" onPress={async () => {
          try {
            const result = await PJSIPSip.setInterfaceIp(interfaceIp);
            logAction('Interface IP set: ' + JSON.stringify(result));
          } catch (err) {
            logAction('Set IP error: ' + err);
          }
        }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration</Text>
        <TextInput style={styles.input} value={regUri} onChangeText={setRegUri} placeholder="sip:user@domain.com" autoCapitalize="none" />
        <TextInput style={styles.input} value={regUser} onChangeText={setRegUser} placeholder="Username" autoCapitalize="none" />
        <TextInput style={styles.input} value={regPass} onChangeText={setRegPass} placeholder="Password" secureTextEntry />
        <Button title="Register" onPress={async () => {
          try {
            const result = await PJSIPSip.registerAccount(regUri, regUser, regPass);
            logAction('Register result: ' + JSON.stringify(result));
          } catch (err) {
            logAction('Register error: ' + err);
          }
        }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Make a Call</Text>
        <TextInput style={styles.input} value={dest} onChangeText={setDest} placeholder="sip:destination@domain.com" autoCapitalize="none" />
        <TextInput style={styles.input} value={accId} onChangeText={setAccId} placeholder="Account ID (e.g., 0)" keyboardType="numeric" />
        <Button title="Call" onPress={async () => {
          try {
            const result = await PJSIPSip.call(Number(accId), dest);
            logAction('Call result: ' + JSON.stringify(result));
          } catch (err) {
            logAction('Call error: ' + err);
          }
        }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Call Control</Text>
        <TextInput style={styles.input} value={callId} onChangeText={setCallId} placeholder="Active Call ID" keyboardType="numeric" />
        <View style={styles.row}>
          <Button title="Accept" onPress={async () => {
            try {
              const result = await PJSIPSip.accept(Number(callId));
              logAction('Accept result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Accept error: ' + err);
            }
          }} />
          <Button title="Reject" onPress={async () => {
            try {
              const result = await PJSIPSip.reject(Number(callId));
              logAction('Reject result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Reject error: ' + err);
            }
          }} />
          <Button title="Hangup" onPress={async () => {
            try {
              const result = await PJSIPSip.hangup(Number(callId));
              logAction('Hangup result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Hangup error: ' + err);
            }
          }} />
        </View>
        <View style={styles.row}>
          <Button title="Hold" onPress={async () => {
            try {
              const result = await PJSIPSip.hold(Number(callId));
              logAction('Hold result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Hold error: ' + err);
            }
          }} />
          <Button title="Unhold" onPress={async () => {
            try {
              const result = await PJSIPSip.unhold(Number(callId));
              logAction('Unhold result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Unhold error: ' + err);
            }
          }} />
          <Button title="Mute" onPress={async () => {
            try {
              const result = await PJSIPSip.mute(Number(callId));
              logAction('Mute result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Mute error: ' + err);
            }
          }} />
          <Button title="Unmute" onPress={async () => {
            try {
              const result = await PJSIPSip.unmute(Number(callId));
              logAction('Unmute result: ' + JSON.stringify(result));
            } catch (err) {
              logAction('Unmute error: ' + err);
            }
          }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log</Text>
        <ScrollView style={styles.logBox} nestedScrollEnabled>
          {log.map((l, i) => <Text key={i} style={styles.logLine}>{l}</Text>)}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'stretch',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  logBox: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    minHeight: 150,
    maxHeight: 200,
  },
  logLine: {
    color: '#eee',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
