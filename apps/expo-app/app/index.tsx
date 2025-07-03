import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, ScrollView, StyleSheet, Platform } from 'react-native';

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

  return (
    <ScrollView 
      style={styles.outerContainer} 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>SIP POC UI (Expo)</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transport</Text>
        <View style={styles.row}>
          <Button title="UDP" onPress={() => { setTransport('udp'); logAction('Transport set to UDP'); }} color={transport === 'udp' ? '#007AFF' : '#aaa'} />
          <Button title="TCP" onPress={() => { setTransport('tcp'); logAction('Transport set to TCP'); }} color={transport === 'tcp' ? '#007AFF' : '#aaa'} />
          <Button title="TLS" onPress={() => { setTransport('tls'); logAction('Transport set to TLS'); }} color={transport === 'tls' ? '#007AFF' : '#aaa'} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>ICE Enabled</Text>
          <Switch value={iceEnabled} onValueChange={(v) => { setIceEnabled(v); logAction(`ICE set to ${v}`); }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interface IP</Text>
          <TextInput style={styles.input} value={interfaceIp} onChangeText={setInterfaceIp} placeholder="Optional IP address" />
        </View>
         <Button title="Set Config" onPress={() => logAction(`Config set: ICE=${iceEnabled}, IP=${interfaceIp || 'Default'}`)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration</Text>
        <TextInput style={styles.input} value={regUri} onChangeText={setRegUri} placeholder="sip:user@domain.com" autoCapitalize="none" />
        <TextInput style={styles.input} value={regUser} onChangeText={setRegUser} placeholder="Username" autoCapitalize="none" />
        <TextInput style={styles.input} value={regPass} onChangeText={setRegPass} placeholder="Password" secureTextEntry />
        <Button title="Register" onPress={() => logAction(`Registering ${regUser}`)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Make a Call</Text>
        <TextInput style={styles.input} value={dest} onChangeText={setDest} placeholder="sip:destination@domain.com" autoCapitalize="none" />
        <TextInput style={styles.input} value={accId} onChangeText={setAccId} placeholder="Account ID (e.g., 0)" keyboardType="numeric" />
        <Button title="Call" onPress={() => logAction(`Calling ${dest}`)} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Call Control</Text>
        <TextInput style={styles.input} value={callId} onChangeText={setCallId} placeholder="Active Call ID" keyboardType="numeric" />
        <View style={styles.row}>
            <Button title="Accept" onPress={() => logAction(`Accepting call ${callId}`)} />
            <Button title="Reject" onPress={() => logAction(`Rejecting call ${callId}`)} />
            <Button title="Hangup" onPress={() => logAction(`Hanging up call ${callId}`)} />
        </View>
        <View style={styles.row}>
            <Button title="Hold" onPress={() => logAction(`Holding call ${callId}`)} />
            <Button title="Unhold" onPress={() => logAction(`Unholding call ${callId}`)} />
            <Button title="Mute" onPress={() => logAction(`Muting call ${callId}`)} />
            <Button title="Unmute" onPress={() => logAction(`Unmuting call ${callId}`)} />
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
