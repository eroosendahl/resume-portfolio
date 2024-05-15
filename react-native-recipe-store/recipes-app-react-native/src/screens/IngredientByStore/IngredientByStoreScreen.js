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
import { awsIP } from '../../Utility'
import HomeButton from "../../components/HomeButton/HomeButton";
import { CartContext } from "../../CartContext";
import { processItem } from "../../Utility";
export default function HomeScreen(props) {
  const { navigation } = props;
  const [storeData, setStoreData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const route = useRoute();
  const ingredient = route.params?.ingredient;
  const routedStoreItem = route.params?.storeItem
  const storeFetchURL = awsIP + '/IngredientData/' + ingredient.name
  const recipesFetchURL = awsIP + '/allRecipes'
  const [loading, setLoading] = useState(true);
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
    const storeResponse = await fetch(storeFetchURL)
    const storePromise = await storeResponse
    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse

    setStoreData(storePromise.filter(store => {
      return (store.id === routedStoreItem.id)
    }));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressIngredient = (item) => {
    navigation.navigate("InspectIngredient", { item });
  };

  const onPressStore = (item) => {
    navigation.navigate("Store", { storeItem: item });
  };

  const onPressRecipe = (item) => {
    processItem(storesData, cart, item, setCart);
  }

  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => { onPressRecipe(item) }}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            Original Price: ${item.price.toFixed(2)}
          </Text>
          <Text style={styles.itemDiscount}>
            Discounted Price: ${discountPrice}
          </Text>
          <View style={styles.itemIngredientsBox}>
            <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderAllStores = (storeItem) => {
    const recipesData = storeItem.recipes;

    return (
      <View style={styles.storeContainer} key={storeItem.id}>

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
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Recipes using: {ingredient.name}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>
        at {routedStoreItem.title}
      </Text>


      <FlatList
        data={storeData}
        renderItem={(item) => renderAllStores(item.item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}
