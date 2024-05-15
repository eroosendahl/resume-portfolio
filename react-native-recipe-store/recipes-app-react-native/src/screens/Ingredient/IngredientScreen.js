import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import {styles} from "../../AppStyles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes } from '../../Utility'
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { CartContext } from "../../CartContext";
import { processItem } from "../../Utility";
export default function IngredientScreen(props) {
  const { navigation } = props;
  const route = useRoute();
  const targetIngredientItem = route.params?.ingredientItem;
  const [data, setData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const userUID = getAuth().currentUser.uid
  const updateRecent = awsIP + '/UpdateRecent/'
  const [userData, setUserData] = useState([]);
  const userFetchURL = awsIP + '/UserInfo/' + userUID
  const [pinnedStoreIDs, setPinnedStoreIDs] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <HomeButton
        onPress={() => {
          navigation.navigate("Home");
        }}
      />,
    });
  }, []);

  const gatherData = async () => {
    const storesResponse = await fetch(storesFetchURL)
    const storesPromise = await storesResponse.json()
    setData(storesPromise)
    setStoresData(storesPromise.map(item => {
      return ({
        id: item.id,
        image: item.image,
        title: item.title,
        ingredients: item.ingredients
      })
    }
    ))
    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()
    setRecipesData(recipesPromise)

    const userResponse = await fetch(userFetchURL)
    const userPromise = await userResponse.json()
    setUserData(userPromise)
    setPinnedStoreIDs(userPromise.pinnedStores)

    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressRecipe = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Ingredient/Recipe/${item.storeid}`);
    const result = await response.text();
    processItem(storesData, cart, item, setCart);
  }


  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecipe(item)
        }}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View>
            <Text style={styles.itemName}>{item.name}</Text>

            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderStores = (item) => {  //https://stackoverflow.com/questions/48353471/checking-if-a-state-object-is-empty
    if (item.id === undefined || Object.keys(item.recipes).length == 0) return
    return (
      <View style={styles.storeContainer}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Store: {item.title}</Text>
        <FlatList
          horizontal
          data={item.recipes}
          renderItem={(item) => renderRecipes(item)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }

  function render() {
    const pinnedStoresData = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedID) => pinnedID === storeItem.id)))

    // we have some mismatching for ingredient "name" attribute...sometimes it's called "title" sometimes "name", even for just ingredient items...(pretty sure im mostly to blame but idk)
    // anyway this just sets both to be the same 
    if (targetIngredientItem.name === undefined) targetIngredientItem.name = targetIngredientItem.title
    if (targetIngredientItem.title === undefined) targetIngredientItem.title = targetIngredientItem.name

    const filteredRecipes = recipesData.filter((recipeItem) => {
      return recipeItem.ingredients.some((recipeIngredient) => {
        return (recipeIngredient === targetIngredientItem.title)
      })
    })

    constructRecipesInStoresData(pinnedStoresData, filteredRecipes)

    constructPricesInRecipes(pinnedStoresData)

    if (loading) {
      return (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Recipes using: {targetIngredientItem.title}</Text>
        <View>
          <FlatList
            vertical
            numColumns={1}
            showsVerticalScrollIndicator={false}
            data={pinnedStoresData}
            renderItem={(item) => renderStores(item.item)}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  }

  return render()
}



/**
 * list stores, pin the inspected recipe to the left, list similar recipes to the right
 */

