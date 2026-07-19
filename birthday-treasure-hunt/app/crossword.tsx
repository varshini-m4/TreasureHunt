import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
  Alert,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { submitProof } from '../data/taskHandler';

const crossword = [
  { id: 1, clue: "🏸", title: "Favorite sport", answer: "BADMINTON" },
  { id: 2, clue: "🎬", title: "We are always late for...", answer: "MOVIE" },
  { id: 3, clue: "✈️", title: "Planned many times but never happened", answer: "TRIP" },
  { id: 4, stroke: "✨", title: "Beauty of the gang", answer: "ANGEL" },
  { id: 5, clue: "🍫", title: "Which sweet treat would you never say no to?", answer: "CHOCOLATE" },
  { id: 6, clue: "👹", title: "Favourite villain", answer: "MADARA" },
  { id: 7, clue: "❤️", title: "Most important in life", answer: "FRIENDS" },
];

export default function Crossword() {
  const { taskData } = useLocalSearchParams<{ taskData: string }>();
  const selectedTask = taskData ? JSON.parse(taskData) : {};

  const inputRefs = useRef<Array<Array<TextInput | null>>>(
    crossword.map((word) => Array(word.answer.length).fill(null))
  ).current;

  const [answers, setAnswers] = useState<string[][]>(
    crossword.map(item => Array(item.answer.length).fill(""))
  );

  const updateLetter = (wordIndex: number, letterIndex: number, value: string) => {
    const copy = answers.map(row => [...row]);
    const letter = value.toUpperCase().slice(-1);
    copy[wordIndex][letterIndex] = letter;
    setAnswers(copy);

    if (letter && letterIndex < crossword[wordIndex].answer.length - 1) {
      inputRefs[wordIndex][letterIndex + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    wordIndex: number,
    letterIndex: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !answers[wordIndex][letterIndex] && letterIndex > 0) {
      const copy = answers.map(row => [...row]);
      copy[wordIndex][letterIndex - 1] = "";
      setAnswers(copy);
      inputRefs[wordIndex][letterIndex - 1]?.focus();
    }
  };

  const submit = async () => {
    let globalMatch = true;

    // 💡 Fix: Deep copy state array cleanly to avoid reference mutation traps
    const updatedAnswers = answers.map((row, index) => {
      const currentWordString = row.join("").toUpperCase();
      const isWordCorrect = currentWordString === crossword[index].answer;

      if (!isWordCorrect) {
        globalMatch = false;
        return Array(crossword[index].answer.length).fill(""); // Reset only the wrong row elements
      }
      return row; // Keep the correct elements unchanged
    });

    if (globalMatch) {
      const targetId = selectedTask?.id || "SOLVE_BIRTHDAY_CROSSWORD";
      const result = await submitProof(targetId, "", "", "", selectedTask?.isNotMediaFile);

      if (result.status === "success") {
        Alert.alert("🎉 Mission Complete", "Amazing! Puzzle solved.");
        router.replace("/map");
        return;
      }
    } else {
      // Apply the cleared row state arrays back to the rendering layer
      setAnswers(updatedAnswers);
      Alert.alert("❌ Incorrect", "Some answers are wrong. Incorrect fields have been cleared out for you!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🧩 Birthday Crossword</Text>
        <Text style={styles.subtitle}>Solve all the clues.</Text>

        {crossword.map((item, wordIndex) => (
          <View key={item.id} style={styles.wordCard}>

            {/* 💡 UI Fix: Text wrapper header structure allows direct flex row alignment with hint bulb */}
            <View style={styles.clueHeaderRow}>
              <Text style={styles.clue}>{item.id}. {item.title}</Text>
              <Pressable
                onPress={() => Alert.alert("Clue Hint", item.clue || "Special Character", [{ text: "OK" }])}
                style={styles.hintPressable}
              >
                <Text style={styles.clueIcon}>💡</Text>
              </Pressable>
            </View>

            <View style={styles.boxRow}>
              {item.answer.split("").map((_, letterIndex) => (
                <TextInput
                  key={letterIndex}
                  ref={(ref) => { inputRefs[wordIndex][letterIndex] = ref; }}
                  style={[
                    styles.box,
                    answers[wordIndex][letterIndex] ? styles.filledBox : null
                  ]}
                  value={answers[wordIndex][letterIndex]}
                  maxLength={1}
                  autoCapitalize="characters"
                  placeholder="?"
                  placeholderTextColor="#3A4F66"
                  onChangeText={(text) => updateLetter(wordIndex, letterIndex, text)}
                  onKeyPress={(e) => handleKeyPress(e, wordIndex, letterIndex)}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.btnWrapper}>
          <PrimaryButton title="Submit Puzzle" onPress={submit} />
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08121E"
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    color: "#FFD54F",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20
  },
  subtitle: {
    color: "#E2E8F0",
    textAlign: "center",
    fontSize: 15,
    marginVertical: 10,
    lineHeight: 22
  },
  wordCard: {
    backgroundColor: "#142130",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14
  },
  clueHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap", // Protects longer text rows from pushing out icon off screen
  },
  clue: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,   // Allows text to occupy up to the remaining layout width
  },
  hintPressable: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  clueIcon: {
    fontSize: 18,
    color: "#FFD54F",
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 4
  },
  box: {
    flex: 1,
    maxWidth: 40,
    padding: 0,
    height: 46,
    borderWidth: 2,
    borderColor: "#FFD54F",
    borderRadius: 8,
    backgroundColor: "#142130",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    shadowColor: "#FFD54F",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filledBox: {
    backgroundColor: "#1E3A5F",
    borderColor: "#FFF",
  },
  btnWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 16,
  }
});