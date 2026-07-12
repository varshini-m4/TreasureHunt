import { useEffect, useMemo } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "../constants/colors";

const checkpoints = [
  {
    emoji: "??",
    title: "Start at Home",
    clue: "The first surprise waits where the birthday song begins.",
    task: "Say happy birthday to the birthday person and clap three times.",
  },
  {
    emoji: "??",
    title: "Garden Clue",
    clue: "Look for the place where nature smiles.",
    task: "Take one photo of a flower or plant and share it with the group.",
  },
  {
    emoji: "??",
    title: "Gift Spot",
    clue: "The next hint is near the birthday gift.",
    task: "Open one small gift and give a happy cheer.",
  },
  {
    emoji: "??",
    title: "Final Treasure",
    clue: "The treasure is waiting where the celebration shines brightest.",
    task: "Gather everyone for the final birthday toast.",
  },
];

export default function MapScreen() {
  const animations = useMemo(() => checkpoints.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    Animated.stagger(
      100,
      animations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [animations]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>?? Treasure Map</Text>
      <Text style={styles.subtitle}>Tap each stop to reveal the next birthday challenge.</Text>

      {checkpoints.map((item, index) => {
        const animatedStyle = {
          opacity: animations[index],
          transform: [
            {
              translateY: animations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };

        return (
          <Animated.View key={item.title} style={[styles.card, animatedStyle]}>
            <Pressable
              style={styles.cardButton}
              onPress={() =>
                router.push({
                  pathname: "/task",
                  params: {
                    title: item.title,
                    clue: item.clue,
                    task: item.task,
                  },
                })
              }
            >
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>{item.emoji}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardHint}>{item.clue}</Text>
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.grey,
    marginBottom: 18,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 13,
    color: Colors.grey,
  },
});
