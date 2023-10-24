import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP } from '../../Utility'

export default function IngredientScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const route = useRoute();
  const ingredientItem = route.params?.ingredientItem;
  const [loading, setLoading] = useState(true);
  const localFetchURL = awsIP + '/DummyData'

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
    //setData(await response.json())

    setData((await response.json()).map((storeItem) => {
      return {
        id: storeItem.id,
        title: storeItem.title,
        image: storeItem.image,
        recipes: storeItem.recipes.filter(recipe => {
          return recipe.ingredients.some(recIngr => (recIngr === ingredientItem.title))
        }),
      }
    }));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

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
        onPress={() => {
          onPressRecipe(item)
        }}
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

  if (loading) {
    return (
      <Text style={styles.loadingText}>
        LOADING
      </Text>
    )
  }
  else return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Recipes using: {ingredientItem.title}</Text>
      <View>
        <FlatList
          vertical
          numColumns={1}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={(item) => renderStores(item.item)}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}



/**
 * list stores, pin the inspected recipe to the left, list similar recipes to the right
 */

