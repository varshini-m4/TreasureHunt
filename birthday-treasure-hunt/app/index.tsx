import { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim, fadeAnim]);

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.container}
    >
      <Animated.View
        style={[styles.card, { opacity: fadeAnim, transform: [{ scale: bounceAnim }] }]}
      >
        <Text style={styles.emoji}>??</Text>
        <Text style={styles.title}>Birthday Treasure Hunt</Text>
        <Text style={styles.subtitle}>
          Follow the clues, complete the mini challenge, and find the treasure.
        </Text>
        <PrimaryButton title="Start Adventure" onPress={() => router.push("/map")} />
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#5B6B6E",
    lineHeight: 24,
  },
});
