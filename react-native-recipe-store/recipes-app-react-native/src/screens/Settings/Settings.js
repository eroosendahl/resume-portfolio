import React from "react";
import { StyleSheet, View, Text, Button, Settings } from "react-native";
import { useNavigation } from '@react-navigation/native';

function SettingScreen()  {
    const navigation = useNavigation();


    return (
      <View style={styles.outerBox}>
        <View style={styles.topBar}>
          <Text>TopBar!</Text>
        </View>
        <View style={styles.mainWindow}>
          <Text>MainWindow!</Text>
        </View>
        <View style={styles.bottomBar}>
          <Text>bottomBar!</Text>
        </View>
      </View>
    );
}

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    outerBox: {
      flex:1,
  
      height: "100%",
      backgroundColor: 'white',
      alignItems: 'center',
      borderStyle: "solid",
      borderColor: "blue",
      borderWidth: "4px"
    },
    mainWindow: {
      width: '90%',
      height: '80%',
      borderStyle: "solid",
      borderColor: "red",
      borderWidth: "1px"
    },
    topBar: {
      flex:1,
      maxHeight: '10%',
      width: '90%',
      height: "8%",
      borderStyle: "solid",
      borderColor: "green",
      borderWidth: "2px"
    },
    bottomBar: {
      flex:1,
      maxHeight: '10%',
      width: '90%',
      height: "8%",
      borderStyle: "solid",
      borderColor: "violet",
      borderWidth: "2px"
    }
  });