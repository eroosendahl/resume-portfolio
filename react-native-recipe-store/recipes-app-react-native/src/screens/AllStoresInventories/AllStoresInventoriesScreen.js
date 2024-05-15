import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
  Button,
} from "react-native";
import {styles} from '../../AppStyles'
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP } from '../../Utility'
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group"
import Arrow from 'react-native-arrow'
import HomeButton from "../../components/HomeButton/HomeButton";

export default function AllStoresInventoriesScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backupData, setBackupData] = useState([])
  const localFetchURL = awsIP + '/allStores'
  const [sortingOn, setSortingOn] = useState("None")
  const [sortingDir, setSortingDir] = useState({ "Price": "Ascending", "Name": "Alphabetical" })


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
    var temp = (await response.json())
    setData(temp)
    setBackupData(temp)
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressIngredient = (item, storeItem) => {
    navigation.navigate("IngredientByStore", { ingredient: item, storeItem: storeItem });
  };

  const onPressStore = (item) => {
    navigation.navigate("Store", { storeItem: item });
  };

  const onPressRecipe = (item) => {
    alert("[HOME]  Recipe selected, great job!")
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


  const renderIngredients = ({ item }, storeItem) => {

    return (
      <TouchableHighlight
        style={styles.itemCardAlt}
        underlayColor="#f0f0f0"
        onPress={() => onPressIngredient(item, storeItem)}
      >
        <View style={styles.itemDetailsAlt}>
          <Image style={styles.itemImageAlt} source={{ uri: item.image }} />
          <View style={{ marginLeft: 0, flex: 1 }}>
            <Text style={styles.itemNameAlt}>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)} </Text>
              <Arrow size={10} color={'black'} />
              <Text style={styles.itemDiscount}> ${(item.price - item.discount).toFixed(2)}</Text>
            </View>

          </View>
        </View>
      </TouchableHighlight>
    )
  };


  const renderAllStores = (storeItem) => {
    const ingredientsData = storeItem.ingredients;
    const idl = ingredientsData.length
    const recipesData = storeItem.recipes;
    const leftHalfIngr = ingredientsData.slice(0, idl / 2)
    const rightHalfIngr = ingredientsData.slice(idl / 2, idl)

    if (storeItem.id === undefined) return
    //if (storeItem.id != "nhpwEfjVu2i62JoP9m8r") return  // just to make it only show UP results, cuz sorting all stores' inventories is actually rly slow..

    return (
      <View style={styles.storeContainer} key={storeItem.id}>
        {/* Store name with updated style */}
        <TouchableHighlight onPress={() => onPressStore(storeItem)} style={styles.storeHeaderBox}>
          <Text style={styles.storeHeaderText}>{storeItem.title}</Text>
        </TouchableHighlight>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Eligible Ingredients</Text>
        </View>

        {/* Render ingredients list */}
        <Text>Top-half:</Text>
        <FlatList
          horizontal
          data={leftHalfIngr}
          storeItem={storeItem}
          renderItem={(item) => renderIngredients(item, storeItem)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />

        <Text>Bottom-half:</Text>
        <FlatList
          horizontal
          data={rightHalfIngr}
          storeItem={storeItem}
          renderItem={(item) => renderIngredients(item, storeItem)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }}
          />}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Discounted Recipes</Text>
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

  function sort(option, direction) {
    if (option == undefined) option = sortingOn
    if (direction == undefined) direction = sortingDir[option]

    if (option === "Price") {
      setSortingOn("Price")
      if (direction === "Ascending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Ascending", "Name": temp })
        setData(backupData.map(storeItem => {
          storeItem.ingredients.sort((a, b) => ((a.price - a.discount) - (b.price - b.discount)))
          return storeItem
        }))
      }
      if (direction === "Descending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Descending", "Name": temp })
        setData(backupData.map(storeItem => {
          storeItem.ingredients.sort((a, b) => ((b.price - b.discount) - (a.price - a.discount)))
          return storeItem
        }))
      }

    } else if (option === "Name") {
      setSortingOn("Name")
      if (direction === "Alphabetical") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Alphabetical" })
        setData(backupData.map(storeItem => {
          storeItem.ingredients.sort((a, b) => (a.name.localeCompare(b.name)))
          return storeItem
        }))
      }
      else if (direction === "Reverse-alpha") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Reverse-alpha" })
        setData(backupData.map(storeItem => {
          storeItem.ingredients.sort((a, b) => (b.name.localeCompare(a.name)))
          return storeItem
        }))
      }
    }
  }

  const changeSortDirection = () => {
    if (sortingOn === "Price") {
      if (sortingDir['Price'] === "Ascending") sort("Price", "Descending")
      else if (sortingDir['Price'] === "Descending") sort("Price", "Ascending")
    }
    else if (sortingOn === "Name") {
      if (sortingDir["Name"] === "Alphabetical") sort("Name", "Reverse-alpha")
      else if (sortingDir["Name"] === "Reverse-alpha") sort("Name", "Alphabetical")
    }
  }

  function renderSortControls() {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ borderRightColor: 'green', borderStyle: "solid" }}>
          <Text>Sort ingredients by:</Text>
          <Text>Price   Name</Text>
          <BouncyCheckboxGroup
            data={[{ id: "Price" }, { id: "Name" }]}
            onChange={(option) => sort(option.id)}
          />
        </View>

        {(() => {
          if (sortingOn != "None") return (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Press to Change Direction</Text>
              <Button
                title={sortingDir[sortingOn]}
                onPress={changeSortDirection}
              />
            </View>
          )
        })()}
        
      </View>)
  }

  function render() {
    if (loading) {
      return (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <View style={styles.container}>

        {renderSortControls()}
        <Text>Please give a few seconds after each press for results to finish sorting.</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          All Stores Inventories
        </Text>

        <FlatList
          data={data}
          renderItem={(item) => renderAllStores(item.item)}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }

  return render();
}
