import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type Props = {
  left: number;
  top: number;
  scale?: number;
};

export default function CherryBlossomTree({
  left,
  top,
  scale = 1,
}: Props) {
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  type MiniBlossomProps = {
  x: number;
  y: number;
  scale?: number;
};

const MiniBlossom = ({ x, y, scale = 1 }: MiniBlossomProps) => (
  <View
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 24 * scale,
      height: 24 * scale,
    }}
  >
    {/* Top */}
    <View
      style={[
        styles.treePetal,
        {
          top: 0,
          left: 8 * scale,
          transform: [{ scale }],
        },
      ]}
    />

    {/* Bottom */}
    <View
      style={[
        styles.treePetal,
        {
          bottom: 0,
          left: 8 * scale,
          transform: [{ scale }],
        },
      ]}
    />

    {/* Left */}
    <View
      style={[
        styles.treePetal,
        {
          left: 0,
          top: 8 * scale,
          transform: [{ scale }],
        },
      ]}
    />

    {/* Right */}
    <View
      style={[
        styles.treePetal,
        {
          right: 0,
          top: 8 * scale,
          transform: [{ scale }],
        },
      ]}
    />

    {/* Diagonals */}
    <View style={[styles.treeSmallPetal, { top: 2 * scale, left: 2 * scale, transform: [{ scale }] }]} />
    <View style={[styles.treeSmallPetal, { top: 2 * scale, right: 2 * scale, transform: [{ scale }] }]} />
    <View style={[styles.treeSmallPetal, { bottom: 2 * scale, left: 2 * scale, transform: [{ scale }] }]} />
    <View style={[styles.treeSmallPetal, { bottom: 2 * scale, right: 2 * scale, transform: [{ scale }] }]} />

    <View
      style={[
        styles.treeCenter,
        {
          transform: [{ scale }],
        },
      ]}
    />
  </View>
);
  function Blossom({ x, y, size, color }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
      }}
    >
      <View style={[styles.petal,{left:size*0.2,top:0,backgroundColor:color, opacity:0.7}]} />

      <View style={[styles.petal,{left:0,top:size*0.28,backgroundColor:color}]} />

      <View style={[styles.petal,{right:0,top:size*0.29,backgroundColor:color}]} />

      <View style={[styles.petal,{left:size*0.4,bottom:0,backgroundColor:color}]} />

      <View style={[styles.petal,{left:size*0.12,top:size*0.14,backgroundColor:"#FFEAF4"}]} />

      <View style={[styles.petal,{right:size*0.11,top:size*0.14,backgroundColor:"#FFEAF4"}]} />

      <View style={styles.center}/>
    </View>
  );
}

  const rotate = sway.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-2deg", "2deg"],
  });

  return (
    <View
      style={[
        styles.container,
        {
          left,
          top,
          transform: [{ scale }],
        },
      ]}
    >
      
<View style={styles.trunk}>
    <View style={styles.trunkHighlight}/>
    <View style={styles.trunkShadow}/>
</View>

      <Animated.View
        style={[
          styles.canopy,
          {
            transform: [{ rotate }],
          },
        ]}
      >
        <View style={styles.branchLeft}/>
<View style={styles.branchRight}/>
<View style={styles.branchTop}/>


       {BLOSSOMS.map((b, i) => (
  <MiniBlossom
    key={i}
    x={b.x}
    y={b.y}
    scale={b.scale}
  />
))}
      </Animated.View>
      <View
  style={{
    position: "absolute",
    left: 55,
    top: 30,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFF8FC",
    opacity: 0.7,
  }}
/>
    </View>
  );
}

  const BLOSSOMS = [
    { x: 48, y: 4, scale: 1.4 },
    { x: 28, y: 18, scale: 1.3 },
    { x: 68, y: 18, scale: 1.5 },
    { x: 12, y: 38, scale: 1.25 },
    { x: 44, y: 36, scale: 1.6 },
    { x: 80, y: 42, scale: 1.4 },
    { x: 20, y: 64, scale: 1.3 },
    { x: 58, y: 68, scale: 1.5 },
    { x: 88, y: 72, scale: 1.25 },
    { x: 36, y: 88, scale: 1.27 },
    { x: 68, y: 94, scale: 1.5 },
    { x: 8, y: 76, scale: 1.3 },
  ];

const styles = StyleSheet.create({
  treePetal: {
  position: "absolute",
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#FFC7DE",

  shadowColor: "#FF96C7",
  shadowOpacity: 0.35,
  shadowRadius: 3,
  elevation: 2,
},

treeSmallPetal: {
  position: "absolute",
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#FFE3F0",
},

treeCenter: {
  position: "absolute",
  left: 8,
  top: 8,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#FFD54A",
},
    center:{
    position:"absolute",
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:"#FFF8FC",
    opacity:0.7,
    // backgroundColor:"#FFD94D",
    left:15,
    top:15,
},
petal:{
    position:"absolute",
    width:18,
    height:18,
    borderRadius:10,
},
    branchLeft:{
    position:"absolute",
    width:8,
    height:40,
    backgroundColor:"#7A4B27",
    top:45,
    left:42,
    transform:[{rotate:"-35deg"}]
},

branchRight:{
    position:"absolute",
    width:8,
    height:40,
    backgroundColor:"#7A4B27",
    top:45,
    right:42,
    transform:[{rotate:"35deg"}]
},

branchTop:{
    position:"absolute",
    width:8,
    height:40,
    backgroundColor:"#7A4B27",
    top:10,
    left:61,
    transform:[{rotate:"-90deg"}]
},

trunkHighlight:{
    position:"absolute",
    left:3,
    width:4,
    height:"100%",
    backgroundColor:"#B8845A",
},

trunkShadow:{
    position:"absolute",
    right:0,
    width:5,
    height:"100%",
    backgroundColor:"#6E4121",
},
  container: {
    position: "absolute",
    width: 140,
    height: 180,
    alignItems: "center",
  },

  trunk: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 95,
    borderRadius: 10,
    backgroundColor: "#8B5A2B",
  },

  canopy: {
    position: "absolute",
    top: 0,
    width: 130,
    height: 130,
  },

  blossom: {
    position: "absolute",
  },
});