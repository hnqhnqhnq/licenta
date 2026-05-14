import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useApp } from '../context/AppContext';
import { SEVERITY_COLORS } from '../data/plants';

const SEVERITIES = ['All', 'Healthy', 'Mild', 'Moderate', 'Severe'];

export default function HistoryScreen({ navigation }) {
  const { scanHistory } = useApp();
  const [severity, setSeverity] = useState('All');
  const [minConfidence, setMinConfidence] = useState(0);

  const filtered = scanHistory.filter(s => {
    if (severity !== 'All' && s.severity !== severity) return false;
    if (s.confidence < minConfidence / 100) return false;
    return true;
  });

  return (
    <FlatList
      style={{ backgroundColor: '#f0f7ee' }}
      data={filtered}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View>
          <Text style={styles.heading}>Scan History</Text>

          <View style={styles.filterRow}>
            {SEVERITIES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, severity === s && styles.chipActive]}
                onPress={() => setSeverity(s)}
              >
                <Text style={[styles.chipText, severity === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderBox}>
            <Text style={styles.sliderLabel}>
              Min confidence: <Text style={{ color: '#2d6a4f', fontWeight: 'bold' }}>{minConfidence}%</Text>
            </Text>
            <Slider
              style={{ width: '100%', height: 36 }}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={minConfidence}
              onValueChange={setMinConfidence}
              minimumTrackTintColor="#2d6a4f"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#2d6a4f"
            />
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>No scans match your filters.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ScanDetail', { scan: item })}>
          <Text style={{ fontSize: 34, marginRight: 12 }}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.plant}>{item.plant_name}</Text>
            <Text style={styles.disease}>{item.disease}</Text>
            <Text style={styles.meta}>{new Date(item.scanned_at).toLocaleDateString()} · {(item.confidence * 100).toFixed(0)}% confidence</Text>
          </View>
          <Text style={[styles.severity, { color: SEVERITY_COLORS[item.severity] || '#888' }]}>{item.severity}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: 'bold', color: '#1b4332', marginBottom: 12 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderRadius: 20, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' },
  chipText: { fontSize: 12, color: '#666' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  sliderBox: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, elevation: 1 },
  sliderLabel: { fontSize: 13, color: '#555', marginBottom: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  plant: { fontWeight: 'bold', color: '#1b4332', fontSize: 14 },
  disease: { color: '#444', fontSize: 13, marginTop: 2 },
  meta: { color: '#999', fontSize: 11, marginTop: 2 },
  severity: { fontWeight: 'bold', fontSize: 13 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});
