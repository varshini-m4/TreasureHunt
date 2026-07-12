import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";

const { width, height } = Dimensions.get("window");

const petals = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: Math.random() * width,
  delay: Math.random() * 6000,
  duration: 9000 + Math.random() * 5000,
  size: 18 + Math.random() * 10,
}));

export default function Petals() {
  return (
    <>
      {petals.map((petal) => (
        <FallingPetal key={petal.id} {...petal} />
      ))}
    </>
  );
}

function FallingPetal({
  left,
  delay,
  duration,
  size,
}: {
  left: number;
  delay: number;
  duration: number;
  size: number;
}) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 100,
            duration,
            useNativeDriver: true,
          }),

          Animated.loop(
            Animated.sequence([
              Animated.timing(translateX, {
                toValue: 18,
                duration: 1200,
                useNativeDriver: true,
              }),

              Animated.timing(translateX, {
                toValue: -18,
                duration: 1200,
                useNativeDriver: true,
              }),
            ])
          ),

          Animated.timing(rotate, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Text
      style={[
        styles.petal,
        {
          left,
          fontSize: size,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotation },
          ],
        },
      ]}
    >
      🌸
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  petal: {
    position: "absolute",
    top: -100,
    zIndex: 3,
    opacity: 0.8,
  },
});