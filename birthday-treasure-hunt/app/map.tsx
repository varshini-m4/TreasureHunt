import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import Clouds from "../components/Clouds";
import { Image } from "react-native";
import Petals from "../components/Petals";
import { Animated } from "react-native";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
// Importing your exact task array configuration
import { tasks } from "../data/tasks";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
import CherryBlossomTree from '../components/trees';

export default function Map() {
  const [activeTasks, setActiveTasks] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [proofInput, setProofInput] = useState('');

  const currentActiveId = activeTasks.find(t => !t.completed)?.id || 16;

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);


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
  const trees = [
  { left: -20, top: 80, scale: 1.1 },
  { left: 290, top: 320, scale: 1.3 },
  { left: -30, top: 650, scale: 1.15 },
  { left: 300, top: 980, scale: 1.25 },
  { left: -10, top: 1350, scale: 1.2 },
  { left: 290, top: 1700, scale: 1.35 },
];
  const d = createSmoothPath(tasks);
  function createSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}
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
   colors={["#AEE7FF",
    "#DFF6FF",
    "#FFF3D6",
    "#FFF9F2",]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.mainContainer}
  >
    <Clouds />
     <Petals />
     <View style={styles.header}>

  <Text style={styles.headerTitle}>
    🌸 Birthday Adventure 🌸
  </Text>

  <Text style={styles.headerSubtitle}>
    Every task brings you closer to your surprise 💖
  </Text>

</View>
 <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
       <View style={{ height: 2200 }}>
  <Svg
    width="100%"
    height="2200"
    //viewBox="0 0 400 1700"
    style={styles.svg}
  >
  <Path
    d={d}
    stroke="#C8A042"
    strokeWidth={58}
    fill="none"
    strokeLinecap="round"
/>
<Path
    d={d}
    stroke="#E8C35C"
    strokeWidth={50}
    fill="none"
    strokeLinecap="round"
/>
<Path
    d={d}
    stroke="#FFE69A"
    strokeWidth={34}
    fill="none"
    strokeLinecap="round"
/>
  </Svg>
   {tasks.map((task) => (
      <Pressable
  key={task.id}
  style={[
    styles.flowerContainer,
    {
      left: task.x - 50,
      top: task.y - 50,
    },
  ]}
>

  {/* Top */}
  <View style={[styles.petal, { top: 0, left: 28 }]} />

  {/* Bottom */}
  <View style={[styles.petal, { bottom: 0, left: 28 }]} />

  {/* Left */}
  <View style={[styles.petal, { left: 0, top: 28 }]} />

  {/* Right */}
  <View style={[styles.petal, { right: 0, top: 28 }]} />

  {/* Top Left */}
  <View style={[styles.smallPetal, { top: 8, left: 8 }]} />

  {/* Top Right */}
  <View style={[styles.smallPetal, { top: 8, right: 8 }]} />

  {/* Bottom Left */}
  <View style={[styles.smallPetal, { bottom: 8, left: 8 }]} />

  {/* Bottom Right */}
  <View style={[styles.smallPetal, { bottom: 8, right: 8 }]} />

  <View style={styles.centerCircle}>
    <Text style={styles.nodeEmoji}>{task.icon}</Text>
  </View>

  <View style={styles.numberBadge}>
    <Text style={styles.badgeText}>{task.id}</Text>
  </View>

</Pressable>
))}
{trees.map((tree, index) => (
  <CherryBlossomTree
    key={index}
    left={tree.left}
    top={tree.top}
    scale={tree.scale}
  />
))}
{flowers.map((flower, index) => (
  <View
    key={index}
    style={[
      styles.flowerDecoration,
      {
        left: flower.left,
        top: flower.top,
      },
    ]}
  >
    <View
      style={[
        styles.flowerCenter,
        { backgroundColor: flower.color },
      ]}
    />
  </View>
))}
{bushes.map((bush, index) => (
  <View
    key={index}
    style={[
      styles.bush,
      {
        left: bush.left,
        top: bush.top,
      },
    ]}
  />
))}
</View>
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
explorer: {
  position: "absolute",
  width: 70,
  height: 70,
  zIndex: 999,
},
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
  header: {
  marginTop: 60,
  width: "88%",
  marginHorizontal: 20,
  padding: 20,

  borderRadius: 28,

  backgroundColor: "rgba(255,255,255,0.65)",

  borderWidth: 1,

  borderColor: "rgba(255,255,255,0.8)",

  shadowColor: "#FFB8D2",

  shadowOpacity: 0.25,

  shadowRadius: 20,

  elevation: 8,

  alignItems: "center",
},
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
headerTitle: {
  fontSize: 22,
  fontWeight: "700",
  color: "#FF5F99",
},

headerSubtitle: {
  marginTop: 8,
  fontSize: 15,
  color: "#555",
  textAlign: "center",
},
mapContainer: {
  marginTop: 80,
  alignItems: "center",
  height: 2200,
},

node: {
  position: "absolute",

  width: 70,
  height: 70,

  borderRadius: 35,

  backgroundColor: "#FFF8FD",

  justifyContent: "center",
  alignItems: "center",

  borderWidth: 4,
  borderColor: "#FFD7E8",

  shadowColor: "#FFB6D2",
  shadowOpacity: 0.35,
  shadowRadius: 12,

  elevation: 10,
},

currentNode: {
  backgroundColor: "#FFEAA7",

  borderColor: "#FFC75F",

  transform: [
    {
      scale: 1.08,
    },
  ],
},
flowerContainer: {
  position: "absolute",
  width: 84,
  height: 84,
  justifyContent: "center",
  alignItems: "center",
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

topPetal: {
  top: 0,
},

bottomPetal: {
  bottom: 0,
},

leftPetal: {
  left: 0,
},

rightPetal: {
  right: 0,
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
},

currentCenter: {
  backgroundColor: "#FFE082",
},

completedCenter: {
  backgroundColor: "#B9F6CA",
},

nodeEmoji: {
  fontSize: 24,
},

numberBadge: {
  position: "absolute",
  right: -2,
  bottom: -2,

  width: 24,
  height: 24,

  borderRadius: 12,

  backgroundColor: "#FF5C8A",

  justifyContent: "center",
  alignItems: "center",

  borderWidth: 2,
  borderColor: "white",
},

badgeText: {
  color: "white",
  fontWeight: "700",
  fontSize: 12,
},

nodeEmoji: {
  fontSize: 30,
},

numberBadge: {
  position: "absolute",

  right: -6,
  bottom: -6,

  width: 24,
  height: 24,

  borderRadius: 12,

  backgroundColor: "#FF6B9D",

  justifyContent: "center",
  alignItems: "center",

  borderWidth: 2,
  borderColor: "white",
},

badgeText: {
  color: "white",
  fontWeight: "700",
  fontSize: 12,
},
svg: {
  position: "absolute",
},
  mainContainer: { flex: 1 },
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