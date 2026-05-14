import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { analyzePlant, uploadImage, uploadBase64Image, getAdvice } from '../services/inferenceApi';
import { SEVERITY_COLORS } from '../data/plants';

const STEPS = ['Uploading image...', 'Analyzing with AI...', 'Saving GradCAMs...', 'Saving scan...'];

export default function ScanScreen({ route }) {
  const { plant } = route.params;
  const { addScan } = useApp();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [result, setResult] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [modalUri, setModalUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed');
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!res.canceled) { setImage(res.assets[0].uri); setResult(null); }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed');
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) { setImage(res.assets[0].uri); setResult(null); }
  };

  const analyze = async () => {
    if (!image) return Alert.alert('Add a photo first');
    setLoading(true);
    try {
      setStep(STEPS[0]);
      const image_url = await uploadImage(image);

      setStep(STEPS[1]);
      const inference = await analyzePlant(image);

      setStep(STEPS[2]);
      const [cnnGradcam, effGradcam] = await Promise.all([
        uploadBase64Image(inference.cnn.gradcam),
        uploadBase64Image(inference.efficient.gradcam),
      ]);

      setStep(STEPS[3]);
      let adviceText = null;
      setLoadingAdvice(true);
      try {
        const adviceRes = await getAdvice(plant.name, inference.efficient.disease, inference.efficient.severity);
        adviceText = adviceRes.advice;
        setAdvice(adviceText);
      } catch (_) {
        setAdvice(null);
      } finally {
        setLoadingAdvice(false);
      }

      await addScan({
        plant_id: plant.id,
        plant_name: plant.name,
        emoji: plant.emoji,
        image_url,
        cnn_gradcam_url: cnnGradcam.url,
        eff_gradcam_url: effGradcam.url,
        cnn: { disease: inference.cnn.disease, severity: inference.cnn.severity, confidence: inference.cnn.confidence },
        efficient: { disease: inference.efficient.disease, severity: inference.efficient.severity, confidence: inference.efficient.confidence },
        advice: adviceText,
      });

      setResult({ image_url, cnn: inference.cnn, efficient: inference.efficient });
    } catch (e) {
      Alert.alert('Analysis failed', e.message);
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const openModal = (uri) => setModalUri(uri);
  const closeModal = () => setModalUri(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Modal visible={!!modalUri} transparent animationType="fade" onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeModal}>
          <Image source={{ uri: modalUri }} style={styles.modalImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>

      <View style={styles.plantHeader}>
        <Text style={{ fontSize: 40 }}>{plant.emoji}</Text>
        <Text style={styles.plantName}>{plant.name}</Text>
      </View>

      <TouchableOpacity style={styles.imageBox} onPress={result ? () => openModal(image) : pickImage}>
        {image
          ? <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          : <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 44 }}>🍃</Text>
              <Text style={{ color: '#888', marginTop: 8 }}>Tap to pick a photo</Text>
            </View>}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <TouchableOpacity style={styles.smallBtn} onPress={pickImage}>
          <Text style={styles.smallBtnText}>📁 Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={takePhoto}>
          <Text style={styles.smallBtnText}>📷 Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.analyzeBtn, loading && { opacity: 0.6 }]} onPress={analyze} disabled={loading}>
        {loading
          ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.analyzeBtnText}>{step}</Text>
            </View>
          : <Text style={styles.analyzeBtnText}>🔍 Analyze</Text>}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Results</Text>

          <Text style={styles.sectionLabel}>Visual Explanation (GradCAM)</Text>
          <View style={styles.gradcamRow}>
            <TouchableOpacity style={styles.gradcamItem} onPress={() => openModal(result.image_url)}>
              <Image source={{ uri: result.image_url }} style={styles.gradcamImg} resizeMode="cover" />
              <Text style={styles.gradcamLabel}>Original</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gradcamItem} onPress={() => openModal(`data:image/jpeg;base64,${result.cnn.gradcam}`)}>
              <Image source={{ uri: `data:image/jpeg;base64,${result.cnn.gradcam}` }} style={styles.gradcamImg} resizeMode="cover" />
              <Text style={styles.gradcamLabel}>CNN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gradcamItem} onPress={() => openModal(`data:image/jpeg;base64,${result.efficient.gradcam}`)}>
              <Image source={{ uri: `data:image/jpeg;base64,${result.efficient.gradcam}` }} style={styles.gradcamImg} resizeMode="cover" />
              <Text style={styles.gradcamLabel}>EffNet</Text>
            </TouchableOpacity>
          </View>

          {[
            { label: 'Custom CNN', data: result.cnn, color: '#2d6a4f' },
            { label: 'EfficientNet-B4', data: result.efficient, color: '#1565C0' },
          ].map(m => (
            <View key={m.label} style={[styles.modelBlock, { borderLeftColor: m.color }]}>
              <Text style={{ fontWeight: 'bold', color: m.color, marginBottom: 6 }}>{m.label}</Text>
              <Text style={styles.resultRow}>Disease: <Text style={styles.bold}>{m.data.disease}</Text></Text>
              <Text style={styles.resultRow}>Severity: <Text style={[styles.bold, { color: SEVERITY_COLORS[m.data.severity] }]}>{m.data.severity}</Text></Text>
              <Text style={styles.resultRow}>Confidence: <Text style={styles.bold}>{(m.data.confidence * 100).toFixed(1)}%</Text></Text>
            </View>
          ))}

          <View style={styles.adviceBox}>
            <Text style={styles.adviceTitle}>AI Advice</Text>
            {loadingAdvice
              ? <ActivityIndicator color="#2d6a4f" style={{ marginTop: 8 }} />
              : advice
                ? <Text style={styles.adviceText}>{advice}</Text>
                : <Text style={styles.adviceText}>No advice available.</Text>}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  plantHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  plantName: { fontSize: 20, fontWeight: 'bold', color: '#1b4332' },
  imageBox: { height: 200, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#ccc', borderStyle: 'dashed' },
  smallBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  smallBtnText: { fontWeight: '600', color: '#444' },
  analyzeBtn: { backgroundColor: '#2d6a4f', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  analyzeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: { backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#1b4332', marginBottom: 14 },
  sectionLabel: { fontSize: 13, color: '#888', marginBottom: 10 },
  gradcamRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  gradcamItem: { flex: 1, alignItems: 'center' },
  gradcamImg: { width: '100%', aspectRatio: 1, borderRadius: 10 },
  gradcamLabel: { fontSize: 11, color: '#555', marginTop: 4, fontWeight: '600' },
  modelBlock: { borderLeftWidth: 3, paddingLeft: 12, marginBottom: 14 },
  resultRow: { fontSize: 14, color: '#444', marginBottom: 3 },
  bold: { fontWeight: 'bold', color: '#1b4332' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '95%', height: '80%' },
  adviceBox: { backgroundColor: '#f0f7ee', borderRadius: 10, padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#b7e4c7' },
  adviceTitle: { fontSize: 14, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 8 },
  adviceText: { fontSize: 13, color: '#333', lineHeight: 20 },
});
