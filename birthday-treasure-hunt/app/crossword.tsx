import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { submitProof } from '../data/taskHandler';

const crossword = [
  { id: 1, clue: "🏸 Favorite sport", answer: "BADMINTON" },
  { id: 2, clue: "🎬 We are always late for...", answer: "MOVIE" },
  { id: 3, clue: "✈️ Planned many times but never happened", answer: "TRIP" },
  { id: 4, stroke: "✨ Beauty of the gang", clue: "✨ Beauty of the gang", answer: "ANGEL" },
  { id: 5, clue: "🍫 Which sweet treat would you never say no to?", answer: "CHOCOLATE" },
  { id: 6, clue: "👹 Favourite villain", answer: "MADARA" },
  { id: 7, clue: "❤️ Most important in life", answer: "FRIENDS" },
];

export default function Crossword() {
  const { taskData } = useLocalSearchParams<{ taskData: string }>();
  const selectedTask = taskData ? JSON.parse(taskData) : {};

  // Setup functional references mapping layout arrays
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

    // Dynamic Autoforward: Advance focus to the next adjacent field box
    if (letter && letterIndex < crossword[wordIndex].answer.length - 1) {
      inputRefs[wordIndex][letterIndex + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    wordIndex: number,
    letterIndex: number
  ) => {
    // Dynamic Backtracking: Clear out elements shifting backwards upon hitting backspace
    if (e.nativeEvent.key === "Backspace" && !answers[wordIndex][letterIndex] && letterIndex > 0) {
      const copy = answers.map(row => [...row]);
      copy[wordIndex][letterIndex - 1] = "";
      setAnswers(copy);
      inputRefs[wordIndex][letterIndex - 1]?.focus();
    }
  };

  const submit = async () => {
    const isCorrect = crossword.every(
      (item, index) => answers[index].join("").toUpperCase() === item.answer
    );

    if (isCorrect) {
      const targetId = selectedTask?.id || "SOLVE_BIRTHDAY_CROSSWORD";
      const result = await submitProof(targetId, "Crossword Solved Verification", "text/plain", "crossword_solved.txt", selectedTask?.isNotMediaFile || false);

      if (result.status === "success") {
        alert("🎉 Mission Complete. Amazing! Puzzle solved.");
        router.replace("/map");
        return;
      }
    }
    alert("❌ Incorrect. YET MISSING actual answer. Check your layout combinations!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🧩 Birthday Crossword</Text>
        <Text style={styles.subtitle}>Solve all the clues.</Text>

        {crossword.map((item, wordIndex) => (
          <View key={item.id} style={styles.wordCard}>
            <Text style={styles.clue}>{item.id}. {item.clue}</Text>
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
  clue: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12
  },
  boxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  box: {
    width: 38,
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
  btnPadding: {
    paddingHorizontal: 16,
    marginTop: 20
  },
  btnWrapper: {
    width: "100%",          // Span full width layout boundaries
    alignItems: "center",   // 💡 Centering magic happens here!
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 16,
  }
});