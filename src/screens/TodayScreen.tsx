import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import HeroCluster from "../components/HeroCluster";
import MoodBar from "../components/MoodBar";
import { TODAY_DISTRIBUTION, TODAY_TIMELINE } from "../constants/moods";

interface TodayScreenProps {
  fontFamily?: string;
}

export default function TodayScreen({ fontFamily }: TodayScreenProps) {
  const font = fontFamily ? { fontFamily } : {};

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

      {/* Özet Metin */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.summarySection}>
        <Text style={[styles.moodSummary, font]}>
          Today felt mostly <Text style={[styles.moodHighlight, font]}>calm.</Text>
        </Text>
        <Text style={[styles.moodDetail, font]}>
          Your music today leaned toward relaxed and dreamy sounds.
        </Text>
      </Animated.View>

      {/* Hero Orb Cluster */}
      <Animated.View entering={FadeIn.duration(900).delay(200)} style={styles.heroSection}>
        <HeroCluster />
      </Animated.View>

      {/* Mood Distribution */}
      <Animated.View entering={FadeInDown.duration(600).delay(350)} style={styles.section}>
        <Text style={[styles.sectionTitle, font]}>Mood Distribution</Text>
        {TODAY_DISTRIBUTION.map((m, i) => (
          <MoodBar
            key={m.key}
            label={m.label}
            pct={m.pct}
            color={m.color}
            orb={m.orb}
            delay={400 + i * 80}
            fontFamily={fontFamily}
          />
        ))}
      </Animated.View>

      {/* Day Timeline */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(550)}
        style={[styles.section, { marginBottom: 32 }]}
      >
        <Text style={[styles.sectionTitle, font]}>Day Timeline</Text>
        <View style={styles.timelineRow}>
          {TODAY_TIMELINE.map((t) => (
            <View key={t.period} style={styles.timelineItem}>
              <Image source={t.orb} style={styles.timelineOrb} resizeMode="contain" />
              <Text style={[styles.timelineLabel, font]}>{t.period}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  summarySection: {
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  moodSummary:    { fontSize: 20, color: "#FFFFFF", textAlign: "center", marginBottom: 6 },
  moodHighlight:  { color: "#9747FF" },
  moodDetail:     { fontSize: 14, color: "#9AA6C4", textAlign: "center", lineHeight: 20 },
  heroSection:    { alignItems: "center", marginBottom: 16 },
  section:        { marginBottom: 24 },
  sectionTitle:   { fontSize: 11, color: "#9AA6C4", letterSpacing: 0.5, marginBottom: 14 },
  timelineRow:    { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8 },
  timelineItem:   { alignItems: "center", gap: 8 },
  timelineOrb:    { width: 58, height: 58 },
  timelineLabel:  { fontSize: 12, color: "#9AA6C4" },
});
