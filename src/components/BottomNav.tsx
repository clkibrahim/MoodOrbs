import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type TabKey = "today" | "timeline" | "insights";

interface BottomNavProps {
  active: TabKey;
  onPress: (tab: TabKey) => void;
  fontFamily?: string;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "today",    label: "Today",    icon: "◎" },
  { key: "timeline", label: "Timeline", icon: "◷" },
  { key: "insights", label: "Insights", icon: "▦" },
];

export default function BottomNav({ active, onPress, fontFamily }: BottomNavProps) {
  const font = fontFamily ? { fontFamily } : {};

  return (
    <View style={styles.nav}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onPress(tab.key)}>
            <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive, font]}>{tab.label}</Text>
            {isActive && <View style={styles.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: "#0B1022",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingBottom: 24,
    paddingTop: 10,
  },
  tab:        { flex: 1, alignItems: "center", gap: 3 },
  icon:       { fontSize: 20, color: "rgba(255,255,255,0.28)" },
  iconActive: { color: "#9747FF" },
  label:      { fontSize: 11, color: "rgba(255,255,255,0.28)" },
  labelActive:{ color: "#9747FF" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9747FF",
    marginTop: 2,
  },
});
