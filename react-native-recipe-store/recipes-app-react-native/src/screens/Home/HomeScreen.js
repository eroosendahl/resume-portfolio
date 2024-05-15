import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  Button,
  Modal,
  SectionList
} from "react-native";
import MenuImage from "../../components/MenuImage/MenuImage";
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import RecipeList from "../../components/RecipeList/RecipeList";
import RecentItemsList from "../../components/RecentItemsList/RecentItemsList";
import ProductPopup from "../../components/ProductPopup/ProductPopup";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes, gatherPopularRecipes, addItemToCart, purchaseItem, compareByName } from '../../Utility'
import SelectDropdown from 'react-native-select-dropdown'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group"
import Arrow from 'react-native-arrow'
import { categories } from "../../dummyData/dummyData"
import SearchResult from "../../components/SearchResult/SearchResult";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { CartContext } from "../../CartContext";
import { TextInput } from "react-native-gesture-handler";
import SearchBar from '../../components/SearchBar/SearchBar'
import SearchResultPopup from "../../components/SearchResultPopup/SearchResultPopup";
import { styles, searchStyles, GPTpopupStyles } from '../../AppStyles'

export default function HomeScreen(props) {
  const { navigation } = props;
  const [storesData, setStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pinnedStoreIDs, setPinnedStoreIDs] = useState([]);
  const [usersRecentItems, setUsersRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const userEmail = getAuth().currentUser.email
  const userUID = getAuth().currentUser.uid
  const userFetchURL = awsIP + '/UserInfo/' + userUID
  const updateRecent = awsIP + '/UpdateRecent/'
  const updatePopularity = awsIP + '/UpdatePopularity/'
  const [inspectingProduct, setInspectingProduct] = useState(false)
  const [inspectedProduct, setInspectedProduct] = useState()
  const [searching, setSearching] = useState()
  const [searchResults, setSearchResults] = useState([])
  const [relevantStoresData, setRelevantStoresData] = useState([])
  const defaultSearchResults = [{ title: "Recipes", data: [] }, { title: "Ingredients", data: [] }, { title: "Stores", data: [] }]
  const [searchedValue, setSearchedValue] = useState("");

  const [cart, setCart] = useContext(CartContext);

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
          <Text style={styles.screenTitleText}>Home</Text>
          <SearchBar
            searchedValue={searchedValue}
            handleSearch={handleSearch}
            placeholder="Search: All Products"
          />
        </View>

      ),
      headerRight: () => (
        <View>
          <HomeButton
            title="Home"
            onPress={onPressHomeButton}
          />
        </View>
      )
    });
  }, [searchedValue]);

  const onPressHomeButton = () => {
    navigation.navigate("Home");
    handleSearch("")
  }

  const handleSearch = (text) => {
    setSearchedValue(text);

    if (text == "") {
      setSearching(false)
      return
    }
    setSearching(true)

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

  const onPressSearchResult = (item) => {
    inspectProduct(item)
  }

  const toggleProductModal = () => {
    setInspectingProduct(!inspectingProduct);
  };

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
    const recipesPromise = await recipesResponse.json()
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
    setUsersRecentItems(userPromise.recent)
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  // const onPressRecipe = async (item) => {
  //   console.log("pressed recipe:")
  //   console.log(item)
  //   inspectProduct(item)
  // };

  const buyRecipe = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Home/recipe/${item.storeid}`);
    const result = await response.text()
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`)
    const popResult = await popResponse.text()
    alert("[HOME] You picked a recipe, great job!");
  }

  const inspectProduct = (product) => {
    if (!inspectingProduct) {
      setInspectedProduct(product)
      setInspectingProduct(true)
    }
  }

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

  const renderPinnedStores = () => {
    if (storesData === undefined) return

    const pinnedStoresData = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id))))

    const res = []

    pinnedStoresData.forEach((storeItem, index) => {
      res.push(
        <TouchableHighlight onPress={() => onPressStore(storeItem)} style={styles.itemCard}>
          <View style={styles.itemContainerAlt}>
            <Image style={styles.imageAlt} source={{ uri: storeItem.image }} />
            <Text style={styles.itemHeaderTextAlt}>{storeItem.title}</Text>
          </View>
        </TouchableHighlight>
      )
    })
    return res
  }


  const renderRecentItems = () => {
    return <RecentItemsList
      recentItemData={usersRecentItems}
      recipesData={recipesData}
      storesData={storesData}
      onPressRecipe={onPressRecipe}
      navigation={navigation}
    />
  }


  const renderPopularItems = () => {
    if (storesData === undefined) return

    const pinnedStores = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id))))

    const res = []

    pinnedStores.forEach((storeItem, index) => {
      const popularRecipes = gatherPopularRecipes(storeItem)

      popularRecipes.map(popRecipe => {
        popRecipe.storeid = storeItem.id
        return popRecipe
      })

      if (index != 0) res.push(<HomeSeparator size='tiny' />)
      res.push(
        <View>
          <Text style={styles.homeSubsectionHeaderText}>{storeItem.title}</Text>
          <RecipeList
            store={storeItem}
            onPress={onPressRecipe}
            data={popularRecipes}
          />
        </View>
      )
    })
    return res
  }


  const renderCategories = () => {
    res = []
    categories.forEach((category) => {
      displayMessage = ""
      if (category.name === "Ingredients") return
      if (category.name === "Recipes") displayMessage = "find similar recipes"
      if (category.name === "Stores") displayMessage = "see all stores"
      res.push(
        <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(category)}>
          <View style={styles.categoriesItemContainer}>
            <Image style={styles.categoriesPhoto} source={{ uri: category.photo_url }} />
            <Text style={styles.categoriesName}>{displayMessage}</Text>
          </View>
        </TouchableHighlight>
      )
    })
    return res
  }


  const onPressRecipe = (item, storeItem) => {

    if (storeItem) item.store = storeItem
    inspectProduct(item)
  };

  const passableAddItemToCart = (item) => {
    toggleProductModal()
    addItemToCart(storesData, cart, item, setCart)
  }

  const onPressStore = (item) => {
    setInspectingProduct(false)
    navigation.navigate("Store", { storeItem: item });
  };

  const onPressASIButton = (item) => {
    navigation.navigate("AllStoresInventories");
  };

  const onPressPSButton = (item) => {
    navigation.navigate("OnboardingStoresScreen", {fromHome: true});
  };

  function render() {
    const recipesDataCopy = JSON.parse(JSON.stringify(recipesData))

    constructRecipesInStoresData(storesData, recipesDataCopy)

    constructPricesInRecipes(storesData)

    if (pinnedStoreIDs.length != 0 && relevantStoresData.length === 0)
      setRelevantStoresData(storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id)))))


    return (
      loading ? (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
        : (
          searching ? (
            <View>
              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={inspectingProduct}
                  onRequestClose={toggleProductModal}
                  propagateSwipe
                >
                  <SearchResultPopup
                    navigation={navigation}
                    addItemToCart={passableAddItemToCart}
                    onPressStore={onPressStore}
                    product={inspectedProduct}
                    storesData={relevantStoresData}
                    onPressButton={toggleProductModal} />
                </Modal>
              </View>

              <SectionList
                sections={searchResults}
                keyExtractor={item => (item.id)}
                renderItem={renderSearchResults}
                renderSectionHeader={({ section }) => (
                  <View style={{ backgroundColor: "green" }}>
                    <Text style={searchStyles.header}>{section.title}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <ScrollView nestedScrollEnabled={true} name='homeContainer' style={{ marginLeft: 0, paddingLeft: 0, paddingBottom: 300 }}>
              <HomeSeparator size="small" />

              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={inspectingProduct}
                  onRequestClose={toggleProductModal}
                >
                  <ProductPopup addItemToCart={passableAddItemToCart} product={inspectedProduct} onPressButton={toggleProductModal} />
                </Modal>
              </View>

              <View name='pinnedStores' style={{ marginLeft: 0, paddingLeft: 0 }}>
                <Text style={styles.homeSectionHeaderText}>your pinned stores:</Text>
                <View>
                  {renderPinnedStores()}
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight style={GPTpopupStyles.homePSButton} onPress={onPressPSButton} >
                    <View><Text>Edit Pinned Stores</Text></View>
                  </TouchableHighlight>
                </View>
              </View>

              <HomeSeparator size="small" />

              <View name='recentItems'>
                <Text style={styles.homeSectionHeaderText}>recent items:</Text>
                {renderRecentItems()}
              </View>

              <HomeSeparator size="small" />

              <View name='popularRecipes' >
                <Text style={styles.homeSectionHeaderText}>popular deals{"\n"}from your stores:</Text>
                {renderPopularItems()}
              </View>

              <HomeSeparator size="small" />

              <View name='homeCategories'>
                <Text style={styles.homeSectionHeaderText}>more options:</Text>
                {renderCategories()}
              </View>

              <HomeSeparator size="small" />

              {/* <View name='debugButtons'>
                <Button title="AllStoresInventories" onPress={onPressASIButton} />
              </View> */}

            </ScrollView>
          )
        )
    )
  }

  return render();
}

