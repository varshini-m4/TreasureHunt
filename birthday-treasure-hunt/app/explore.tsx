import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../src/constants/colors";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>
      <Text style={styles.text}>
        Each stop on the map gives a birthday clue and a short task. Complete the task to unlock the next surprise.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: COLORS.grey,
    lineHeight: 24,
  },
});
