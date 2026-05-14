import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirm)
      return Alert.alert('Please fill in all fields');
    if (password !== confirm)
      return Alert.alert('Passwords do not match');
    if (password.length < 8)
      return Alert.alert('Password must be at least 8 characters');

    setLoading(true);
    try {
      await register(firstName, lastName, email, password, confirm);
    } catch (e) {
      Alert.alert('Registration failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>🌱</Text>
      <Text style={styles.title}>Create account</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="First name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Last name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
      </View>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm password" placeholderTextColor="#aaa" value={confirm} onChangeText={setConfirm} secureTextEntry />

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  content: { justifyContent: 'center', padding: 24, flexGrow: 1 },
  logo: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2d6a4f', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#222', marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#888', fontSize: 14 },
  linkBold: { color: '#2d6a4f', fontWeight: 'bold' },
});
