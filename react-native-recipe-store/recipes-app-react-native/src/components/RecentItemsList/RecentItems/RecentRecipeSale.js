import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
} from "react-native";
import { styles } from '../../../AppStyles'

export default function RecentRecipeSale(props) {
    const recipe = props.recentRecipeData
    if (!recipe) return
    if (!(recipe.ingredients)) return
    const recentStore = props.recentStoreData
    const onPress = props.onPressRecipe

    if (recentStore === undefined) return
    const ingredients = recipe.ingredients.join(", ");
    const storeRecipe = recentStore.recipes.find(storeRecipeItem => (storeRecipeItem.id === recipe.id))
    recipe.price = storeRecipe.price
    recipe.discount = storeRecipe.discount
    const discountPrice = (storeRecipe.price - storeRecipe.discount).toFixed(2);
    recipe.storeid = recentStore.id
    recipe.discountPrice = discountPrice
    if (!recipe.title) recipe.title = recipe.name
    const longRecipeLength = 44
    const isRecipeLong = (recipe.title.length > longRecipeLength)
    const recipeTitleText = (isRecipeLong ? recipe.title.slice(0, longRecipeLength) + "..." : recipe.title)

    return (
      <TouchableHighlight
            style={styles.itemContainer}
            underlayColor="#f0f0f0"
            onPress={() => {
                onPress(recipe, recentStore)
            }}
        >
            <View style={styles.itemDetails}>
                <View style={styles.wrappingTextBox}>
                    <Text style={styles.itemName}>{recipeTitleText}{'\n'}
                    <Text style={{fontSize:11}}>From: {recentStore.title}</Text>
                    </Text>
                </View>
                <Image style={styles.itemImage} source={{ uri: recipe.image }} />
                <View style={styles.greenHighlight}>
                    <Text>Price reduced by: ${recipe.discount.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}