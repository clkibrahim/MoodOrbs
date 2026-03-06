import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface HomeScreenProps {
  session: Session;
}

export default function HomeScreen({ session }: HomeScreenProps) {
  const user = session.user;
  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Kullanıcı";
  const avatarUrl = user.user_metadata?.avatar_url;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Çıkış Hatası", error.message);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#0B0E1A", "#111936", "#0B0E1A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        {/* Küre placeholder */}
        <View style={styles.orbContainer}>
          <View style={styles.mainOrb}>
            <View style={styles.orbInnerGlow} />
            <View style={styles.orbHighlight} />
          </View>
          <View style={styles.orbOuterGlow} />
        </View>

        <Text style={styles.greeting}>Merhaba, {userName}!</Text>
        <Text style={styles.subtitle}>
          Bugünün küresi müzik dinledikçe{"\n"}şekillenecek...
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Şarkı</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Baskın Duygu</Text>
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0E1A",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  /* ── Main Orb (placeholder) ── */
  orbContainer: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  mainOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFD700",
    opacity: 0.7,
    overflow: "hidden",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  orbInnerGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 215, 0, 0.3)",
  },
  orbHighlight: {
    position: "absolute",
    width: 55,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 20,
    left: 25,
  },
  orbOuterGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 215, 0, 0.08)",
  },

  /* ── Text ── */
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(255, 215, 0, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 50,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFD700",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 4,
  },

  /* ── Logout ── */
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logoutText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: "500",
  },
});
