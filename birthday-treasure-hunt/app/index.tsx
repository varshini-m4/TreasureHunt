import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { router } from "expo-router";
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
        <PrimaryButton
  title="Start Crossword"
  onPress={() => router.push("/crossword")}
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
  input: {
  width: "100%",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#D0D7DE",
  borderRadius: 12,
  paddingHorizontal: 15,
  paddingVertical: 12,
  fontSize: 16,
  marginBottom: 10,
},

error: {
  color: "#E53935",
  fontSize: 14,
  marginBottom: 15,
  alignSelf: "flex-start",
},
});


