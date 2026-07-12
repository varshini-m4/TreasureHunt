import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
// Importing your exact task array configuration
import { tasks } from "../data/tasks";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export default function Map() {
  const [activeTasks, setActiveTasks] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [proofInput, setProofInput] = useState('');

  const currentActiveId = activeTasks.find(t => !t.completed)?.id || 16;

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Helper calculation to find the exact center coordinate (X, Y) for any task node
  const getNodeCenter = (index: number) => {
    const rowHeight = 150;
    const startY = 60;

    // Smooth horizontal serpentine winding path pattern
    // Shifts elements left/right across the center line iteratively
    const xAmplitude = (SCREEN_WIDTH - 120) / 2;
    const centerX = SCREEN_WIDTH / 2;

    const x = centerX + Math.sin(index * 1.2) * xAmplitude;
    const y = startY + index * rowHeight;

    return { x, y };
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
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start audio track recording', err);
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setProofInput(uri || '');
    setRecording(null);
    alert("🎵 Audio clip recorded successfully!");
  };

  const handleProofSubmission = async () => {
    if (selectedTask?.type === "crossword") {
      router.push({
        pathname: selectedTask.screen,
        params: {
          title: selectedTask.title,
          clue: selectedTask.description,
          task: "Solve the puzzle and submit your answer.",
        },
      });
      return;
    }
    if (!proofInput.trim()) return;
    const updated = activeTasks.map(t =>
      t.id === selectedTask.id ? { ...t, completed: true } : t
    );
    setActiveTasks(updated);
    setSelectedTask(null);
    setProofInput('');
    alert("✨ Evidence uploaded successfully!");
  };

  return (
    <LinearGradient
   colors={[
 "#A8E6FF",
 "#D7F7FF",
 "#FFF6CC",
 "#FFFDF8"
]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.mainContainer}
  >
      <View style={styles.cloud1}>
    <Text style={styles.cloud}>☁️</Text>
</View>

<View style={styles.cloud2}>
    <Text style={styles.cloud}>☁️</Text>
</View>

<View style={styles.cloud3}>
    <Text style={styles.cloud}>☁️</Text>
</View>
<Text style={styles.flower1}>🌸</Text>
<Text style={styles.flower2}>🌷</Text>
<Text style={styles.flower3}>🌼</Text>
<Text style={styles.flower4}>🌺</Text>
<Text style={styles.flower5}>🌸</Text>
      <View style={styles.mapHeader}>
        <Text style={styles.headerEmoji}>🎒</Text>
        <Text style={styles.headerText}>Birthday Adventure...</Text>
      </View>

      {/* Calculating container layout dynamic canvas sizing constraint dynamically based on item count */}
      <ScrollView contentContainerStyle={[styles.scrollCanvas, { height: tasks.length * 150 + 150 }]}>

        {/* NATIVE VECTOR CONNECTING TRAIL PATH */}
        {activeTasks.map((task, index) => {
          if (index === 0) return null;

          const prevCoord = getNodeCenter(index - 1);
          const currentCoord = getNodeCenter(index);

          const dx = currentCoord.x - prevCoord.x;
          const dy = currentCoord.y - prevCoord.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          const isPassed = task.id <= currentActiveId;

          return (
            <View
              key={`line-path-${task.id}`}
              style={[
                styles.nativeRouteSegment,
                {
                  left: prevCoord.x,
                  top: prevCoord.y,
                  width: distance,
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateX: 0 },
                    { translateY: -6 } // Vertical centering adjustment offset
                  ],
                  backgroundColor:"#2af0f3", shadowColor:"#21f0ed", shadowOpacity:0.8, shadowRadius:12
                }
              ]}
            />
          );
        })}

        {/* INTERACTIVE NODES - ONE PER ROW */}
        {activeTasks.map((task, index) => {
          const { x, y } = getNodeCenter(index);

          const isCompleted = task.completed && task.approved;
          const isActive = task.id === currentActiveId;
          const isLocked = task.id > currentActiveId;
          const iconEmoji = getCustomIcon(task.type);

          return (
            <Pressable
              key={task.id}
              disabled={isLocked}
              style={[
                styles.trailNode,
                {
                  left: x - 45, // Centers node bounding box relative to computed coordinate (width = 90)
                  top: y - 45  // Centers node bounding box relative to computed coordinate (height = 90)
                },
                isCompleted && styles.nodeCompleted,
                isActive && styles.nodeActive,
                isLocked && styles.nodeLocked
              ]}
              onPress={() => setSelectedTask({ ...task, emoji: iconEmoji })}
            >
              <View style={styles.innerNodeWrapper}>
                <Text style={styles.nodeEmoji}>{isCompleted ? "⭐️" : iconEmoji}</Text>
              </View>
              <View style={styles.badgeLabel}>
                <Text style={styles.badgeText}>{task.id}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* SYSTEM MISSION MODAL CONTAINER */}
      <Modal visible={selectedTask !== null} animationType="fade" transparent={true}>
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
                  <Pressable style={[styles.modalBtn, styles.btnBack]} onPress={() => setSelectedTask(null)}>
                    <Text style={styles.btnLabel}>Close</Text>
                  </Pressable>
                  <Pressable style={[styles.modalBtn, styles.btnSend]} onPress={handleProofSubmission}>
                    <Text style={styles.btnLabel}>{selectedTask?.type === "crossword" ? "Navigate" : "Submit Proof"}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable style={[styles.modalBtn, styles.btnBack, { width: '100%' }]} onPress={() => setSelectedTask(null)}>
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
  mapHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF8FC', borderBottomWidth: 4, borderColor: '#FFF8FC', gap: 10 },
  headerEmoji: { fontSize: 28 },
  headerText: { fontSize: 22, color: '#25c4f0', fontWeight: '900', letterSpacing: 1.5, fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-semibold' },
  scrollCanvas: { width: SCREEN_WIDTH, position: 'relative' },

  /* DUOLINGO PATH CONNECTORS */
  nativeRouteSegment: {
    position: 'absolute',
    height: 12,
    borderRadius: 6,
    transformOrigin: 'left center',
    zIndex: 1,
  },

  trailNode: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: '#d5e1ec', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8, zIndex: 2 },
  innerNodeWrapper: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  nodeActive: { borderColor: '#ccf2f5', backgroundColor: '#20e8f6', transform: [{ scale: 1.1 }] },
  nodeCompleted: { borderColor: '#F8E8B8', backgroundColor: '#5D9E1B' , shadowColor:"#FFE18F",
shadowRadius:12,
shadowOpacity:0.8,},
  nodeLocked: { borderColor: '#e9f3fc', backgroundColor: '#69a7ee', opacity: 0.5 },
  nodeEmoji: { fontSize: 34 },
  badgeLabel: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#E11D48', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF', zIndex: 3 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(11, 19, 28, 0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '88%', backgroundColor:"rgba(255,255,255,0.95)",borderColor:"#FFD9EC", borderRadius: 28, padding: 24, borderWidth: 4,color:"#444" },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalBigIcon: { fontSize: 44 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  statusLabel: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  divider: { height: 3, backgroundColor: '#2C4A69', marginVertical: 18, borderRadius: 2 },
  sectionHeading: { color: '#FFD54F', fontSize: 11, fontWeight: '900', marginBottom: 6, letterSpacing: 1 },
  descriptionText: { color: '#E2E8F0', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  inputBox: { backgroundColor: '#0F1A24', color: '#FFF', borderRadius: 12, padding: 14, fontSize: 14, borderWidth: 2, borderColor: '#2C4A69', marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnBack: { backgroundColor: '#475569' },
  btnSend: { backgroundColor: '#F8E8B8',shadowColor:"#FFE18F",
shadowRadius:12,
shadowOpacity:0.8, },
  btnLabel: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  mediaUploadBox: { backgroundColor: '#0F1A24', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#2C4A69', marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  mediaButton: { backgroundColor: '#38BDF8', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mediaButtonText: { color: '#0F172A', fontWeight: '900', fontSize: 14 },
  uploadedSuccessText: { color: '#85CC24', fontSize: 13, fontWeight: '700', marginBottom: 12 },
  cloud:{fontSize:55,opacity:0.85},
 cloud1:{position:"absolute",top:40,left:20},
 flower1:{
position:"absolute",
top:220,
left:15,
fontSize:24
},

flower2:{
position:"absolute",
top:470,
right:10,
fontSize:28
},

flower3:{
position:"absolute",
top:700,
left:25,
fontSize:26
},

flower4:{
position:"absolute",
top:1000,
right:30,
fontSize:24
},

flower5:{
position:"absolute",
bottom:60,
left:120,
fontSize:30
},

cloud2:{
    position:"absolute",
    top:90,
    right:30
},

cloud3:{
    position:"absolute",
    top:160,
    left:120
},
});