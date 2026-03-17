import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { useAuth } from "./src/hooks/useAuth";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { supabase } from "./src/lib/supabase";

export default function App() {
  const { session, loading } = useAuth();

  // Implicit OAuth redirect'ten gelen deep link'i yakala.
  // Bu handler, uygulama zaten açıkken veya coldstart durumunda
  // gelen exp:// URL'lerini dinler.
  // NOT: Ana login akışı LoginScreen'deki openAuthSessionAsync ile yönetilir.
  // Bu handler sadece fallback olarak çalışır (ör. tarayıcı dışından gelen redirect).
  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      console.log("🔗 Linking URL geldi:", url);

      // Sadece auth callback URL'lerini işle
      if (!url?.includes("auth-callback")) return;

      // Implicit flow: #access_token=XXX fragment'ını yakala
      const fragment = url.split("#")[1] || "";
      if (fragment) {
        const hashParams = new URLSearchParams(fragment);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken) {
          console.log("🔑 Linking üzerinden token yakalandı, session kuruluyor...");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          if (error) {
            console.error("❌ setSession hatası:", error.message);
          } else {
            console.log("✅ Oturum Linking üzerinden kuruldu:", data.session?.user?.email);
          }
          return;
        }
      }

      console.warn("⚠️ auth-callback URL'de token bulunamadı:", url);
    };

    // Uygulama açıkken gelen URL'leri dinle
    const sub = Linking.addEventListener("url", handleUrl);

    // Uygulama kapalıyken gelip açılan URL'yi de yakala (coldstart)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => sub.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return session ? <HomeScreen session={session} /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#080B18",
    alignItems: "center",
    justifyContent: "center",
  },
});
