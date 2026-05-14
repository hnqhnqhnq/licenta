import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { PLANTS } from '../data/plants';

export default function AddPlantScreen({ navigation }) {
  const { addPlant } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = PLANTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!selected) return Alert.alert('Select a plant first');
    setLoading(true);
    try {
      await addPlant(selected, customName || `My ${selected.name}`);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Failed to add plant', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search plants..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 10 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const selected_ = selected?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, selected_ && styles.cardSelected]}
              onPress={() => { setSelected(item); setCustomName(`My ${item.name}`); }}
            >
              <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
              <Text style={[styles.cardName, selected_ && { color: '#2d6a4f' }]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {selected && (
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Name your plant</Text>
          <TextInput
            style={styles.nameInput}
            value={customName}
            onChangeText={setCustomName}
            placeholder={`My ${selected.name}`}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={[styles.addBtn, loading && { opacity: 0.6 }]} onPress={handleAdd} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.addBtnText}>{selected.emoji} Add to my garden</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  search: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#ddd' },
  card: { flex: 1, margin: 6, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', elevation: 1, borderWidth: 2, borderColor: 'transparent' },
  cardSelected: { borderColor: '#2d6a4f', backgroundColor: '#e8f5e9' },
  cardName: { fontSize: 11, color: '#444', textAlign: 'center', marginTop: 4 },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  footerLabel: { fontSize: 13, color: '#888', marginBottom: 8 },
  nameInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, fontSize: 15, color: '#333', marginBottom: 12 },
  addBtn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 14, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
