import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TaskCard({ task, onPress }: any) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.title}>
          Mission {task.id}
        </Text>

        <Text style={styles.desc}>
          {task.title}
        </Text>
      </View>

      <Text style={styles.arrow}>➡️</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#142130",
    marginBottom: 15,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFD54F",
    fontWeight: "700",
    fontSize: 18,
  },

  desc: {
    color: "white",
    marginTop: 5,
    fontSize: 15,
  },

  arrow: {
    fontSize: 24,
  },
});