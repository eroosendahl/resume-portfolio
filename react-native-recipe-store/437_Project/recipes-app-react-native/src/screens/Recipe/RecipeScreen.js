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

export default function RecipeScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const route = useRoute();
  const recipeItem = route.params?.recipeItem;
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

  function recipeMatch(mainIngrList, candIngrList) {
    var sum = 0
    console.log("mainIngrList:", mainIngrList)
    console.log("candIngrList:", candIngrList)
    candIngrList.forEach(candIngr => {
      if (mainIngrList.includes(candIngr)) sum++
    })
    if (sum >= 2) return true
    return false
  }

  const gatherData = async () => {
    const response = await fetch(localFetchURL)
    //setData(await response.json())

    setData((await response.json()).map((storeItem) => {
      return {
        id: storeItem.id,
        title: storeItem.title,
        image: storeItem.image,
        recipes: storeItem.recipes.filter(recipe => {
          return recipeMatch(recipe.ingredients, recipeItem.ingredients)
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
            {/* <Text style={styles.itemIngredients}>Ingredients: {ingredients}</Text> */}
          </View>
        </View>
      </TouchableHighlight>
    );
  };



  const renderStores = (item) => {
    if (item.id === undefined) return;
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
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Recipes matching: {recipeItem.title}</Text>
      <Text>Recipes are a match if they share 2 or more ingredients.</Text>
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