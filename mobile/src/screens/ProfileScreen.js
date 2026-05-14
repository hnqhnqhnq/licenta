import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useApp } from '../context/AppContext';

const MODELS = [
  { key: 'cnn', name: 'Custom CNN', color: '#2d6a4f', colorLight: '#b7e4c7' },
  { key: 'efficient', name: 'EfficientNet-B4', color: '#1565C0', colorLight: '#bbdefb' },
];

function avgConfidence(scans, key) {
  if (!scans.length) return 0;
  const sum = scans.reduce((acc, s) => acc + (s[key]?.confidence ?? 0), 0);
  return parseFloat(((sum / scans.length) * 100).toFixed(1));
}

export default function ProfileScreen() {
  const { user, logout, myPlants, scanHistory } = useApp();
  const healthy = scanHistory.filter(s => s.disease === 'Healthy').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
      <View style={styles.avatarSection}>
        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Plants', val: myPlants.length },
          { label: 'Scans', val: scanHistory.length },
          { label: 'Healthy', val: healthy },
          { label: 'Diseases', val: scanHistory.length - healthy },
        ].map((s, i, arr) => (
          <React.Fragment key={s.label}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.statNum}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={{ width: 1, backgroundColor: '#eee' }} />}
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Model Confidence</Text>
      {MODELS.map(m => {
        const avg = avgConfidence(scanHistory, m.key);
        const label = scanHistory.length ? `${avg}%` : 'No scans';
        return (
          <View key={m.name} style={styles.card}>
            <Text style={{ fontWeight: 'bold', color: m.color, marginBottom: 12 }}>{m.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <PieChart
                data={[{ value: avg || 1, color: avg ? m.color : m.colorLight }, { value: avg ? 100 - avg : 0, color: m.colorLight }]}
                donut radius={55} innerRadius={36}
                centerLabelComponent={() => <Text style={{ fontWeight: 'bold', color: m.color, fontSize: 13 }}>{label}</Text>}
                showText={false}
              />
              <View>
                <Text style={styles.accText}>Avg confidence: <Text style={{ color: m.color, fontWeight: 'bold' }}>{label}</Text></Text>
                <Text style={styles.accText}>Based on: <Text style={{ fontWeight: 'bold' }}>{scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''}</Text></Text>
              </View>
            </View>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Account Info</Text>
      <View style={styles.card}>
        <Text style={styles.infoRow}>👤 {user?.first_name} {user?.last_name}</Text>
        <Text style={styles.infoRow}>📧 {user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={{ color: '#F44336', fontWeight: 'bold', fontSize: 15 }}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1b4332', marginTop: 8 },
  email: { fontSize: 13, color: '#74a98a', marginTop: 4 },
  statsRow: { backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, elevation: 1 },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#2d6a4f' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  accText: { fontSize: 13, color: '#444', marginBottom: 4 },
  infoRow: { fontSize: 14, color: '#333', marginBottom: 8 },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#F44336', marginTop: 8 },
});
