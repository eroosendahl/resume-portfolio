import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
} from "react-native";
import RecentRecipeSale from "./RecentItems/RecentRecipeSale";
import RecentIngredientSearch from "./RecentItems/RecentIngredientSearch";
import RecentRecipeSearch from "./RecentItems/RecentRecipeSearch";

export default function RecentItemsList(props) {
    const recentItemData = props.recentItemData
    const recipesData = props.recipesData
    const storesData = props.storesData
    const onPressRecipe = props.onPressRecipe
    const navigation = props.navigation

    function renderRecentItem(recentItem) {
        if (recentItem.screen === "Store") {
            if (recentItem.type.toLowerCase() === "recipe") {
                const recentRecipeID = recentItem.id
                const recentStoreID = recentItem.storeid
                const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
                const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
                //return renderRecentRecipeSale(recentRecipeData, recentStoreData)
                return <RecentRecipeSale onPressRecipe={onPressRecipe} recentRecipeData={recentRecipeData} recentStoreData={recentStoreData} />
            }
        } else if (recentItem.screen === "Home") {
            if (recentItem.type.toLowerCase() === "recipe") {
                const recentRecipeID = recentItem.id
                const recentStoreID = recentItem.storeid
                const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
                const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
                //return renderRecentRecipeSale(recentRecipeData, recentStoreData)
                return <RecentRecipeSale onPressRecipe={onPressRecipe} recentRecipeData={recentRecipeData} recentStoreData={recentStoreData} />
            }
        } else if (recentItem.screen.toLowerCase() === "ingredients") {
            const recentIngredientSearchItem = recentItem
            //return renderRecentIngredientSearch(recentIngredientSearchItem)
            //return <RecentIngredientSearch navigation={navigation} storesData={storesData} ingredientSearchItem={recentIngredientSearchItem} />
            return  // just not doing ingredient searches they look terrible and aren't very useful
        } else if (recentItem.screen.toLowerCase() === "ingredient") {
            const recentRecipeID = recentItem.id
            const recentStoreID = recentItem.storeid
            const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
            const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
            //return renderRecentRecipeSale(recentRecipeData, recentStoreData)
            return <RecentRecipeSale onPressRecipe={onPressRecipe} recentRecipeData={recentRecipeData} recentStoreData={recentStoreData} />
        } else if (recentItem.screen.toLowerCase() === "recipes") {
            const recentRecipeID = recentItem.id
            const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
            //return renderRecentRecipeSearch(recentRecipeData)
            //return <RecentRecipeSearch navigation={navigation} recipeData={recentRecipeData} />
            return //same deal, though this has more value in some form (not here)
        } else if (recentItem.screen.toLowerCase() === "recipe") {
            const recentRecipeID = recentItem.id
            const recentStoreID = recentItem.storeid
            const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
            const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
            //return renderRecentRecipeSale(recentRecipeData, recentStoreData)
            return <RecentRecipeSale onPressRecipe={onPressRecipe} recentRecipeData={recentRecipeData} recentStoreData={recentStoreData} />
        }
    }

    return <FlatList
        horizontal
        data={recentItemData}
        renderItem={(item) => renderRecentItem(item.item)}
        keyExtractor={item => (item.id)}
    />
}