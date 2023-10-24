import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import recipeStyles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { dummyStores } from "../../dummyData/dummyData";
import { awsIP } from '../../Utility'
import styles from "./styles";

export default function RecipesScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
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
    setData((await response.json()).reduce((res, item) => {
      item.recipes.forEach((recipe) => {
        if (!res.some(item => item.title === recipe.name)) res.push({
          id: recipe.id,
          title: recipe.name,
          image: recipe.image,
          ingredients: recipe.ingredients
        })
      })
      return res
    }, []
    ));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressItem = (item) => {
    navigation.navigate("Recipe", { recipeItem: item });
  };



  const renderRecipes = ({ item }) => {
    if (item.title === undefined) return;
    return (
      <TouchableHighlight onPress={() => onPressItem(item)} style={styles.itemCard}>
        <View style={styles.itemContainerAlt}>
          <Image style={styles.imageAlt} source={{ uri: item.image }} />
          <Text style={styles.itemHeaderTextAlt}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  console.log("data: ", data)
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}> All Recipes</Text>
      <Text>Select one to see its availability, and recipes like it.</Text>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={1} data={data} renderItem={renderRecipes} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
