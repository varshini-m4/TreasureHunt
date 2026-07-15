import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { router } from "expo-router";

const crossword = [
  {
    id: 1,
    clue: "🏸 Favorite sport",
    answer: "BADMINTON",
  },
  {
    id: 2,
    clue: "🎬 We are always late for...",
    answer: "MOVIE",
  },
  {
    id: 3,
    clue: "✈️ Planned many times but never happened",
    answer: "TRIP",
  },
  {
    id: 4,
    clue: "✨ Beauty of the gang",
    answer: "ANGEL",
  },
  {
    id: 5,
    clue: "🍫 Which sweet treat would you never say no to?",
    answer: "CHOCOLATE",
  },
  {
    id: 6,
    clue: "👹 Favourite villain",
    answer: "MADARA",
  },
  {
    id: 7,
    clue: "❤️ Most important in life",
    answer: "FRIENDS",
  },
];

export default function Crossword() {
  const inputRefs = useRef<any[][]>(
    crossword.map((word) =>
      word.answer
        .split("")
        .map(() => React.createRef())
    )
  ).current;
  const [answers, setAnswers] = useState(
    crossword.map(item =>
      Array(item.answer.length).fill("")
    )
  );

  const updateLetter = (
    wordIndex: number,
    letterIndex: number,
    value: string
  ) => {

    const copy = [...answers];

    const letter = value
      .toUpperCase()
      .slice(-1);

    copy[wordIndex][letterIndex] = letter;

    setAnswers(copy);


    if (
      letter &&
      letterIndex <
      crossword[wordIndex].answer.length - 1
    ) {

      inputRefs[wordIndex]
      [letterIndex + 1]
        .current
        ?.focus();

    }

  };

  const submit = () => {

    let correct = true;

    crossword.forEach((item, index) => {

      const entered =
        answers[index].join("");

      if (
        entered.toUpperCase() !==
        item.answer
      ) {
        correct = false;
      }

    });

    if (correct) {
      Alert.alert(
        "🎉 Mission Complete",
        "Amazing! Puzzle solved."
      );

      // router.push("/nexttask");

    } else {

      Alert.alert(
        "❌ Incorrect",
        "Some answers are wrong."
      );

    }

  };

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <Text style={styles.title}>
          🧩 Birthday Crossword
        </Text>

        <Text style={styles.subtitle}>
          Solve all the clues.
        </Text>
        {
          crossword.map((item, wordIndex) => (

            <View
              key={item.id}
              style={styles.wordCard}
            >

              <Text style={styles.clue}>
                {item.id}. {item.clue}
              </Text>


              <View style={styles.boxRow}>

                {
                  item.answer.split("").map((_, letterIndex) => (

                    <TextInput
                      ref={
                        inputRefs[wordIndex][letterIndex]
                      }
                      key={letterIndex}
                      style={[
                        styles.box,
                        answers[wordIndex][letterIndex]
                          ? styles.filledBox
                          : null
                      ]}
                      value={
                        answers[wordIndex][letterIndex]
                      }
                      maxLength={1}
                      autoCapitalize="characters"
                      onChangeText={(text) =>
                        updateLetter(
                          wordIndex,
                          letterIndex,
                          text
                        )
                      }
                    />

                  ))
                }

              </View>

            </View>

          ))
        }


        <PrimaryButton
          title="Submit Puzzle"
          onPress={submit}
        />


      </ScrollView>

    </SafeAreaView>

  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#08121E",
  },

  title: {
    color: "#FFD54F",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
  },

  subtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    marginVertical: 15,
  },

  wordCard: {
    backgroundColor: "#142130",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 18,
    borderRadius: 18,
  },

  clue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  boxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  box: {
    width: 32,
    height: 38,
    borderWidth: 2,
    borderColor: "#FFD54F",
    borderRadius: 6,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  filledBox: {
    backgroundColor: "#FFF8DC",
  },

});