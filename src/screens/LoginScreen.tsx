import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  FadeIn,
} from "react-native-reanimated";
import { supabase } from "../lib/supabase";

/* ────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────── */

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = makeRedirectUri();

// ⚠️ Bu URI'yi Supabase Dashboard → URL Configuration'a eklemelisin
console.log("✅ Redirect URI (bunu Supabase'e ekle):", REDIRECT_URI);

/** Inside‑Out inspired mood colours */
const ORB_COLORS = {
  joy: "#FFD700",
  sadness: "#1E5AA8",
  anger: "#E23B3B",
  fear: "#8A2BE2",
  anxiety: "#FF8C00",
} as const;

/* ────────────────────────────────────────────
   Floating Orb Component
   ──────────────────────────────────────────── */

interface OrbProps {
  /** Dominant hue of the orb */
  color: string;
  /** Orb diameter */
  size: number;
  /** Starting X position (0‑1 ratio of screen width) */
  startX: number;
  /** Starting Y position (0‑1 ratio of screen height) */
  startY: number;
  /** Animation delay in ms so each orb drifts independently */
  delay: number;
}

const FloatingOrb: React.FC<OrbProps> = ({
  color,
  size,
  startX,
  startY,
  delay,
}) => {
  const progress = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Gentle vertical float
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 5000 + Math.random() * 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 5000 + Math.random() * 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        true
      )
    );

    // Subtle glow pulse
    pulse.value = withDelay(
      delay + 400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -35]);
    const translateX = interpolate(progress.value, [0, 0.5, 1], [0, 12, 0]);
    const scale = interpolate(pulse.value, [0, 1], [1, 1.08]);
    const opacity = interpolate(pulse.value, [0, 1], [0.55, 0.85]);

    return {
      transform: [{ translateY }, { translateX }, { scale }],
      opacity,
    };
  });

  const glowSize = size * 1.6;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX * SCREEN_W - size / 2,
          top: startY * SCREEN_H - size / 2,
        },
        animatedStyle,
      ]}
    >
      {/* Outer soft glow */}
      <View
        style={[
          styles.orbGlow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: color,
            left: -(glowSize - size) / 2,
            top: -(glowSize - size) / 2,
          },
        ]}
      />
      {/* Main orb body */}
      <View
        style={[
          styles.orbBody,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        {/* Inner highlight – glass reflection */}
        <View
          style={[
            styles.orbHighlight,
            {
              width: size * 0.45,
              height: size * 0.25,
              borderRadius: size * 0.25,
              top: size * 0.14,
              left: size * 0.18,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

/* ────────────────────────────────────────────
   Orb configurations (memoised)
   ──────────────────────────────────────────── */

const ORB_CONFIGS: OrbProps[] = [
  { color: ORB_COLORS.joy, size: 110, startX: 0.2, startY: 0.15, delay: 0 },
  { color: ORB_COLORS.sadness, size: 85, startX: 0.75, startY: 0.22, delay: 600 },
  { color: ORB_COLORS.anger, size: 65, startX: 0.55, startY: 0.55, delay: 1200 },
  { color: ORB_COLORS.fear, size: 95, startX: 0.15, startY: 0.62, delay: 300 },
  { color: ORB_COLORS.anxiety, size: 70, startX: 0.8, startY: 0.72, delay: 900 },
  { color: ORB_COLORS.joy, size: 50, startX: 0.45, startY: 0.35, delay: 1500 },
  { color: ORB_COLORS.sadness, size: 55, startX: 0.35, startY: 0.82, delay: 400 },
];

/* ────────────────────────────────────────────
   Login Screen
   ──────────────────────────────────────────── */

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);

  // Android'de browser'ı önceden ısıt (daha hızlı açılır)
  useEffect(() => {
    if (Platform.OS === "android") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);

      // Önceki takılı kalmış browser session'ı temizle
      await WebBrowser.dismissBrowser();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
          scopes:
            "user-read-recently-played user-read-playback-state user-top-read user-library-read",
          queryParams: {
            // Her girişte Spotify hesap seçim ekranını göster
            show_dialog: "true",
          },
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("OAuth URL alınamadı.");

      console.log("🔗 OAuth URL:", data.url);
      console.log("🔙 Redirect URI:", REDIRECT_URI);

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URI
      );

      console.log("📦 Auth result:", JSON.stringify(result, null, 2));

      if (result.type === "success" && result.url) {
        // URL'den token'ları çıkar — hash veya query olabilir
        const returnedUrl = result.url;
        let accessToken: string | null = null;
        let refreshToken: string | null = null;

        // #access_token=... formatı (hash fragment)
        if (returnedUrl.includes("#")) {
          const hashPart = returnedUrl.split("#")[1];
          const params = new URLSearchParams(hashPart);
          accessToken = params.get("access_token");
          refreshToken = params.get("refresh_token");
        }

        // ?access_token=... formatı (query string fallback)
        if (!accessToken && returnedUrl.includes("?")) {
          const queryPart = returnedUrl.split("?")[1];
          const params = new URLSearchParams(queryPart);
          accessToken = params.get("access_token");
          refreshToken = params.get("refresh_token");
        }

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;

          console.log("✅ Oturum başarıyla oluşturuldu!");
        } else {
          console.warn("⚠️ Token'lar URL'de bulunamadı:", returnedUrl);
        }
      } else if (result.type === "cancel" || result.type === "dismiss") {
        console.log("ℹ️ Kullanıcı girişi iptal etti.");
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
        <FloatingOrb key={i} {...orb} />
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

  /* ── Orbs ── */
  orbGlow: {
    position: "absolute",
    opacity: 0.22,
  },
  orbBody: {
    overflow: "hidden",
    // Translucent glass look
    opacity: 0.6,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  orbHighlight: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.45)",
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
