import React, { useState, useEffect, useMemo } from "react";
import { Animated, StyleSheet, Text, View, Dimensions, Platform, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Dynamic platform import for Map elements
let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;
if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

import { tasks } from "../data/tasks";

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#08121E" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

const generateMockCoordinates = (index: any) => {
  const baseLat = 37.78825;
  const baseLng = -122.4324;
  const row = Math.floor(index / 3);
  const col = index % 3;
  const direction = row % 2 === 0 ? col : 2 - col;
  return {
    latitude: baseLat - row * 0.0025,
    longitude: baseLng + direction * 0.003,
  };
};

const getTaskEmoji = (type: any) => {
  switch (type) {
    case "photo": return "📸";
    case "audio": return "🎵";
    case "sudoku": return "🧩";
    case "movie": return "🎬";
    case "decode": return "🔐";
    case "status": return "📲";
    case "memory": return "💭";
    case "location": return "📍";
    case "locker": return "🔓";
    default: return "🌟";
  }
};

export default function MapScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.completedTaskId) {
      const nextStep = 1 //parseInt(params?.completedTaskId, 10) + 1;
      if (nextStep > currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [params?.completedTaskId]);

  const mapCheckpoints = useMemo(() => {
    return tasks.map((task, index) => ({
      ...task,
      emoji: getTaskEmoji(task.type),
      coordinates: generateMockCoordinates(index),
    }));
  }, []);

  const activeRouteCoordinates = useMemo(() => {
    return mapCheckpoints
      .filter((item) => item.id <= currentStep)
      .map((item) => item.coordinates);
  }, [currentStep, mapCheckpoints]);

  const handleTaskPress = (item: any, isLocked: any) => {
    if (isLocked) return;
    const destinationPath = item.screen ? item.screen : "/task";
    router.push({
      pathname: destinationPath,
      params: {
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        reward: item.reward || "",
      },
    });
  };

  // ==========================================
  // WEB ZIGZAG BOARD GAME LAYOUT
  // ==========================================
  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webMapCard}>
          <Text style={styles.title}>🗺️ Treasure Map</Text>
          <Text style={styles.subtitle}>
            {currentStep > tasks.length
              ? "✨ Incredible! You have unlocked the ultimate treasure! ✨"
              : "Snake your way through the track below to reveal the birthday treasure."}
          </Text>

          <ScrollView contentContainerStyle={styles.webTrailContainer} showsVerticalScrollIndicator={false}>
            {mapCheckpoints.map((item, index) => {
              const isDone = item.id < currentStep;
              const isActive = item.id === currentStep;
              const isLocked = item.id > currentStep;

              // Alternates alignment side to create the signature layout snake feel
              const isEvenRow = index % 2 === 0;

              return (
                <View key={item.id} style={styles.webStepWrapper}>
                  {/* Vertical Track Linkers */}
                  {index > 0 && (
                    <View style={[
                      styles.webPathLine,
                      isEvenRow ? styles.webPathLeft : styles.webPathRight,
                      item.id <= currentStep ? styles.webPathLineActive : styles.webPathLineLocked
                    ]} />
                  )}

                  <View style={[styles.webRowAligner, { justifyContent: isEvenRow ? "flex-start" : "flex-end" }]}>
                    <Pressable
                      onPress={() => handleTaskPress(item, isLocked)}
                      style={[
                        styles.webRowCard,
                        isDone && styles.webCardDone,
                        isActive && styles.webCardActive,
                        isLocked && styles.webCardLocked,
                      ]}
                      disabled={isLocked}
                    >
                      <View style={[
                        styles.webIconBubble,
                        isDone && styles.markerDone,
                        isActive && styles.markerActive,
                        isLocked && styles.markerLocked
                      ]}>
                        <Text style={[styles.markerIcon, isLocked && { opacity: 0.3 }]}>
                          {isDone ? "✅" : item.emoji}
                        </Text>
                      </View>

                      <View style={styles.webCardText}>
                        <Text style={[styles.webCardTitle, isLocked && { color: "#556475" }]}>
                          {item.id}. {item.title} {isActive && "⚡️"}
                        </Text>
                        <Text style={[styles.webCardClue, isLocked && { color: "#3B4E63" }]}>
                          {isLocked ? "🔒 Locked until previous steps are clear" : item.description}
                        </Text>
                        {item.reward && !isLocked && (
                          <Text style={styles.rewardBadge}>Key: {item.reward}</Text>
                        )}
                      </View>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }

  // ==========================================
  // NATIVE MOBILE GEO-MAP LAYOUT
  // ==========================================
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        }}
      >
        {activeRouteCoordinates.length > 1 && (
          <Polyline
            coordinates={activeRouteCoordinates}
            strokeColor="#FFD54F"
            strokeWidth={4}
            lineDashPattern={[6, 6]}
          />
        )}

        {mapCheckpoints.map((item) => {
          const isDone = item.id < currentStep;
          const isActive = item.id === currentStep;
          const isLocked = item.id > currentStep;

          return (
            <Marker
              key={item.id}
              coordinate={item.coordinates}
              onPress={() => handleTaskPress(item, isLocked)}
            >
              <View style={[
                styles.markerBubble,
                isDone && styles.markerDone,
                isLocked && styles.markerLocked,
                isActive && styles.markerActive
              ]}>
                <Text style={[styles.markerIcon, isLocked && { opacity: 0.35 }]}>
                  {isDone ? "✅" : item.emoji}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.hudContainer}>
        <Text style={styles.title}>🗺️ Treasure Map</Text>
        <Text style={styles.subtitle}>
          {currentStep > tasks.length
            ? "✨ All tasks complete! Open the final reward! ✨"
            : `Active Mission (${currentStep}/${tasks.length}): ${mapCheckpoints[currentStep - 1].title}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Native Mobile Layout Styles
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  hudContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(8, 18, 30, 0.92)",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#34495E",
  },
  title: {
    fontSize: 28,
    color: "#FFD54F",
    fontWeight: "700",
  },
  subtitle: {
    color: "#FFFFFF",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  markerBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0B1E33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#FFD54F",
  },
  markerActive: {
    borderColor: "#FF5252",
    backgroundColor: "#162B44",
    transform: [{ scale: 1.2 }],
  },
  markerDone: {
    borderColor: "#4CAF50",
    backgroundColor: "#0F281B",
  },
  markerLocked: {
    borderColor: "#455A64",
    backgroundColor: "#1C2A38",
  },
  markerIcon: {
    fontSize: 20,
  },

  // Interactive Web Layout Styles
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#040A12",
  },
  webMapCard: {
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#08121E",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  webTrailContainer: {
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  webStepWrapper: {
    width: "100%",
    position: "relative",
  },
  webRowAligner: {
    flexDirection: "row",
    width: "100%",
  },
  webPathLine: {
    width: 3,
    height: 30,
    borderStyle: "dashed",
    borderWidth: 1.5,
    position: "absolute",
    top: -32,
    zIndex: 1,
  },
  webPathLeft: {
    left: "20%", // Anchors connect line underneath left-shifted elements
  },
  webPathRight: {
    right: "20%", // Anchors connect line underneath right-shifted elements
  },
  webPathLineActive: {
    borderColor: "#4CAF50",
  },
  webPathLineLocked: {
    borderColor: "#2C3E50",
  },
  webRowCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%", // Keeps spaces alternating on either side cleanly
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#0D1F38",
    borderWidth: 1.5,
    borderColor: "#1E3656",
    marginVertical: 4,
  },
  webCardActive: {
    borderColor: "#FFD54F",
    backgroundColor: "#122846",
  },
  webCardDone: {
    borderColor: "#2E7D32",
    backgroundColor: "#0A2214",
  },
  webCardLocked: {
    backgroundColor: "#050C14",
    borderColor: "#102033",
    opacity: 0.5,
  },
  webIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginRight: 16,
  },
  webCardText: {
    flex: 1,
  },
  webCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 3,
  },
  webCardClue: {
    fontSize: 13,
    color: "#B0BEC5",
    lineHeight: 18,
  },
  rewardBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    color: "#FFD54F",
    backgroundColor: "#2C2205",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
    fontWeight: "600",
  },
});