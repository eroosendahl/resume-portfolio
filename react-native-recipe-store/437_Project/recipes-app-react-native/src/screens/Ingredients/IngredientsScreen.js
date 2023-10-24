import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import recipeStyles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { dummyStores } from "../../dummyData/dummyData";
import { awsIP } from '../../Utility'
import styles from "./styles";

export default function IngredientsScreen(props) {
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
      item.ingredients.forEach((ingredient) => {
        if (!res.some(item => item.title === ingredient.name)) res.push(({// adds the ingredient to result if it hasnt already
          title: ingredient.name,
          image: ingredient.image
        }))
      })
      return res
    }, []
    ));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressStore = (item) => {
    navigation.navigate("Ingredient", { ingredientItem: item });
  };

  const renderIngredients = ({ item }) => {
    if (item.title === undefined) return;
    console.log(item.image)
    return (
      <TouchableHighlight onPress={() => onPressStore(item)} style={styles.itemCard}>
        <View style={styles.itemContainerAlt}>
          <Image style={styles.imageAlt} source={{ uri: item.image }} />
          <Text style={styles.itemHeaderTextAlt}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft:10,marginTop:10, marginBottom: 20 }}> All Ingredients</Text>
      <Text style={{marginLeft:15}}>Select one to see recipes that use it.{"\n"}</Text>
      
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={1} data={data} renderItem={renderIngredients} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
