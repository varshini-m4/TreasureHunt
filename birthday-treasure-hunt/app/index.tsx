import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import PrimaryButton from "../src/components/PrimaryButton";

export default function Home() {
  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.container}
    >
      <Text style={styles.title}>
        🎉 Birthday Treasure Hunt 🎉
      </Text>

      <Text style={styles.subtitle}>
        Every step brings you closer to the hidden treasure.
      </Text>

      <PrimaryButton
        title="Start Adventure"
        onPress={() => router.push("/map")}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
    color: "#555",
  },
});