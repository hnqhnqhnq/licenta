import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { SEVERITY_COLORS } from '../data/plants';

const { width, height } = Dimensions.get('window');

export default function ScanDetailScreen({ route }) {
  const { scan } = route.params;
  const cnn = scan.cnn;
  const eff = scan.efficient;
  const date = scan.scanned_at ? new Date(scan.scanned_at).toLocaleDateString() : scan.date;
  const [previewUri, setPreviewUri] = useState(null);

  const images = [
    scan.image_url && { uri: scan.image_url, label: 'Original' },
    scan.cnn_gradcam_url && { uri: scan.cnn_gradcam_url, label: 'CNN GradCAM' },
    scan.eff_gradcam_url && { uri: scan.eff_gradcam_url, label: 'EfficientNet GradCAM' },
  ].filter(Boolean);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={{ fontSize: 40, marginRight: 12 }}>{scan.emoji}</Text>
          <View>
            <Text style={styles.plantName}>{scan.plant_name || scan.plantName}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>

        {images.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Visual Explanation (GradCAM)</Text>
            <Text style={styles.hint}>Tap an image to enlarge</Text>
            <View style={styles.gradcamRow}>
              {images.map(img => (
                <TouchableOpacity key={img.uri} style={styles.gradcamItem} onPress={() => setPreviewUri(img.uri)}>
                  <Image source={{ uri: img.uri }} style={styles.gradcamImg} resizeMode="cover" />
                  <Text style={styles.gradcamLabel}>{img.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Model Predictions</Text>

        {[
          { label: 'Custom CNN', data: cnn, color: '#2d6a4f' },
          { label: 'EfficientNet-B4', data: eff, color: '#1565C0' },
        ].map(m => (
          <View key={m.label} style={[styles.modelCard, { borderLeftColor: m.color }]}>
            <Text style={[styles.modelLabel, { color: m.color }]}>{m.label}</Text>
            <Text style={styles.resultRow}>Disease: <Text style={styles.bold}>{m.data.disease}</Text></Text>
            <Text style={styles.resultRow}>Severity: <Text style={[styles.bold, { color: SEVERITY_COLORS[m.data.severity] }]}>{m.data.severity}</Text></Text>
            <Text style={styles.resultRow}>Confidence: <Text style={styles.bold}>{(m.data.confidence * 100).toFixed(1)}%</Text></Text>
          </View>
        ))}

        <View style={styles.agreementCard}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{cnn.disease === eff.disease ? '✅' : '⚠️'}</Text>
          <Text style={{ color: '#1b4332', fontWeight: 'bold', flex: 1 }}>
            {cnn.disease === eff.disease
              ? `Both models agree: ${cnn.disease}`
              : `Models disagree — CNN: ${cnn.disease}, EfficientNet: ${eff.disease}`}
          </Text>
        </View>

        {scan.advice && (
          <View style={styles.adviceBox}>
            <Text style={styles.adviceTitle}>AI Advice</Text>
            <Text style={styles.adviceText}>{scan.advice}</Text>
          </View>
        )}

      </ScrollView>

      <Modal visible={!!previewUri} transparent animationType="fade" onRequestClose={() => setPreviewUri(null)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setPreviewUri(null)}>
          <Image source={{ uri: previewUri }} style={styles.modalImage} resizeMode="contain" />
          <Text style={styles.modalHint}>Tap anywhere to close</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ee' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 1 },
  plantName: { fontSize: 18, fontWeight: 'bold', color: '#1b4332' },
  date: { fontSize: 12, color: '#74a98a', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1b4332', marginBottom: 4 },
  hint: { fontSize: 11, color: '#aaa', marginBottom: 10 },
  gradcamRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  gradcamItem: { flex: 1, alignItems: 'center' },
  gradcamImg: { width: '100%', aspectRatio: 1, borderRadius: 10 },
  gradcamLabel: { fontSize: 11, color: '#555', marginTop: 4, fontWeight: '600', textAlign: 'center' },
  modelCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1, borderLeftWidth: 3 },
  modelLabel: { fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  resultRow: { fontSize: 14, color: '#555', marginBottom: 3 },
  bold: { fontWeight: 'bold', color: '#1b4332' },
  agreementCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', elevation: 1, marginBottom: 12 },
  adviceBox: { backgroundColor: '#f0f7ee', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#b7e4c7' },
  adviceTitle: { fontSize: 14, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 8 },
  adviceText: { fontSize: 13, color: '#333', lineHeight: 20 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: width, height: height * 0.75 },
  modalHint: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 16 },
});
