import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Salsa_400Regular } from "@expo-google-fonts/salsa";
import Animated, { FadeIn } from "react-native-reanimated";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import BottomNav, { TabKey } from "../components/BottomNav";
import TodayScreen from "./TodayScreen";
import TimelineScreen from "./TimelineScreen";

interface HomeScreenProps {
  session: Session;
}

export default function HomeScreen({ session }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [fontsLoaded] = useFonts({ Salsa_400Regular });

  const user = session.user;
  const firstName = (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User"
  ).split(" ")[0];

  const fontFamily = fontsLoaded ? "Salsa_400Regular" : undefined;
  const font = fontFamily ? { fontFamily } : {};

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Hesabından çıkmak istiyor musun?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert("Hata", error.message);
        },
      },
    ]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "today":
        return <TodayScreen fontFamily={fontFamily} />;
      case "timeline":
        return <TimelineScreen fontFamily={fontFamily} />;
      case "insights":
        return (
          <View style={styles.placeholder}>
            <Text style={[styles.placeholderText, font]}>Insights coming soon…</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#0B1022", "#0D1530", "#0B1022"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Üst Bar (tüm sekmelerde sabit) ── */}
      <Animated.View entering={FadeIn.duration(600)} style={styles.topBar}>
        <View>
          <Text style={[styles.headerTitle, font]}>
            {activeTab === "today" ? "Today" : activeTab === "timeline" ? "Timeline" : "Insights"}
          </Text>
          <Text style={[styles.headerSub, font]}>
            {activeTab === "today" ? "Your day in music" : activeTab === "timeline" ? "Your mood history" : "Weekly overview"}
          </Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.avatarBtn}>
          <LinearGradient colors={["#1DB954", "#1AA34A"]} style={styles.avatarGradient}>
            <Text style={[styles.avatarInitial, font]}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* ── İçerik ── */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* ── Bottom Nav ── */}
      <BottomNav active={activeTab} onPress={setActiveTab} fontFamily={fontFamily} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B1022" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, color: "#FFFFFF" },
  headerSub:   { fontSize: 14, color: "#9AA6C4", marginTop: 2 },
  avatarBtn:   { borderRadius: 24, overflow: "hidden" },
  avatarGradient: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitial: { fontSize: 18, color: "#fff" },

  content: { flex: 1 },

  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderText: { fontSize: 16, color: "#9AA6C4" },
});
