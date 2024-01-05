import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"; // Import Firebase auth functions
import * as Location from 'expo-location';
import Store from "../../Utility.js"
import { CommonActions } from '@react-navigation/native';

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const handleLogin = async () => {
    const auth = getAuth(); // Initialize Firebase Auth
  
    try {
      await signInWithEmailAndPassword(auth, email, password); // Sign in user with email and password
  
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // Get the user's location
        // const location = await Location.getCurrentPositionAsync({});
        //FETCHING STORE DATA
        fetch('http://172.16.61.84:3000/DummyData')
        .then(response => response.json())
        .then(data => {
          const stores = data.map(storeData => new Store(storeData));
          console.log(stores)
        })
        .catch(error => console.error('Error:', error));
        
        // // Send location to  backend
        // fetch('http://172.16.61.37:3000/location', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(location),
        // });
        //Replace with any ingredient
        fetch('http://172.16.61.84:3000/ingredient/Tomato')
  .then(response => response.json())
  .then(data => {

    data.forEach(storeInfo => {
      console.log('Store:', storeInfo.store);
      console.log('Ingredient price:', storeInfo.ingredient.price);
      console.log('Ingredient discount:', storeInfo.ingredient.discount);
      console.log('Recipes:', storeInfo.recipes);
    });
  })
  .catch(error => console.error('Error:', error));


      }
  
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.mainWindow}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bottomBar} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.bottomText}> </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;

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
