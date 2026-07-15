import { Buffer } from 'buffer';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform
} from 'react-native';
import Svg, { Path } from "react-native-svg";

import Clouds from "../components/Clouds";
import Petals from "../components/Petals";
import CherryBlossomTree from '../components/trees';
import { fetchTasks, submitProof } from '../data/taskHandler';
import { Task } from '../types/tasks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// REPLACE WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL_HERE";

const flowers = [
  { left: 280, top: 300, color: "#FF7EB6" },
  { left: 90, top: 460, color: "#FFD966" },
  { left: 290, top: 740, color: "#CBA6F7" },
  { left: 80, top: 980, color: "#FF8FAB" },
  { left: 290, top: 1320, color: "#FFD966" },
  { left: 120, top: 1650, color: "#FFB3C6" },
];

const bushes = [
  { left: 250, top: 900 },
  { left: 30, top: 620 },
  { left: 290, top: 1450 },
];

const trees = [
  { left: -20, top: 80, scale: 1.1 },
  { left: 290, top: 320, scale: 1.3 },
  { left: -30, top: 650, scale: 1.15 },
  { left: 300, top: 980, scale: 1.25 },
  { left: -10, top: 1350, scale: 1.2 },
  { left: 290, top: 1700, scale: 1.35 },
];

const getCustomIcon = (type: string) => {
  switch (type) {
    case "photo": return "📸";
    case "audio": return "🎵";
    case "sudoku": return "🧩";
    case "movie": return "🎬";
    case "decode": return "🔍";
    case "status": return "📱";
    case "memory": return "💭";
    case "location": return "📍";
    case "locker": return "🔐";
    default: return "🌟";
  }
};

export default function Map() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);
  const [proofInput, setProofInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modern Audio recording initialization
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);

  // Dynamic calculation for progress paths
  const currentActiveId = (activeTasks || []).find(t => !t.completed)?.id || 16;

  // ==========================================
  // ACTION 1: FETCH TASKS ON COMPONENT MOUNT
  // ==========================================
  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await fetchTasks();

      // Ensure we only set state if tasks is a valid array
      if (Array.isArray(tasks)) {
        setActiveTasks(tasks);
      } else {
        console.warn("fetchTasks did not return an array. Falling back to empty map.");
        setActiveTasks([]);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setActiveTasks([]); // Fallback on hard catch to prevent crash
      alert("Network Error: Could not load adventure map tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Serpentine map node calculation coordinates
  const getNodeCenter = (index: number) => {
    const rowHeight = 150;
    const startY = 120;
    const xAmplitude = (SCREEN_WIDTH - 120) / 2;
    const centerX = SCREEN_WIDTH / 2;

    const x = centerX + Math.sin(index * 1.2) * xAmplitude;
    const y = startY + index * rowHeight;

    return { x, y };
  };

  // Helper to generate the path curve
  const getPathData = () => {
    if (activeTasks.length < 2) return "";
    const coords = activeTasks.map((_, idx) => getNodeCenter(idx));
    let d = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p0 = coords[i - 1] || p1;
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setProofInput(result.assets[0].uri);
    }
  };

  const handleStartRecording = async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== 'granted') {
        alert("Microphone permission required!");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      await recorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      await recorder.stop();
      const uri = recorder.uri;
      setProofInput(uri || '');
      alert("🎵 Audio clip recorded successfully!");
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  // ==========================================
  // ACTIONS 2 & 3: UPDATE SHEET STATUS + UPLOAD PROOF
  // ==========================================
  const handleProofSubmission = async () => {
    if (selectedTask?.type === "crossword") {
      router.push(selectedTask.screen);
      return;
    }

    if (!proofInput.trim()) {
      alert("Please provide proof (media upload or text response) before submitting!");
      return;
    }

    try {
      setSubmitting(true);

      let fileBase64 = "";
      // Fixed: Corrected template literal syntax from '{selectedTask.id}' to '${selectedTask.id}'
      let fileName = `${selectedTask.id}_proof`;
      let fileMimeType = "text/plain";

      // 1. Establish file naming and content types based on task type
      if (selectedTask.type === "photo") {
        fileMimeType = "image/jpeg";
        fileName += ".jpg";
      } else if (selectedTask.type === "audio") {
        fileMimeType = "audio/m4a";
        fileName += ".m4a";
      } else {
        fileMimeType = "text/plain";
        fileName += ".txt";
      }

      // 2. Cross-Platform Extraction Layer
      if (Platform.OS === 'web') {
        // --- WEB STRATEGY ---
        // proofInput holds a web blob URL string (e.g., "blob:http://...")
        // We download it back to a local memory blob to read it safely
        const response = await fetch(proofInput);
        const blob = await response.blob();

        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1] || result;
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      else {
        // --- NATIVE STRATEGY (iOS/Android - SDK 54 compliant) ---
        // on Native devices, proofInput holds the local file system path string
        const file = new File(proofInput);
        fileBase64 = await file.base64();
      }

      // 3. Dispatch data payload to Google Apps Script
      const result = await submitProof(selectedTask.id, fileBase64, fileMimeType, fileName);

      // 4. Update local state on success
      if (result.status === "success") {
        const updated = activeTasks.map(t =>
          t.id === selectedTask.id ? { ...t, completed: true } : t
        );
        setActiveTasks(updated);
        setSelectedTask({} as Task);
        setProofInput('');
        alert("✨ Evidence uploaded and sheet updated successfully!");
      } else {
        alert(`Error from Script: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit proof. Check connection or file type compatibility.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E05375" />
        <Text style={{ marginTop: 12, color: '#4A2840', fontWeight: 'bold' }}>Downloading Adventure Map...</Text>
      </View>
    );
  }

  const dPath = getPathData();

  return (
    <LinearGradient
      colors={["#AEE7FF", "#DFF6FF", "#FFF3D6", "#FFF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.mainContainer}
    >
      <Clouds />
      <Petals />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌸 Birthday Adventure 🌸</Text>
        <Text style={styles.headerSubtitle}>Every task brings you closer to your surprise 💖</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ height: activeTasks.length * 150 + 200 }}>
          {/* SVG CURVES TRAIL */}
          <Svg width="100%" height="100%" style={styles.svg}>
            <Path d={dPath} stroke="#C8A042" strokeWidth={58} fill="none" strokeLinecap="round" />
            <Path d={dPath} stroke="#E8C35C" strokeWidth={50} fill="none" strokeLinecap="round" />
            <Path d={dPath} stroke="#FFE69A" strokeWidth={34} fill="none" strokeLinecap="round" />
          </Svg>

          {/* CHERRY BLOSSOM TREES */}
          {trees.map((tree, index) => (
            <CherryBlossomTree
              key={`tree-${index}`}
              left={tree.left}
              top={tree.top}
              scale={tree.scale}
            />
          ))}

          {/* DECORATIVE SMALL FLOWERS */}
          {flowers.map((flower, index) => (
            <View
              key={`flower-decor-${index}`}
              style={[styles.flowerDecoration, { left: flower.left, top: flower.top }]}
            >
              <View style={[styles.flowerCenter, { backgroundColor: flower.color }]} />
            </View>
          ))}

          {/* BUSHES */}
          {bushes.map((bush, index) => (
            <View
              key={`bush-${index}`}
              style={[styles.bush, { left: bush.left, top: bush.top }]}
            />
          ))}

          {/* FLOWER TRAIL NODES */}
          {activeTasks.map((task, index) => {
            const { x, y } = getNodeCenter(index);
            const isCompleted = task.completed;
            const isActive = task.id === currentActiveId;
            const isLocked = task.id > currentActiveId;
            const iconEmoji = getCustomIcon(task.type);

            return (
              <Pressable
                key={task.id}
                disabled={isLocked}
                onPress={() => setSelectedTask({ ...task, emoji: iconEmoji })}
                style={[
                  styles.flowerContainer,
                  { left: x - 42, top: y - 42 },
                  isLocked && { opacity: 0.55 }
                ]}
              >
                {/* Flower Petal Graphics */}
                <View style={[styles.petal, styles.topPetal]} />
                <View style={[styles.petal, styles.bottomPetal]} />
                <View style={[styles.petal, styles.leftPetal]} />
                <View style={[styles.petal, styles.rightPetal]} />
                <View style={[styles.smallPetal, { top: 8, left: 8 }]} />
                <View style={[styles.smallPetal, { top: 8, right: 8 }]} />
                <View style={[styles.smallPetal, { bottom: 8, left: 8 }]} />
                <View style={[styles.smallPetal, { bottom: 8, right: 8 }]} />

                {/* Core Node Center */}
                <View style={[
                  styles.centerCircle,
                  isActive && styles.currentCenter,
                  isCompleted && styles.completedCenter
                ]}>
                  <Text style={styles.nodeEmoji}>
                    {isCompleted ? "🌟" : iconEmoji}
                  </Text>
                </View>

                {/* Numerical Badge Centered underneath the Flower */}
                <View style={styles.numberBadge}>
                  <Text style={styles.badgeText}>{task.id}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* SYSTEM MISSION MODAL */}
      <Modal visible={selectedTask != null && selectedTask.title != null} animationType="fade" transparent={true}>
        <View style={styles.overlayContainer}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalBigIcon}>{selectedTask?.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
                <Text style={styles.statusLabel}>
                  Status: <Text style={{ color: selectedTask?.completed ? '#F8E8B8' : '#FFB300', fontWeight: 'bold' }}>
                    {selectedTask?.completed ? "PENDING APPROVAL" : "ACTIVE"}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionHeading}>YOUR MISSION:</Text>
            <Text style={styles.descriptionText}>{selectedTask?.description}</Text>

            {!selectedTask?.completed ? (
              <View>
                <Text style={styles.sectionHeading}>UPLOAD SUBMISSION PROOF:</Text>
                {selectedTask?.type === "photo" && (
                  <View style={styles.mediaUploadBox}>
                    {proofInput ? <Text style={styles.uploadedSuccessText}>📸 Photo Staged!</Text> : null}
                    <Pressable style={styles.mediaButton} onPress={handlePickImage}>
                      <Text style={styles.mediaButtonText}>Select Photo</Text>
                    </Pressable>
                  </View>
                )}

                {selectedTask?.type === "audio" && (
                  <View style={styles.mediaUploadBox}>
                    <Pressable
                      style={[styles.mediaButton, isRecording && { backgroundColor: '#DC2626' }]}
                      onPress={isRecording ? handleStopRecording : handleStartRecording}
                    >
                      <Text style={styles.mediaButtonText}>{isRecording ? "🛑 Stop" : "🎙️ Record Audio"}</Text>
                    </Pressable>
                  </View>
                )}

                {["movie", "decode", "memory", "location", "locker"].includes(selectedTask?.type) && (
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Type your answer text here..."
                    placeholderTextColor="#64748B"
                    value={proofInput}
                    onChangeText={setProofInput}
                  />
                )}

                <View style={styles.actionRow}>
                  <Pressable style={[styles.modalBtn, styles.btnBack]} onPress={() => setSelectedTask({} as Task)}>
                    <Text style={styles.btnLabel}>Close</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalBtn, styles.btnSend]}
                    disabled={submitting}
                    onPress={handleProofSubmission}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.btnLabel}>{selectedTask?.type === "crossword" ? "Navigate" : "Submit Proof"}</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable style={[styles.modalBtn, styles.btnBack, { width: '100%' }]} onPress={() => setSelectedTask({} as Task)}>
                <Text style={styles.btnLabel}>Back to Map Trail</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  svg: { position: "absolute", zIndex: 0 },
  header: {
    marginTop: 60,
    width: "90%",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#FFB8D2",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    alignItems: "center",
    alignSelf: 'center',
    zIndex: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FF5F99" },
  headerSubtitle: { marginTop: 8, fontSize: 13, color: "#555", textAlign: "center" },

  // Flower Layout Setup
  flowerContainer: {
    position: "absolute",
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  petal: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFD6E8",
    shadowColor: "#FF9FC5",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  topPetal: { top: 0, left: 25 },
  bottomPetal: { bottom: 0, left: 25 },
  leftPetal: { left: 0, top: 25 },
  rightPetal: { right: 0, top: 25 },
  smallPetal: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFE3EF",
    shadowColor: "#FFB6D2",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  centerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF8D9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFC75F",
    shadowColor: "#FFC75F",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  currentCenter: { backgroundColor: "#FFE082" },
  completedCenter: { backgroundColor: "#B9F6CA", borderColor: "#5D9E1B" },
  nodeEmoji: { fontSize: 22 },

  // Perfectly Centered Bottom Badge
  numberBadge: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    marginLeft: -14, // Centering logic: negative half width
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5C8A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "white",
    zIndex: 15,
  },
  badgeText: { color: "white", fontWeight: "700", fontSize: 12 },

  // Background Flora & Clouds Decor
  flowerDecoration: {
    position: "absolute",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  flowerCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  bush: {
    position: "absolute",
    width: 36,
    height: 20,
    borderRadius: 12,
    backgroundColor: "#66BB6A",
  },

  // Modal Styling
  overlayContainer: { flex: 1, backgroundColor: 'rgba(11, 19, 28, 0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '88%', backgroundColor: "rgba(255,255,255,0.95)", borderColor: "#FFD9EC", borderRadius: 28, padding: 24, borderWidth: 4 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalBigIcon: { fontSize: 44 },
  modalTitle: { color: '#402840', fontSize: 20, fontWeight: '900' },
  statusLabel: { color: '#64748B', fontSize: 12, marginTop: 4 },
  divider: { height: 3, backgroundColor: '#E2E8F0', marginVertical: 18, borderRadius: 2 },
  sectionHeading: { color: '#E05375', fontSize: 11, fontWeight: '900', marginBottom: 6, letterSpacing: 1 },
  descriptionText: { color: '#334155', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  inputBox: { backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: 12, padding: 14, fontSize: 14, borderWidth: 2, borderColor: '#CBD5E1', marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnBack: { backgroundColor: '#64748B' },
  btnSend: { backgroundColor: '#FF6B9D' },
  btnLabel: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  mediaUploadBox: { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#CBD5E1', marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  mediaButton: { backgroundColor: '#38BDF8', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mediaButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  uploadedSuccessText: { color: '#22C55E', fontSize: 13, fontWeight: '700', marginBottom: 12 },
});