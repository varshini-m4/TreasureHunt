import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  // 💡 FIX 1: Use the correct type data import
  TextInputKeyPressEventData,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { submitProof } from "../data/taskHandler";

export default function DecodeScreen() {
  const { taskData } = useLocalSearchParams<{ taskData: string }>();

  const { id: taskId, title, description, matchedAnswer, isNotMediaFile } = taskData ? JSON.parse(taskData) : {} as any;

  const targetTaskId = taskId;
  const solutionWord = matchedAnswer?.toUpperCase();
  const displayTitle = title;
  const displayDesc = description;

  const wordLength = solutionWord ? solutionWord.length : 0;
  const [letters, setLetters] = useState<string[]>(Array(wordLength).fill(""));
  const [submitting, setSubmitting] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(wordLength).fill(null));

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const cleanLetter = text.toUpperCase().slice(-1);
    const newLetters = [...letters];
    newLetters[index] = cleanLetter;
    setLetters(newLetters);

    if (cleanLetter && index < wordLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 💡 FIX 2: Correct type definition and Backspace logic
  const handleKeyPress = (
    // Wrap the new type inside NativeSyntheticEvent
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Now e.nativeEvent.key will have full autocomplete and correct typing
    if (e.nativeEvent.key === "Backspace" && !letters[index] && index > 0) {
      const newLetters = [...letters];
      newLetters[index - 1] = "";
      setLetters(newLetters);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const compiledSubmission = letters.join("").toUpperCase();

    if (compiledSubmission !== solutionWord) {
      alert("❌ Incorrect Solution. YET MISSING ACTUAL ANSWER!");
      return;
    }

    try {
      setSubmitting(true);

      const result = await submitProof(
        targetTaskId,
        "",
        "",
        "",
        isNotMediaFile
      );

      if (result.status === "success") {
        alert("🎉 Mission Complete. Amazing! You successfully broke the code")
        router.replace("/map");
      } else {
        alert("Backend Error - Failed to update task records.");
      }
    } catch (err) {
      console.error(err);
      alert("Error - Network error encountered during puzzle validation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.title}>{displayTitle}</Text>
        <Text style={styles.subtitle}>{displayDesc}</Text>

        <View style={styles.boxWrapper}>
          {Array(wordLength)
            .fill(0)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpBox,
                  letters[index] ? styles.otpBoxFilled : null,
                ]}
                value={letters[index]}
                maxLength={1}
                autoCapitalize="characters"
                placeholder="?"
                placeholderTextColor="#3A4F66"
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
        </View>

        {submitting ? (
          <ActivityIndicator size="large" color="#FFD54F" style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.btnWrapper}>
            <PrimaryButton title="Verify Code" onPress={handleSubmit} />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08121E",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    color: "#FFD54F",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#E2E8F0",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  boxWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
    width: "100%",
  },
  otpBox: {
    width: 42,
    height: 52,
    borderWidth: 2,
    borderColor: "#FFD54F",
    borderRadius: 10,
    backgroundColor: "#142130",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    shadowColor: "#FFD54F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFilled: {
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