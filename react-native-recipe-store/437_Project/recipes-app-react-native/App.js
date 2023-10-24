import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppContainer from "./src/navigations/AppNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import styles from "./styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHZvLjyDai0WaKFnHJE0rvAZDE8Qy_t94",
  authDomain: "project-4fe07.firebaseapp.com",
  projectId: "project-4fe07",
  storageBucket: "project-4fe07.appspot.com",
  messagingSenderId: "165010098186",
  appId: "1:165010098186:web:0ed1ad23f996c9292b77f3",
  measurementId: "G-5XF3EFK25Z",
};

const Stack = createStackNavigator();
const app = initializeApp(firebaseConfig);

export default function App() {
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
      <AppContainer user={user}/>
  );
}