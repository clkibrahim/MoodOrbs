import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { makeRedirectUri } from "expo-auth-session";
import Animated, { FadeIn } from "react-native-reanimated";
import { supabase } from "../lib/supabase";
import FloatingOrb from "../components/FloatingOrb";

/* ────────────────────────────────────────────
   Sabitler
   ──────────────────────────────────────────── */

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const REDIRECT_URI = makeRedirectUri({ path: "auth-callback" });
console.log("✅ Redirect URI (bunu Supabase'e ekle):", REDIRECT_URI);

const ORB_CONFIGS = [
  { source: require("../../assets/Happy.png"),      size: 170, startX: 0.15, startY: 0.10, delay: 0,    duration: 7000 },
  { source: require("../../assets/Dreamy.png"),     size: 140, startX: 0.78, startY: 0.18, delay: 800,  duration: 8500 },
  { source: require("../../assets/Melancholic.png"),size: 130, startX: 0.55, startY: 0.65, delay: 400,  duration: 9000 },
  { source: require("../../assets/Hype.png"),       size: 100, startX: 0.20, startY: 0.58, delay: 1200, duration: 6500 },
  { source: require("../../assets/Happy.png"),      size: 90,  startX: 0.82, startY: 0.72, delay: 600,  duration: 7500 },
  { source: require("../../assets/Dreamy.png"),     size: 65,  startX: 0.42, startY: 0.30, delay: 1500, duration: 5500 },
  { source: require("../../assets/Melancholic.png"),size: 55,  startX: 0.65, startY: 0.45, delay: 300,  duration: 6000 },
  { source: require("../../assets/Hype.png"),       size: 50,  startX: 0.30, startY: 0.82, delay: 900,  duration: 5000 },
];

/* ────────────────────────────────────────────
   Login Screen
   ──────────────────────────────────────────── */

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);



  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
          scopes:
            "user-read-recently-played user-read-playback-state user-top-read user-library-read",
          queryParams: { show_dialog: "true" },
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("OAuth URL alınamadı.");

      console.log("🔗 OAuth URL açılıyor:", data.url);
      console.log("📍 Redirect URI:", REDIRECT_URI);

      // openAuthSessionAsync: In-app browser açar, redirect URI'ya
      // dönüş olduğunda otomatik kapatır ve tam URL'yi döndürür.
      // Implicit flow'da URL fragment (#access_token=...) içerir.
      const { openAuthSessionAsync } = await import("expo-web-browser");
      const result = await openAuthSessionAsync(data.url, REDIRECT_URI);

      console.log("🔁 Auth session sonucu:", result.type);

      if (result.type === "success" && result.url) {
        console.log("🔗 Redirect URL:", result.url);

        // Implicit flow: #access_token=XXX&refresh_token=XXX fragment'ını çıkar
        const fragment = result.url.split("#")[1] || "";
        const hashParams = new URLSearchParams(fragment);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken) {
          console.log("🔑 Token bulundu, session kuruluyor...");
          const { data: sessionData, error: setErr } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
          if (setErr) {
            console.error("❌ setSession hatası:", setErr.message);
            Alert.alert("Giriş Hatası", setErr.message);
          } else {
            console.log(
              "✅ Giriş başarılı:",
              sessionData.session?.user?.email
            );
          }
        } else {
          console.warn("⚠️ URL fragment'ta access_token bulunamadı:", result.url);
          Alert.alert(
            "Giriş Hatası",
            "Spotify'dan token alınamadı. Lütfen tekrar deneyin."
          );
        }
      } else if (result.type === "cancel") {
        console.log("ℹ️ Kullanıcı girişi iptal etti");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      Alert.alert("Giriş Hatası", message);
      console.error("❌ Login hatası:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Background Gradient ── */}
      <LinearGradient
        colors={["#0B0E1A", "#111936", "#0B0E1A"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Floating Orbs ── */}
      {ORB_CONFIGS.map((orb, i) => (
        <FloatingOrb key={i} {...orb} screenW={SCREEN_W} screenH={SCREEN_H} />
      ))}

      {/* ── Content ── */}
      <Animated.View entering={FadeIn.duration(1200).delay(200)} style={styles.content}>
        {/* App title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MoodOrbs</Text>
          <Text style={styles.subtitle}>
            Her gün bir anıdır{"\n"}ve her anı bir renge sahiptir.
          </Text>
        </View>

        {/* Spotify login button */}
        <Pressable
          onPress={handleSpotifyLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.spotifyButton,
            pressed && styles.spotifyButtonPressed,
          ]}
        >
          <LinearGradient
            colors={["#1DB954", "#1AA34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spotifyButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                {/* Simple Spotify icon via Unicode / text (avoids extra deps) */}
                <SpotifyIcon />
                <Text style={styles.spotifyButtonText}>
                  Spotify ile Giriş Yap
                </Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        <Text style={styles.disclaimer}>
          Giriş yaparak, Spotify dinleme verilerinizin{"\n"}
          analiz edilmesini kabul edersiniz.
        </Text>
      </Animated.View>
    </View>
  );
}

/* ────────────────────────────────────────────
   Minimal Spotify Icon (SVG-free)
   ──────────────────────────────────────────── */

const SpotifyIcon: React.FC = () => (
  <View style={spotifyIconStyles.wrapper}>
    <View style={spotifyIconStyles.circle}>
      <View style={[spotifyIconStyles.bar, spotifyIconStyles.bar1]} />
      <View style={[spotifyIconStyles.bar, spotifyIconStyles.bar2]} />
      <View style={[spotifyIconStyles.bar, spotifyIconStyles.bar3]} />
    </View>
  </View>
);

const spotifyIconStyles = StyleSheet.create({
  wrapper: { marginRight: 10 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bar: {
    position: "absolute",
    height: 2.5,
    backgroundColor: "#1DB954",
    borderRadius: 2,
  },
  bar1: { width: 14, top: 6.5, transform: [{ rotate: "-8deg" }] },
  bar2: { width: 11, top: 10.5, transform: [{ rotate: "-6deg" }] },
  bar3: { width: 8, top: 14.5, transform: [{ rotate: "-4deg" }] },
});

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0E1A",
  },


  /* ── Content ── */
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80,
    paddingHorizontal: 30,
  },

  /* ── Title ── */
  titleContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(255, 215, 0, 0.45)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },

  /* ── Spotify Button ── */
  spotifyButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  spotifyButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  spotifyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  spotifyButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* ── Disclaimer ── */
  disclaimer: {
    marginTop: 20,
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    lineHeight: 16,
  },
});
