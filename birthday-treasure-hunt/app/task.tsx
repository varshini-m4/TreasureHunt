import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../constants/colors";

export default function TaskScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    clue?: string;
    task?: string;
  }>();
  const [done, setDone] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (done) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [done, pulseAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Birthday Challenge</Text>
      <Text style={styles.title}>{params.title ?? "Treasure Step"}</Text>

      <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}> 
        <Text style={styles.label}>Clue</Text>
        <Text style={styles.text}>{params.clue ?? "A fun surprise is waiting here."}</Text>

        <Text style={styles.label}>Task</Text>
        <Text style={styles.text}>{params.task ?? "Complete the birthday mission."}</Text>
      </Animated.View>

      <Pressable style={styles.button} onPress={() => setDone((value) => !value)}>
        <Text style={styles.buttonText}>{done ? "Completed 🎉" : "Mark as Done"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryText}>Back to map</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  eyebrow: {
    color: Colors.primary,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 18,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: Colors.dark,
    lineHeight: 24,
    marginBottom: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  secondaryText: {
    color: Colors.grey,
    fontSize: 15,
  },
});
