import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});