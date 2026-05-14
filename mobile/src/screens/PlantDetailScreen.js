import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { SEVERITY_COLORS } from '../data/plants';

export default function PlantDetailScreen({ route, navigation }) {
  const { plant } = route.params;
  const { updatePlant, deletePlant } = useApp();
  const [name, setName] = useState(plant.name);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Name cannot be empty');
    setSaving(true);
    try {
      await updatePlant(plant.id, name.trim());
      navigation.goBack();
    } catch (e) {
      Alert.alert('Failed to update', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete "${plant.name}"? All its scans will also be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deletePlant(plant.id);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Failed to delete', e.message);
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{plant.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Plant type</Text>
          <Text style={styles.plantType}>{plant.plant_type_id}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: plant.status_color || '#9E9E9E' }]}>
          <Text style={styles.statusText}>{plant.status || 'Not scanned'}</Text>
        </View>
        {plant.last_scan && (
          <Text style={styles.lastScan}>Last scan: {new Date(plant.last_scan).toLocaleDateString()}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Plant name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter plant name"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>Save changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.scanBtn]} onPress={() => navigation.navigate('Scan', { plant })}>
        <Text style={styles.scanBtnText}>Scan this plant</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteBtn, deleting && { opacity: 0.6 }]} onPress={handleDelete} disabled={deleting}>
        {deleting
          ? <ActivityIndicator color="#F44336" />
          : <Text style={styles.deleteBtnText}>Delete plant</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, elevation: 1 },
  emoji: { fontSize: 52 },
  label: { fontSize: 11, color: '#999', marginBottom: 2 },
  plantType: { fontSize: 15, fontWeight: 'bold', color: '#1b4332', textTransform: 'capitalize' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  lastScan: { fontSize: 12, color: '#888' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#ddd', marginBottom: 16 },
  saveBtn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  scanBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1.5, borderColor: '#2d6a4f' },
  scanBtnText: { color: '#2d6a4f', fontWeight: 'bold', fontSize: 15 },
  deleteBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1.5, borderColor: '#F44336', marginTop: 8 },
  deleteBtnText: { color: '#F44336', fontWeight: 'bold', fontSize: 15 },
});
