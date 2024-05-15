import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppContainer from "./src/navigations/AppNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import { styles } from "./src/AppStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CartProvider } from "./src/CartContext";
import { LogBox } from 'react-native';

const firebaseConfig = {
  apiKey: "removed",
  authDomain: "removed",
  projectId: "removed",
  storageBucket: "removed",
  messagingSenderId: "removed",
  appId: "removed",
  measurementId: "removed",
};

const Stack = createStackNavigator();
const app = initializeApp(firebaseConfig);

export default function App() {

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Check if the user is already authenticated
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe; // Cleanup function to remove the listener when unmounting
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <CartProvider>
      <AppContainer user={user} />
    </CartProvider>

  );
}