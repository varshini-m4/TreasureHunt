import { FlatList, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import TaskCard from "../components/TaskCard";
import { tasks } from "../data/tasks";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Treasure Map</Text>

      <Text style={styles.subtitle}>
        Complete every mission to unlock the birthday treasure.
      </Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => router.push(item.screen)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08121E",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    color: "#FFD54F",
    fontWeight: "700",
  },

  subtitle: {
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 16,
  },
});