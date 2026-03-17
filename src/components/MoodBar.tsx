import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface MoodBarProps {
  label: string;
  pct: number;
  color: string;
  orb: any;
  delay?: number;
  fontFamily?: string;
}

export default function MoodBar({ label, pct, color, orb, delay = 0, fontFamily }: MoodBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(pct / 100, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const font = fontFamily ? { fontFamily } : {};

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(delay)} style={styles.row}>
      <Image source={orb} style={styles.orb} resizeMode="contain" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.label, font]}>{label}</Text>
          <Text style={[styles.pct, { color }, font]}>{pct}%</Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { backgroundColor: color }, barStyle]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  orb:     { width: 30, height: 30 },
  content: { flex: 1 },
  header:  { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label:   { fontSize: 14, color: "#FFFFFF" },
  pct:     { fontSize: 14 },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  fill: { height: 4, borderRadius: 2 },
});
