import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight, StyleSheet, Button, Pressable } from "react-native";
import { awsIP } from '../../Utility'
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import * as Location from 'expo-location';
import { CommonActions } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 150,
    paddingTop: 50,
  },
  item: {
    padding: 10,
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#90EE90',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
  pressable: {
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50C878',
    borderRadius: 8,
  },
});

export default function OnboardingStoresScreen(props) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]); // New state variable for the selected stores
  const localFetchURL = awsIP + '/allStores'
  const locationFetchURL = awsIP + '/allStoresByDistance'
  const [locationPressed, setLocationPressed] = useState(false);
  const route = useRoute();
  const fromHome = route.params?.fromHome

  const onPressContinue = async () => {
    sendUpdatedStores()

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  const sendUpdatedStores = async () => {
    const auth = getAuth();
    const db = getFirestore();
    if (auth.currentUser) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, {
        pinnedStores: selectedStores,
      });
    }
  }

  const gatherData = async () => {
    const response = await fetch(localFetchURL)
    setData((await response.json()).map(item => {
      return ({
        id: item.id,
        title: item.title,
        distance: item.distance
      })
    }
    ));
  }

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log(location);

      // Call your API endpoint with the user's latitude and longitude
      const response = await fetch(locationFetchURL + `/${location.coords.latitude}/${location.coords.longitude}`);
      const stores = await response.json();

      // Now 'stores' contains the stores ordered by distance from the user's location
      console.log(stores);

      // Set the state of your data to the ordered stores
      setData(stores.map(item => {
        return ({
          id: item.id,
          title: item.title,
          distance: item.distance
        })
      }));
    } catch (error) {
      console.log(error);
    }
    setLocationPressed(true);
  };



  useEffect(() => {
    gatherData();
  }, []);

  const onPressStore = (item) => {
    if (selectedStores.includes(item.id)) {
      setSelectedStores(selectedStores.filter(storeId => storeId !== item.id)); // Remove the store from the selected stores if it's already selected
    } else {
      setSelectedStores([...selectedStores, item.id]); // Add the store to the selected stores if it's not already selected
    }
  };

  const renderStores = ({ item }) => {
    if (item.title === undefined) return;
    return (
      <TouchableHighlight
        onPress={() => onPressStore(item)}
        style={[
          styles.item,
          selectedStores.includes(item.id) && styles.selectedItem,
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ flex: 1 }}>{item.title}</Text>
          {locationPressed && (
            <Text style={{ flex: 1, textAlign: 'right' }}>
              {item.distance !== undefined ? item.distance.toFixed(2) + ' miles' : ''}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    );
  };

  const onPressSetNewPS = async () => {
    if (selectedStores.length === 0) {
      alert("You must add some stores to your new list, before you set it as your new Pinned Stores.")
      return
    }

    sendUpdatedStores()
    alert("Your pinned stores have been set to your new list.")

  }

  function renderNavButtons() {
    return (fromHome
      ? <View style={{ flexDirection: 'row' }}>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { flex: 1 },
            { backgroundColor: pressed ? '#808080' : '#50C878' },
          ]}
          onPress={onPressSetNewPS}
          disabled={selectedStores.length === 0}
        >
          <Text style={{ color: '#FFFFFF' }}>Set New Pinned Stores</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { flex: 1 },
            { backgroundColor: pressed ? '#50C878' : '#808080' },
          ]}
          onPress={onPressHome}
        >
          <Text style={{ color: '#FFFFFF' }}>Back Home</Text>
        </Pressable>
      </View>
      : <View style={{ flexDirection: 'row' }}>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { flex: 1 },
            { backgroundColor: pressed ? '#808080' : '#50C878' },
          ]}
          onPress={onPressContinue}
          disabled={selectedStores.length === 0}
        >
          <Text style={{ color: '#FFFFFF' }}>Continue</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { flex: 1 },
            { backgroundColor: pressed ? '#50C878' : '#808080' },
          ]}
          onPress={onPressHome}
        >
          <Text style={{ color: '#FFFFFF' }}>Skip</Text>
        </Pressable>
      </View>)
  }

  const onPressHome = () => {
    navigation.navigate('Home')
  }



  return (

    <View style={[styles.container, { flexDirection: 'column' }]}>
      <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: 'center' }}>Select your favorite grocery stores:</Text>
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={data}
        renderItem={renderStores}
        keyExtractor={(item) => `${item.id}`}
        style={{
          flex: 1,
        }}
      />

      <View style={{ position: 'absolute', bottom: 20, left: 10, right: 10 }}>
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            { backgroundColor: pressed ? '#808080' : '#50C878' },
          ]}
          onPress={getLocation}
        >
          <Text style={{ color: '#FFFFFF' }}>Sort by Nearest Location</Text>
        </Pressable>
        {renderNavButtons()}
      </View>
    </View>
  );
}



/**<Pressable
              style={({ pressed }) => [
                styles.pressable,
                { flex: 1 },
                { backgroundColor: pressed ? '#808080' : '#50C878' },
              ]}
              onPress={() => navigation.navigate('Home')}
              >
              <Text style={{ color: '#FFFFFF' }}>Skip</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.pressable,
              { flex: 1 },
              { backgroundColor: pressed ? '#50C878' : '#808080' },
            ]}
            onPress={onPressContinue}
            disabled={selectedStores.length === 0}
          >
            <Text style={{ color: '#FFFFFF' }}>Continue</Text>
          </Pressable> */