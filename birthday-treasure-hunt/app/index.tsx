import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0.9)).current;
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

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

  const validateAnswer = () => {
    const correctAnswer = "beach"; // Change this to your answer

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setError("");
      router.push("/map");
    } else {
      setError("❌ Wrong answer. Try again!");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.container}
    >
      <Animated.View
        style={[styles.card, { opacity: fadeAnim, transform: [{ scale: bounceAnim }] }]}
      >
        <Text style={styles.emoji}>🎂</Text>
        <Text style={styles.title}>Birthday Treasure Hunt</Text>
        <Text style={styles.subtitle}>
          Only someone who knows us can begin this adventure...
        </Text>
        <Text style={styles.subtitle}> What is our favorite place together?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your answer..."
          value={answer}
          onChangeText={(text) => {
            setAnswer(text);
            setError("");
          }}
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <PrimaryButton
          title="Start Adventure"
          onPress={validateAnswer}
        />
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
    backgroundColor: "#0B131F", // Deep cyber dark background
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#162235", // High-end dark card surface
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", // Subtle rim highlight
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF", // High-contrast clean white header
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#94A3B8", // Soft readable neutral gray
    lineHeight: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#0B131F", // Inset input box fill
    borderWidth: 1,
    borderColor: "#334155", // Refined slate border focus
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF", // Crisp white input text
    marginBottom: 10,
  },
  error: {
    color: "#EF4444", // Clean crimson red error feedback state
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});