import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { DayData } from "../types/mood";
import { MOOD_CONFIG } from "../constants/moods";

interface DayCellProps {
  data: DayData;
  cellSize: number;
  onPress: (data: DayData) => void;
  fontFamily?: string;
}

export default function DayCell({ data, cellSize, onPress, fontFamily }: DayCellProps) {
  if (data.mood === "empty" || data.day === 0) {
    return <View style={{ width: cellSize, height: cellSize + 10, marginHorizontal: 3, marginVertical: 3 }} />;
  }

  const { orb, color } = MOOD_CONFIG[data.mood];
  const font = fontFamily ? { fontFamily } : {};

  return (
    <Pressable
      style={[styles.cell, { width: cellSize, height: cellSize + 10 }]}
      onPress={() => onPress(data)}
      android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
    >
      <Image source={orb} style={{ width: cellSize * 0.7, height: cellSize * 0.7 }} resizeMode="contain" />
      <Text style={[styles.num, { color }, font]}>{data.day}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    marginVertical: 3,
  },
  num: { fontSize: 10, marginTop: 2 },
});
