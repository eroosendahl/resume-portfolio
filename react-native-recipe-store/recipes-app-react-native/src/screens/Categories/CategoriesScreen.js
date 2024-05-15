import React, { useLayoutEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import {styles} from '../../AppStyles';
import { getNumberOfRecipes } from "../../data/MockDataAPI";
import MenuImage from "../../components/MenuImage/MenuImage";
import HomeButton from "../../components/HomeButton/HomeButton";
import { categories } from "../../dummyData/dummyData"

export default function CategoriesScreen(props) {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
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

  const onPressCategory = (item) => {
    const category = item.name;
    if (category == "Ingredients") {
      navigation.navigate("Ingredients");
    } else if (category == "Recipes") {
      navigation.navigate("Recipes");
    } else if (category == "Stores") {
      navigation.navigate("Stores");
    }

  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  )

  return (
    <View>
      <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
