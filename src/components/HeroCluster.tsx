import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

/* ─────────────────────────────────────────────────
   MiniOrb — Hero etrafında floating küçük orblar
   ───────────────────────────────────────────────── */

interface MiniOrbProps {
  source: any;
  size: number;
  x: number;
  y: number;
  delay: number;
}

function MiniOrb({ source, size, x, y, delay }: MiniOrbProps) {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0,   { duration: 2800, easing: Easing.inOut(Easing.sin) })
        ),
        -1, true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.Image
      source={source}
      style={[{ position: "absolute", width: size, height: size, left: x, top: y }, animStyle]}
      resizeMode="contain"
    />
  );
}

/* ─────────────────────────────────────────────────
   HeroCluster — Merkezi orb + etrafındaki küçükler
   ───────────────────────────────────────────────── */

const MINI_ORBS: MiniOrbProps[] = [
  { source: require("../../assets/Hype.png"),        size: 80, x: 10,  y: 100, delay: 0 },
  { source: require("../../assets/Melancholic.png"), size: 70, x: 238, y: 120, delay: 600 },
  { source: require("../../assets/Happy.png"),       size: 65, x: 125, y: 250, delay: 300 },
  { source: require("../../assets/Hype.png"),        size: 35, x: 40,  y: 220, delay: 900 },
  { source: require("../../assets/Melancholic.png"), size: 28, x: 255, y: 230, delay: 400 },
  { source: require("../../assets/Happy.png"),       size: 25, x: 60,  y: 60,  delay: 700 },
  { source: require("../../assets/Dreamy.png"),      size: 22, x: 250, y: 55,  delay: 200 },
];

export default function HeroCluster() {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0,  { duration: 3500, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0,  { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.cluster}>
      {MINI_ORBS.map((orb, i) => (
        <MiniOrb key={i} {...orb} />
      ))}
      <Animated.Image
        source={require("../../assets/Dreamy.png")}
        style={[styles.mainOrb, heroStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    width: 320,
    height: 300,
    position: "relative",
  },
  mainOrb: {
    position: "absolute",
    width: 160,
    height: 160,
    left: 80,
    top: 55,
  },
});
