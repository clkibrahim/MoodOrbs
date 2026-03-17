import React from "react";
import { View, Text, Image, Pressable, StyleSheet, Modal } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { DayData } from "../types/mood";
import { MOOD_CONFIG } from "../constants/moods";

interface DayDetailProps {
  data: DayData | null;
  onClose: () => void;
  fontFamily?: string;
}

export default function DayDetail({ data, onClose, fontFamily }: DayDetailProps) {
  if (!data) return null;

  const font = fontFamily ? { fontFamily } : {};
  const { color, orb } = MOOD_CONFIG[data.mood];
  const moodLabel = data.mood.charAt(0).toUpperCase() + data.mood.slice(1);

  return (
    <Modal transparent animationType="fade" visible={!!data} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.card}>

          <View style={styles.header}>
            <Image source={orb} style={styles.orb} resizeMode="contain" />
            <View>
              <Text style={[styles.date, font]}>June {data.day}, 2025</Text>
              <Text style={[styles.mood, { color }, font]}>{moodLabel}</Text>
            </View>
          </View>

          <Text style={[styles.summary, font]}>{data.summary}</Text>

          <Text style={[styles.sectionTitle, font]}>Mood Distribution</Text>
          {data.distribution?.map((d) => (
            <View key={d.label} style={styles.barRow}>
              <Text style={[styles.barLabel, font]}>{d.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { backgroundColor: d.color, width: `${d.pct}%` }]} />
              </View>
              <Text style={[styles.barPct, { color: d.color }, font]}>{d.pct}%</Text>
            </View>
          ))}

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeTxt, font]}>Close</Text>
          </Pressable>

        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#131929",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  header:  { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 },
  orb:     { width: 60, height: 60 },
  date:    { fontSize: 13, color: "#9AA6C4" },
  mood:    { fontSize: 22 },
  summary: { fontSize: 13, color: "#9AA6C4", lineHeight: 20, marginBottom: 18 },
  sectionTitle: { fontSize: 11, color: "#9AA6C4", letterSpacing: 0.5, marginBottom: 12 },
  barRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  barLabel:{ fontSize: 13, color: "#fff", width: 44 },
  barTrack:{
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  barFill: { height: 4, borderRadius: 2 },
  barPct:  { fontSize: 12, width: 36, textAlign: "right" },
  closeBtn:{ marginTop: 20, alignItems: "center", paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)" },
  closeTxt:{ fontSize: 14, color: "#9AA6C4" },
});
