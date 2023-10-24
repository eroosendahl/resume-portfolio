import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
} from "react-native";
import styles from "./styles";
import { ingredients, recipes } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName } from "../../data/MockDataAPI";
import { dummyStoresData } from "../../dummyData/dummyData";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import {awsIP} from '../../Utility'


export default function InspectStoreScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const route = useRoute();
  const storeItem = route.params?.storeItem;
  const localFetchURL = awsIP + '/StoreData/' + storeItem.id


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const gatherData = async () => {
    const response = await fetch(localFetchURL)
    setData(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressIngredient = (item, storeItem) => {
    navigation.navigate("IngredientByStore", { ingredient: item, storeItem: storeItem });
  };

  const renderIngredients = ({ item }, storeItem) => (
    <TouchableHighlight
      style={styles.itemContainer}
      underlayColor="#f0f0f0"
      onPress={() => onPressIngredient(item, storeItem)}
    >
      <View style={styles.itemDetails}>
        <Image style={styles.itemImage} source={{ uri: item.image }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            Original Price: ${item.price.toFixed(2)}
          </Text>
          <Text style={styles.itemPrice}>
            Discounted Price: ${(item.price - item.discount).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const onPressRecipe = (item) => {
    alert("You picked a recipe - great job!")
  }

  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => onPressRecipe(item)}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}
            </Text>
            <Text style={styles.itemIngredients}>Ingredients: {ingredients}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  //title is vestige from HomeScreen, this page would have a single object instead of array of objects
  const renderAllStores = (storeItem) => {
    const ingredientsData = storeItem.ingredients;
    const recipesData = storeItem.recipes;

    if (storeItem.id === undefined) return;

    return (
      <View style={styles.storeContainer} key={storeItem.id}>
        {/* Store name with updated style */}
        <Text style={styles.storeHeaderText}>{storeItem.title}</Text>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Ingredients</Text>
        </View>

        {/* Render ingredients list */}
        <FlatList
          horizontal
          data={ingredientsData}
          renderItem={(item) => renderIngredients(item, storeItem)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Recipes</Text>
        </View>

        {/* Render recipes list */}
        <FlatList
          horizontal
          data={recipesData}
          renderItem={renderRecipes}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <Text style={styles.loadingText}>
        LOADING
      </Text>
    )
  }
  else return (
    <ScrollView style={styles.HomeScrollBox}>
      {renderAllStores(data)}
    </ScrollView>
  );
}
