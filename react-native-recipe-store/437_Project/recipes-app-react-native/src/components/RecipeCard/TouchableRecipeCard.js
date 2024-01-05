import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
} from "react-native";
import { styles } from '../../AppStyles'


export default function TouchableRecipeCard(props) {
    const recipe = props.recipe
    const onPress = props.onPress
    const store = props.store
    if (!recipe.title) recipe.title = recipe.name
    const longRecipeLength = 44
    const isRecipeLong = (recipe.title.length > longRecipeLength)
    const recipeTitleText = (isRecipeLong ? recipe.title.slice(0, longRecipeLength) + "..." : recipe.title)

    return (
        <TouchableHighlight
            style={styles.itemContainer}
            underlayColor="#f0f0f0"
            onPress={() => {
                onPress(recipe, store)
            }}
        >
            <View style={styles.itemDetails}>
                <View style={styles.wrappingTextBox}>
                    <Text style={styles.itemName}>{recipeTitleText}</Text>
                </View>
                <Image style={styles.itemImage} source={{ uri: recipe.image }} />
                <View style={styles.greenHighlight}>
                    <Text>Price reduced by: ${recipe.discount.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

{/* <View style={styles.itemIngredientsBox}>
    <Text style={styles.itemIngredientsText}>{ingredients}</Text>
</View>
<Text style={styles.itemPrice}>
    Original Price: ${recipe.price.toFixed(2)}
</Text>
<Text style={styles.itemDiscount}>
    Discounted Price: ${discountPrice}        saved: ${recipe.discount.toFixed(2)}!
</Text> */}