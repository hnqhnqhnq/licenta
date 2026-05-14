import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Please fill in all fields');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌿</Text>
      <Text style={styles.title}>PlantDoc</Text>
      <Text style={styles.subtitle}>Bachelor's Thesis project for detecting plant diseases instantly</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log in</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2d6a4f', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#74a98a', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#222', marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#888', fontSize: 14 },
  linkBold: { color: '#2d6a4f', fontWeight: 'bold' },
});
