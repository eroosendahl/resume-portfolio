import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, Pressable, SectionList, Modal, Button } from "react-native";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName, getRecipesByRecipeName, getRecipesByCategoryName, getRecipesByIngredientName } from "../../data/MockDataAPI";
import { TextInput } from "react-native-gesture-handler";
import { searchStyles as styles } from '../../AppStyles';
import { getAuth } from "firebase/auth";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes, gatherPopularRecipes, compareByName } from '../../Utility'
import SearchResult from "../../components/SearchResult/SearchResult";
import SearchResultPopup from "../../components/SearchResultPopup/SearchResultPopup";
import HomeButton from "../../components/HomeButton/HomeButton";
import SearchBar from '../../components/SearchBar/SearchBar'

export default function SearchScreen(props) {
  const { navigation } = props;
  const [storesData, setStoresData] = useState([]);
  const [pinnedStoresData, setPinnedStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pinnedStoreIDs, setPinnedStoreIDs] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");
  const defaultSearchResults = [{ title: "Recipes", data: [] }, { title: "Ingredients", data: [] }, { title: "Stores", data: [] }]
  const [searchResults, setSearchResults] = useState(defaultSearchResults);
  const [relevantStoresData, setRelevantStoresData] = useState([])
  const [popupSearchStores, setPopupSearchStores] = useState([])
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const userUID = getAuth().currentUser.uid
  const userFetchURL = awsIP + '/UserInfo/' + userUID
  const [loading, setLoading] = useState(true);
  const [inspectingProduct, setInspectingProduct] = useState(false)
  const [inspectedProduct, setInspectedProduct] = useState(undefined)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <MenuImage
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        </View>

      ),
      headerTitle: () => (
        <View>
          <Text style={styles.screenTitleText}>Search</Text>
          <SearchBar
            searchedValue={searchedValue}
            handleSearch={handleSearch}
            placeholder="Search All Products"
          />
        </View>

      ),
      headerRight: () =>
        <View>
          <HomeButton
            title="Home"
            onPress={() => {
              navigation.navigate("Home");
            }}
          />

        </View>,
    });
  }, [searchedValue]);

  const toggleProductModal = () => {
    setInspectingProduct(!inspectingProduct);
  };

  const onPressSearchResult = (item) => {
    inspectProduct(item)
  }

  const onPressStore = (item) => {
    toggleProductModal()
    navigation.navigate("Store", { storeItem: item });
  };

  const inspectProduct = (product) => {
    if (!inspectingProduct) {
      setInspectedProduct(product)
      setInspectingProduct(true)
    }
  }

  const gatherData = async () => {
    const storesResponse = await fetch(storesFetchURL)
    const storesPromise = await storesResponse.json()
    setStoresData(storesPromise.map(item => {
      return ({
        id: item.id,
        image: item.image,
        title: item.title,
        ingredients: item.ingredients,
        recipePopularity: item.recipePopularity,
        type: "store"
      })
    }
    ))

    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json() // id, image, ingredients, name
    setRecipesData(recipesPromise.map(item => {
      return ({
        id: item.id,
        image: item.image,
        ingredients: item.ingredients,
        title: item.name,
        type: "recipe"
      })
    }))
    setIngredientsData(storesPromise.reduce((res, item) => {  // gathers and stores data on unique ingredients (not store specific)
      item.ingredients.forEach((ingredient) => {
        if (!res.some(item => item.title === ingredient.name)) res.push(({// adds the ingredient to result if it hasnt already
          title: ingredient.name,
          image: ingredient.image,
          category: ingredient.category,
          type: "ingredient",
          id: item.id + ingredient.id
        }))
      })
      return res
    }, []
    ))

    const userResponse = await fetch(userFetchURL)
    const userPromise = await userResponse.json()
    setUserData(userPromise)
    setPinnedStoreIDs(userPromise.pinnedStores)
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);



  const handleSearch = (text) => {
    setSearchedValue(text);
    const matchingRecipes = recipesData.filter(recipe => compareByName(text, recipe.title))
    const matchingIngredients = ingredientsData.filter(ingredient => compareByName(text, ingredient.title))
    const matchingStores = storesData.filter(store => compareByName(text, store.title))

    const finalMatchSections = [
      {
        title: "Recipes",
        data: matchingRecipes
      },
      {
        title: "Ingredients",
        data: matchingIngredients
      },
      {
        title: "Stores",
        data: matchingStores
      }
    ]

    if (text == "") {
      setSearchResults(defaultSearchResults);
    } else {
      setSearchResults(finalMatchSections);
    }
  };

  const renderSearchResults = ({ item }) => {
    return (
      <SearchResult item={item} onPress={onPressSearchResult} />
    )
  };


  function render() {

    const recipesDataCopy = JSON.parse(JSON.stringify(recipesData))

    constructRecipesInStoresData(storesData, recipesDataCopy)

    constructPricesInRecipes(storesData)

    if (pinnedStoreIDs.length != 0 && relevantStoresData.length === 0)
      setRelevantStoresData(storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id)))))

    return (
      <View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={inspectingProduct}
            onRequestClose={toggleProductModal}
            propagateSwipe
          >
            <SearchResultPopup navigation={navigation} onPressStore={onPressStore} product={inspectedProduct} storesData={relevantStoresData} onPressButton={toggleProductModal} />
          </Modal>
        </View>

        <SectionList
          sections={searchResults}
          keyExtractor={item => (item.id)}
          renderItem={renderSearchResults}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: "green" }}>
              <Text style={styles.header}>{title}</Text>
            </View>
          )}
        />
      </View>
    );
  }

  return render();
}
