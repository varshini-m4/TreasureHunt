import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function Clouds() {
  const cloud1 = useRef(new Animated.Value(-120)).current;
  const cloud2 = useRef(new Animated.Value(450)).current;
  const cloud3 = useRef(new Animated.Value(-180)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloud1, {
        toValue: 450,
        duration: 28000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloud2, {
        toValue: -150,
        duration: 34000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloud3, {
        toValue: 450,
        duration: 40000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <>
      <Animated.View
        style={[
          styles.cloud,
          {
            top: 60,
            transform: [{ translateX: cloud1 }],
          },
        ]}
      >
        <Text style={styles.emoji}>☁️</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.cloud,
          {
            top: 170,
            transform: [{ translateX: cloud2 }],
          },
        ]}
      >
        <Text style={styles.emoji}>☁️</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.cloud,
          {
            top: 300,
            transform: [{ translateX: cloud3 }],
          },
        ]}
      >
        <Text style={styles.emoji}>☁️</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: "absolute",
    zIndex: 2,
  },

  emoji: {
    fontSize: 52,
    opacity: 0.95,
  },
});