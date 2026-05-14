import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function MyPlantsScreen({ navigation }) {
  const { myPlants } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered = myPlants.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Healthy') return p.status?.toLowerCase().includes('healthy');
    if (filter === 'Needs attention') return p.status && !p.status.toLowerCase().includes('healthy') && p.status !== 'Not scanned';
    if (filter === 'Not scanned') return !p.status || p.status === 'Not scanned';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {['All', 'Healthy', 'Needs attention', 'Not scanned'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No plants found.</Text>}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddPlant')}>
            <Text style={styles.addBtnText}>+ Add a new plant</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PlantDetail', { plant: item })}>
            <Text style={{ fontSize: 38, marginRight: 14 }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.last_scan ? `Last scan: ${new Date(item.last_scan).toLocaleDateString()}` : 'Never scanned'}</Text>
            </View>
            <Text style={[styles.status, { color: item.status_color || '#9E9E9E' }]}>{item.status || 'Not scanned'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, paddingBottom: 0 },
  chip: { borderRadius: 20, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' },
  chipText: { fontSize: 12, color: '#666' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#1b4332' },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  status: { fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});
