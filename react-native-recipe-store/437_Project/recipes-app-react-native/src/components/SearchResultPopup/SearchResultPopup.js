import {
    Text,
    View,
    ScrollView,
    Button,
    FlatList,
    TouchableHighlight,
    Image
} from "react-native";
import RecipeMatch from './PopupMatches/RecipeMatch'
import { GPTpopupStyles, styles } from '../../AppStyles'
import IngredientMatch from './PopupMatches/IngredientMatch'

export default function SearchResultPopup(props) {
    const atStore = props.atStore
    const item = props.product   // store, ingredient, or recipe
    const storesData = props.storesData
    const onPressButton = props.onPressButton
    const onPressStore = props.onPressStore
    const navigation = props.navigation
    const addItemToCart = props.addItemToCart
    const onPressFilter = props.onPressFilter

    console.log("BBB item.storeid")
    console.log(item.storeid)

    var storeSuggestions = []

    function singleStoreSuggestion(item) {
        return <TouchableHighlight onPress={() => onPressStore(item)} style={GPTpopupStyles.itemCard}>
            <View style={GPTpopupStyles.itemContainerAlt}>
                <Image style={GPTpopupStyles.imageAlt} source={{ uri: item.image }} />
                <Text style={GPTpopupStyles.itemHeaderTextAlt}>{item.title}</Text>
            </View>
        </TouchableHighlight>
    }

    function renderSuggestionsForRecipe(inputRecipe, inputStoresData) {
        if (!inputStoresData) return

        var res = []

        inputStoresData.forEach(storeItem => {
            if (storeItem.recipes.length === 0) return

            if (storeItem.recipes.some(recipe => {

                if (!recipe.title) recipe.title = recipe.name
                if (!inputRecipe.title) inputRecipe.title = inputRecipe.name

                return (recipe.title === inputRecipe.title)
            })) {
                var match = storeItem.recipes.find(recipe => (recipe.title === inputRecipe.title))
                match.storeid = storeItem.id
                res.push(
                    <RecipeMatch onPressStore={onPressStore} addItemToCart={addItemToCart} atStore={atStore} navigation={navigation} recipe={match} store={storeItem} />
                )
            }
        })
        return (
            <View>
                {res}
            </View>
        )
    }

    function renderSuggestionsForIngredient(inputIngredient, inputStoresData) {
        if (!inputStoresData) return
        var res = []

        inputStoresData.forEach(storeItem => {
            if (!(storeItem.ingredients)) return
            if (storeItem.ingredients.some(ingredient => (ingredient.name === inputIngredient.title))) {
                var match = storeItem.ingredients.find(ingredient => (ingredient.name === inputIngredient.title))
                match.storeid = storeItem.id
                res.push(
                    <IngredientMatch onPressFilter={onPressFilter} onPressStore={onPressStore} addItemToCart={addItemToCart} atStore={atStore} navigation={navigation} ingredient={match} store={storeItem} />
                )
            }
        })
        return (
            <View>
                {res}
            </View>
        )
    }

    function renderHeader() {
        if (item.type == "store")
            return

        if (item.type == "recipe") {
            const ingredients = item.ingredients.join(", ");
            return <View>
                <Text style={GPTpopupStyles.headerTextLarge}>{item.title}</Text>
                <Image style={GPTpopupStyles.itemImageAlt} source={{ uri: item.image }} />
            </View>
        }

        if (item.type == "ingredient")
            return <View>
                <Text style={GPTpopupStyles.headerTextLarge}>{item.title}</Text>
                <Image style={GPTpopupStyles.itemImageAlt} source={{ uri: item.image }} />
            </View>
    }

    if (item.type == "store")
        storeSuggestions.push(singleStoreSuggestion(item))

    if (item.type == "recipe")
        storeSuggestions.push(renderSuggestionsForRecipe(item, storesData))

    if (item.type == "ingredient")
        storeSuggestions.push(renderSuggestionsForIngredient(item, storesData))


    return (
        <View style={GPTpopupStyles.modalContainer}>
            <View style={GPTpopupStyles.modalContent}>
                {renderHeader()}
                <ScrollView style={GPTpopupStyles.scrollView}>
                    <Text style={GPTpopupStyles.headerText}>Available at:</Text>
                    {storeSuggestions}
                </ScrollView>
                <TouchableHighlight style={GPTpopupStyles.closeButton} title="Close" onPress={onPressButton} >
                    <View><Text>Close</Text></View>
                </TouchableHighlight>
            </View>
        </View>
    )
}