import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { CommonActions } from '@react-navigation/native';


function Signup() {
  
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = async () => {
    const auth = getAuth(); // Initialize Firebase Auth
    const db = getFirestore(); // Initialize Firestore
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
  
      // Only write to Firestore if the user is authenticated 
      if (user) {
        sendEmailVerification(user).then(() => {
          Alert.alert(
            "Verification Email Sent",
            "You will receive an email shortly to verify your account.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        });
  
        // Add a new document in collection "users" with ID = user's UID
        await setDoc(doc(db, "users", user.uid), {
          pinnedStores: ["RCZ90fzdrTNEDZdOCKRI", "FYRd3sKhDPPOqBeQiLlz"],
          recent: [
            {id: "", screen: "", type: "", storeid: ""},
            {id: "", screen: "", type: "", storeid: ""},
            {id: "", screen: "", type: "", storeid: ""},
            {id: "", screen: "", type: "", storeid: ""},
            {id: "", screen: "", type: "", storeid: ""}
          ]
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'OnboardingStoresScreen' }],
          })
        );
      }
      
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Sign Up</Text>
      </View>
      <View style={styles.mainWindow}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={navigateToLogin}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  title: {
    fontSize: 24,
    color: "#fff",
  },
  mainWindow: {
    width: "80%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  bottomBar: {
    marginTop: "auto",
  },
  bottomText: {
    color: "#555",
  },
  link: {
    color: "#3498db",
    textDecorationLine: "underline",
  },
});


