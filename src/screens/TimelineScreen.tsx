import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import DayCell from "../components/DayCell";
import DayDetail from "../components/DayDetail";
import { DayData } from "../types/mood";
import { MOOD_CONFIG, buildCalendar } from "../constants/moods";

const { width: SCREEN_W } = Dimensions.get("window");
const DAY_CELL_SIZE = (SCREEN_W - 44 - 6 * 6) / 7;

const WEEK_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CALENDAR_DAYS = buildCalendar();
const MOOD_KEYS = ["calm", "joy", "hype", "sad"] as const;

interface TimelineScreenProps {
  fontFamily?: string;
}

export default function TimelineScreen({ fontFamily }: TimelineScreenProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const font = fontFamily ? { fontFamily } : {};

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={[styles.headerTitle, font]}>Timeline</Text>
          <Text style={[styles.headerSub, font]}>Your mood history</Text>
        </Animated.View>

        {/* Ay Başlığı */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.monthRow}>
          <Text style={[styles.monthTitle, font]}>June 2025</Text>
        </Animated.View>

        {/* Hafta Başlıkları */}
        <View style={styles.weekHeader}>
          {WEEK_HEADERS.map((d) => (
            <Text key={d} style={[styles.weekHeaderText, font, { width: DAY_CELL_SIZE }]}>{d}</Text>
          ))}
        </View>

        {/* Takvim Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.grid}>
          {CALENDAR_DAYS.map((dayData, i) => (
            <DayCell
              key={i}
              data={dayData}
              cellSize={DAY_CELL_SIZE}
              onPress={setSelectedDay}
              fontFamily={fontFamily}
            />
          ))}
        </Animated.View>

        {/* Legend */}
        <Animated.View entering={FadeInDown.duration(500).delay(350)} style={styles.legend}>
          {MOOD_KEYS.map((key) => (
            <View key={key} style={styles.legendItem}>
              <Image source={MOOD_CONFIG[key].orb} style={styles.legendOrb} resizeMode="contain" />
              <Text style={[styles.legendLabel, { color: MOOD_CONFIG[key].color }, font]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </Animated.View>

      </ScrollView>

      <DayDetail data={selectedDay} onClose={() => setSelectedDay(null)} fontFamily={fontFamily} />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  scroll:  { paddingTop: 56, paddingHorizontal: 22, paddingBottom: 24 },
  header:  { marginBottom: 20 },
  headerTitle: { fontSize: 28, color: "#FFFFFF" },
  headerSub:   { fontSize: 14, color: "#9AA6C4", marginTop: 2 },
  monthRow:    { alignItems: "center", marginBottom: 16 },
  monthTitle:  { fontSize: 16, color: "#FFFFFF" },
  weekHeader:  { flexDirection: "row", marginBottom: 8 },
  weekHeaderText: { textAlign: "center", fontSize: 11, color: "#9AA6C4", marginHorizontal: 3 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  legendItem:  { alignItems: "center", gap: 4 },
  legendOrb:   { width: 28, height: 28 },
  legendLabel: { fontSize: 11 },
});
