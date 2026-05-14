import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { user, myPlants, scanHistory } = useApp();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hi, {user?.first_name}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{myPlants.length}</Text>
          <Text style={styles.statLabel}>Plants</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{scanHistory.length}</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{myPlants.filter(p => p.status && p.status !== 'Not scanned' && !p.status.toLowerCase().includes('healthy')).length}</Text>
          <Text style={styles.statLabel}>Attention</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Plants</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {myPlants.map(p => (
            <TouchableOpacity key={p.id} style={styles.plantCard} onPress={() => navigation.navigate('My Plants')}>
              <Text style={{ fontSize: 30 }}>{p.emoji}</Text>
              <Text style={styles.plantName}>{p.name}</Text>
              <Text style={[styles.plantStatus, { color: p.status_color || '#9E9E9E' }]}>{p.status || 'Not scanned'}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addCard} onPress={() => navigation.navigate('AddPlant')}>
            <Text style={{ fontSize: 24, color: '#2d6a4f' }}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        {scanHistory.length === 0
          ? <Text style={styles.empty}>No scans yet.</Text>
          : scanHistory.slice(0, 3).map(s => (
            <TouchableOpacity key={s.id} style={styles.scanCard} onPress={() => navigation.navigate('ScanDetail', { scan: s })}>
              <Text style={{ fontSize: 26, marginRight: 10 }}>{s.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.scanPlant}>{s.plant_name}</Text>
                <Text style={styles.scanDisease}>{s.disease}</Text>
              </View>
              <Text style={styles.scanDate}>{new Date(s.scanned_at).toLocaleDateString()}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee', padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1b4332', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#2d6a4f' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1b4332', marginBottom: 10 },
  plantCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginRight: 10, alignItems: 'center', width: 90, elevation: 1 },
  plantName: { fontSize: 11, color: '#333', textAlign: 'center', marginTop: 4 },
  plantStatus: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  addCard: { backgroundColor: '#e8f5e9', borderRadius: 12, width: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#b7e4c7', borderStyle: 'dashed' },
  scanCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8, elevation: 1 },
  scanPlant: { fontWeight: 'bold', color: '#1b4332' },
  scanDisease: { fontSize: 13, color: '#555', marginTop: 2 },
  scanDate: { fontSize: 11, color: '#aaa' },
  empty: { color: '#aaa', textAlign: 'center', padding: 20 },
});
