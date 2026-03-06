import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuth } from "./src/hooks/useAuth";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return session ? <HomeScreen session={session} /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#0B0E1A",
    alignItems: "center",
    justifyContent: "center",
  },
});
