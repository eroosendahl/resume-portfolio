import React, { useEffect, useState, useLayoutEffect } from "react";
import { SectionList, FlatList, Text, View, ScrollView, TouchableHighlight, Image, Button } from "react-native";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP } from '../../Utility'
import {styles} from "../../AppStyles";
import HomeButton from "../../components/HomeButton/HomeButton";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group"
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";


export default function IngredientsScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const localFetchURL = awsIP + '/allStores'
  const [sortingOn, setSortingOn] = useState("None")
  const [sortingDir, setSortingDir] = useState("Alphabetical")
  const updateRecent = awsIP + '/UpdateRecent/'
  const userUID = getAuth().currentUser.uid

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
    const response = await fetch(localFetchURL)
    const promise = await response.json()

    setBackupData(promise.reduce((res, storeItem) => {
      storeItem.ingredients.forEach((ingredient) => {
        if (!res.some(item => item.title === ingredient.name)) res.push(({// adds the ingredient to result if it hasnt already
          id: ingredient.id,
          title: ingredient.name,
          image: ingredient.image,
          category: ingredient.category,
          storeid: storeItem.id
        }))
      })
      return res
    }, []
    ))

    setData(promise.reduce((res, storeItem) => {
      storeItem.ingredients.forEach((ingredient) => {
        if (!res.some(item => item.title === ingredient.name)) res.push(({
          id: ingredient.id,
          title: ingredient.name,
          image: ingredient.image,
          category: ingredient.category,
          storeid: storeItem.id
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

  const onPressIngredient = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Ingredients/Ingredient/${item.storeid}`);
    const result = await response.text()
    navigation.navigate("Ingredient", { ingredientItem: item });
  };

  const renderIngredient = (item) => {
    return <TouchableHighlight
      style={styles.itemCardAlt}
      underlayColor="#f0f0f0"
      onPress={() => onPressIngredient(item)}
    >
      <View style={styles.itemDetailsAlt}>
        <Image style={styles.itemImageAlt} source={{ uri: item.image }} />
        <View style={{ marginLeft: 0, flex: 1 }}>
          <Text style={styles.itemNameAlt}>{item.title}</Text>
        </View>
      </View>
    </TouchableHighlight>
  }

  function renderIngredientsByCategoryHorizontal(catIngrData) {
    res = []
    catIngrData.forEach((catIngrs) => {
      res.push(
        <View>
          <Text style={styles.sectionListHeader}>{catIngrs.title}</Text>
          <FlatList
            horizontal
            data={catIngrs.data}
            renderItem={(item) => renderIngredient(item.item)}
            keyExtractor={(item) => { item.id }}
          />
        </View>)
    })
    return <ScrollView>{res}</ScrollView>
  }


  function sortIngredients(option, direction) {
    if (option == "None") return
    if (option == undefined) option = sortingOn
    if (direction == undefined) direction = sortingDir

    if (option === "Name") {
      setSortingOn("Name")
      if (direction === "Alphabetical") {
        setSortingDir("Alphabetical")
        backupData.sort((a, b) => (a.title.localeCompare(b.title)))
        setData(backupData)
      }
      else if (direction === "Reverse-alpha") {
        const temp = sortingDir["Price"]
        setSortingDir("Reverse-alpha")
        backupData.sort((a, b) => (b.title.localeCompare(a.title)))
        setData(backupData)
      }
    }
  }

  const changeIngredientSortDirection = () => {
    if (sortingDir === "Alphabetical") sortIngredients("Name", "Reverse-alpha")
    else if (sortingDir === "Reverse-alpha") sortIngredients("Name", "Alphabetical")
  }

  function renderIngredientSortControls() {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ padding: 5, marginLeft: 10 }}>
          <Text>Sort by:</Text>
          <Text>Name</Text>
          <BouncyCheckboxGroup
            data={[{ id: "Name" }]}
            onChange={(option) => sortIngredients(option.id)}
          />
        </View>

        {(() => {
          if (sortingOn != "None") return (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Press to Change Direction</Text>
              <Button
                title={sortingDir}
                onPress={changeIngredientSortDirection}
              />
            </View>
          )
        })()}

      </View>
    )
  }

  function render() {
    const ingredientCategories = data.reduce((categoriesList, ingr) => {
      if (!categoriesList.some(item => item === ingr.category)) categoriesList.push(ingr.category)
      return categoriesList
    }, [])

    const categoriedIngredientData = ingredientCategories.map((catgry) => {
      return { title: catgry, data: data.filter(item => (item.category === catgry)) }
    })

    return (
      <View>
        <HomeSeparator size="small" />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 10, marginTop: 10, marginBottom: 20 }}> All Ingredients</Text>
        <Text style={{ marginLeft: 15 }}>Select one to see recipes that use it.{"\n"}</Text>
        {renderIngredientSortControls()}
        <View style={{ paddingBottom: 325 }}>
          {renderIngredientsByCategoryHorizontal(categoriedIngredientData)}
        </View>
      </View>
    );
  }

  return render();
}
