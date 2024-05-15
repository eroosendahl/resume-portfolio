import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native"
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
import { styles, searchStyles, GPTpopupStyles } from "../../AppStyles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getAuth } from "firebase/auth";
import HomeButton from "../../components/HomeButton/HomeButton";
import Arrow from 'react-native-arrow'
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group"
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import StoreIngredientCard from '../../components/StoreIngredientCard/StoreIngredientCard'
import ProductPopup from "../../components/ProductPopup/ProductPopup";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes, gatherPopularRecipes, compareByName, addItemToCart, purchaseItem } from '../../Utility'
import { CartContext } from "../../CartContext";
import SearchResult from "../../components/SearchResult/SearchResult";
import SearchBar from '../../components/SearchBar/SearchBar'
import SearchResultPopup from "../../components/SearchResultPopup/SearchResultPopup";
import RecipeList from "../../components/RecipeList/RecipeList";

export default function StoreScreen(props) {
  const { navigation } = props;
  const [backupData, setBackupData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [popularRecipesData, setPopularRecipesData] = useState([]);
  const [loading, setLoading] = useState(true)
  const route = useRoute();
  const targetStoreData = route.params?.storeItem;
  const storeFetchURL = awsIP + '/StoreData/' + targetStoreData.id
  const recipesFetchURL = awsIP + '/allRecipes'
  const [sortingOn, setSortingOn] = useState("None")
  const [sortingDir, setSortingDir] = useState({ "Price": "Ascending", "Name": "Alphabetical" })
  const [ingredientFilter, setIngredientFilter] = useState([])
  const updateRecent = awsIP + '/UpdateRecent/'
  const userUID = getAuth().currentUser.uid
  const updatePopularity = awsIP + '/UpdatePopularity/'
  const [inspectingProduct, setInspectingProduct] = useState(false)
  const [inspectedProduct, setInspectedProduct] = useState()
  const [searching, setSearching] = useState()
  const [searchResults, setSearchResults] = useState([])
  const defaultSearchResults = [{ title: "Recipes", data: [] }, { title: "Ingredients", data: [] }]
  const [relevantStoresData, setRelevantStoresData] = useState([])
  const [searchedValue, setSearchedValue] = useState("");

  const [cart, setCart] = useContext(CartContext);
  const [storesData, setStoresData] = useState([]);
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
          <Text style={styles.screenTitleText}>{targetStoreData.title}</Text>
          <SearchBar
            searchedValue={searchedValue}
            handleSearch={handleSearch}
            placeholder={"Search: " + targetStoreData.title}
          />
        </View>
      ),
      headerRight: () => (
        <View>
          <HomeButton
            title="Home"
            onPress={() => {
              navigation.navigate("Home");
            }}
          />

        </View>


      )
    });
  }, [searchedValue]);


  const handleSearch = (text) => {
    setSearchedValue(text);

    var matchingRecipes = []
    var matchingIngredients = []

    if (storeData.recipes) {
      matchingRecipes = storeData.recipes.filter(recipe => compareByName(text, recipe.name))
      matchingRecipes.forEach(item => {
        item.type = 'recipe'
        item.title = item.name
        item.storeid = storeData.id
      });
    }
    else
      console.log("search had no recipes")

    if (storeData.ingredients) {
      matchingIngredients = storeData.ingredients.filter(ingredient => compareByName(text, ingredient.name))
      matchingIngredients.forEach(item => {
        item.type = 'ingredient'
        item.title = item.name
        item.storeid = storeData.id
        console.log("item.storeid")
        console.log(item.storeid)
      });
    }
    else
      console.log("search had no ingredients")

    matchingIngredients.forEach(item => (console.log(item.storeid)))

    const finalMatchSections = [
      {
        title: "Recipes",
        data: matchingRecipes
      },
      {
        title: "Ingredients",
        data: matchingIngredients
      },
    ]

    if (text == "") {
      setSearchResults(defaultSearchResults);
      setSearching(false)
    } else {
      setSearchResults(finalMatchSections);
      setSearching(true)
    }
  };

  const renderSearchResults = ({ item }) => {
    return (
      <SearchResult item={item} onPress={onPressSearchResult} />
    )
  };

  const toggleProductModal = () => {
    setInspectingProduct(!inspectingProduct);
  };

  const gatherData = async () => {
    const storeResponse = await fetch(storeFetchURL)
    const storePromise = await storeResponse.json()

    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()

    setBackupData(storePromise)
    setStoreData(storePromise);

    setRelevantStoresData(storePromise)


    setRecipesData(recipesPromise);

    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const inspectProduct = (product) => {
    console.log("product.storeid")
    console.log(product.storeid)
    if (!inspectingProduct) {
      setInspectedProduct(product)
      setInspectingProduct(true)
    }
  }

  const onPressIngredient = async (item) => {
    passableAddItemToCart(item)
  };

  const buyRecipe = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Home/recipe/${item.storeid}`);
    const result = await response.text()
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`)
    const popResult = await popResponse.text()
    alert("[HOME] You picked a recipe, great job!");
  }

  function updateIngredientFilter(taggedIngredientName) {
    setInspectingProduct(false)
    handleSearch("")
    if (ingredientFilter.includes(taggedIngredientName)) {
      const temp = ingredientFilter
      temp.splice(temp.at(taggedIngredientName), 1)
      setIngredientFilter(JSON.parse(JSON.stringify(temp)))
    }
    else {
      const temp = ingredientFilter
      temp.push(taggedIngredientName)
      setIngredientFilter(JSON.parse(JSON.stringify(temp)))
    }
    setStoreData(JSON.parse(JSON.stringify(storeData)))
  }

  const renderIngredients = ({ item }) => {
    return (
      <StoreIngredientCard
        ingredient={item}
        onPressFilterTag={updateIngredientFilter}
        onPressPurchaseTag={onPressIngredient}
        ingredientFilter={ingredientFilter}
      />
    )
  };

  const onPressRecipe = (item, storeItem) => {
    if (storeItem) item.store = storeItem
    inspectProduct(item)
  };

  const renderStore = (storeItem) => {
    const ingredientsData = storeItem.ingredients;
    const recipesData = storeItem.recipes;

    const ingredientCategories = ingredientsData.reduce((categoriesList, ingr) => {
      if (!categoriesList.some(item => item === ingr.category)) categoriesList.push(ingr.category)
      return categoriesList
    }, [])

    const categoriedIngredientData = ingredientCategories.map((catgry) => {
      return { category: catgry, ingredients: ingredientsData.filter(item => (item.category === catgry)) }
    })

    if (storeItem.id === undefined) return;

    if (popularRecipesData.length === 0) {
      const temp = JSON.parse(JSON.stringify(gatherPopularRecipes(storeItem)))
      setPopularRecipesData(temp)
    }

    popularRecipesData.map(popRec => {
      popRec.storeid = storeItem.id
      return popRec
    })

    recipesData.map(rec => {
      rec.storeid = storeItem.id
      return rec
    })

    return (
      <View style={styles.storeContainer} key={storeItem.id}>
        {/* Store name with updated style */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Popular Recipes</Text>
        </View>
        <RecipeList
          store={storeItem}
          onPress={onPressRecipe}
          data={popularRecipesData}
        />

        <HomeSeparator size='tiny' />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>All Recipes by filter</Text>
        </View>

        <View style={{ minHeight: 330 }}>
          <Text style={{ marginLeft: 10 }}>filtering by: {ingredientFilter.join(", ")}</Text>
          <RecipeList
            store={storeItem}
            onPress={onPressRecipe}
            data={popularRecipesData}
            filter={ingredientFilter}
          />
        </View>



        <HomeSeparator size='tiny' />

        <Text style={styles.categoryHeader}>Ingredients</Text>

        {renderIngredientSortControls()}
        {renderIngredientLists(categoriedIngredientData, storeItem)}

      </View>
    );
  };

  function renderIngredientLists(categoriedIngredientData, storeItem) {
    return categoriedIngredientData.map(item => {
      return (
        <View>
          <Text style={{ fontStyle: 'italic', padding: 5, fontSize: 16 }}>{item.category}</Text>
          <FlatList
            horizontal
            data={item.ingredients}
            storeItem={storeItem}
            renderItem={(item) => renderIngredients(item, storeItem)}
            ItemSeparatorComponent={() => <View style={{ width: 10 }}
            />}
          />
        </View>
      )
    })
  }

  const clearFilter = () => {
    setIngredientFilter([])
  }

  const resetSort = () => {
    setSortingOn("None")
    setSortingDir({ "Price": "Ascending", "Name": "Alphabetical" })
    setStoreData(JSON.parse(JSON.stringify(backupData)))
  }

  const passableAddItemToCart = (item) => {
    handleSearch("")
    setInspectingProduct(false)
    addItemToCart(storeData, cart, item, setCart)
  }

  function renderIngredientSortControls() {
    return (
      <View style={{ flexDirection: "row", marginLeft: 15 }}>
        <View>
          <Text>Sort by:</Text>
          <Text>Price   Name</Text>
          <BouncyCheckboxGroup
            data={[{ id: "Price" }, { id: "Name" }]}
            onChange={(option) => (sortStoresIngredients(option.id))}
          />
          <TouchableHighlight onPress={resetSort} style={GPTpopupStyles.ingredientControlsButton}><View><Text>Reset sort</Text></View></TouchableHighlight>
          <TouchableHighlight onPress={clearFilter} style={GPTpopupStyles.ingredientControlsButton}><View><Text>Clear Filter</Text></View></TouchableHighlight>
        </View>

        {(() => {
          if (sortingOn != "None") return (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Press to Change Direction</Text>
              <Button
                title={sortingDir[sortingOn]}
                onPress={() => (changeIngredientSortDirection(sortingOn, sortingDir))}
              />
            </View>
          )
        })()}

      </View>
    )
  }

  const changeIngredientSortDirection = (sortingOn, sortingDir) => {
    if (sortingOn === "Price") {
      if (sortingDir['Price'] === "Ascending") sortStoresIngredients("Price", "Descending")
      else if (sortingDir['Price'] === "Descending") sortStoresIngredients("Price", "Ascending")
    }
    else if (sortingOn === "Name") {
      if (sortingDir["Name"] === "Alphabetical") sortStoresIngredients("Name", "Reverse-alpha")
      else if (sortingDir["Name"] === "Reverse-alpha") sortStoresIngredients("Name", "Alphabetical")
    }
  }

  function recipeMatchesFilter(recipe, ingredientFilter) {
    const res = (ingredientFilter.every(
      (filterIngredient) => (recipe.ingredients.some(
        (recipeIngredient) => (recipeIngredient === filterIngredient)))))
    return res
  }

  function sortStoresIngredients(option, setDirection) {
    if (option == "None") return
    if (option == undefined) option = sortingOn
    if (setDirection == undefined) setDirection = sortingDir[option]

    if (option === "Price") {
      setSortingOn("Price")
      if (setDirection === "Ascending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Ascending", "Name": temp })
        storeData.ingredients.sort((a, b) => ((a.price - a.discount) - (b.price - b.discount)))
        setStoreData(storeData)
      }
      if (setDirection === "Descending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Descending", "Name": temp })
        storeData.ingredients.sort((a, b) => ((b.price - b.discount) - (a.price - a.discount)))
        setStoreData(storeData)
      }

    } else if (option === "Name") {
      setSortingOn("Name")
      if (setDirection === "Alphabetical") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Alphabetical" })
        storeData.ingredients.sort((a, b) => (a.name.localeCompare(b.name)))
        setStoreData(storeData)
      }
      else if (setDirection === "Reverse-alpha") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Reverse-alpha" })
        storeData.ingredients.sort((a, b) => (b.name.localeCompare(a.name)))
        setStoreData(storeData)
      }
    }
  }

  const onPressSearchResult = (item) => {
    inspectProduct(item)
  }

  function render() {

    const recipesDataCopy = JSON.parse(JSON.stringify(recipesData))

    constructRecipesInStoresData(storeData, recipesDataCopy)

    constructPricesInRecipes(storeData)

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
                    atStore={true}
                    navigation={navigation}
                    product={inspectedProduct}
                    storesData={[storeData]}
                    onPressButton={toggleProductModal}
                    onPressFilter={updateIngredientFilter}
                    addItemToCart={passableAddItemToCart}
                  />
                </Modal>
              </View>

              <SectionList
                sections={searchResults}
                keyExtractor={item => (item.id)}
                renderItem={renderSearchResults}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={{ backgroundColor: "green" }}>
                    <Text style={searchStyles.header}>{title}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <ScrollView style={styles.HomeScrollBox}>
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
              <HomeSeparator size="small" />
              {renderStore(storeData)}
            </ScrollView>
          )
        )
    )
  }


  return render()
}
