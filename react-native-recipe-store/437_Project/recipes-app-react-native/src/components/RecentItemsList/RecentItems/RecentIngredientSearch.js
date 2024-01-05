import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
} from "react-native";
import { styles } from '../../../AppStyles'

export default function RecentIngredientSearch(props) {
    const recentIngredientSearchItem = props.ingredientSearchItem
    const storesData = props.storesData
    const navigation = props.navigation

    const onPressIngredientSearch = async (item) => {
        navigation.navigate("Ingredient", { ingredientItem: item });
    };


    if (recentIngredientSearchItem.storeid === undefined) return

    const relatedStore = storesData.find(
        storeItem => (storeItem.id === recentIngredientSearchItem.storeid))

    if (relatedStore === undefined) {
        return
    }

    const recentIngredientSearched = relatedStore.ingredients.find(
        ingredientItem => (ingredientItem.id === recentIngredientSearchItem.id))

    return (
        <TouchableHighlight
            style={styles.itemContainer}
            underlayColor="#f0f0f0"
            onPress={() => {
                onPressIngredientSearch(recentIngredientSearched)
            }}
        >
            <View style={styles.itemDetails}>
            <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>{"\n"}Search for recipes using:
                    {"\n"}{"\n"}
                    {recentIngredientSearched.name} {"\n"}{"\n"}
                    in your pinned stores</Text>
            </View>
                
                <Image style={styles.itemImage} source={{ uri: recentIngredientSearched.image }} />
            </View>
            {/* <View style={styles.itemDetails}>
                <View style={styles.wrappingTextBox}>
                    <Text style={styles.itemName}>{recipe.title}</Text>
                </View>
                <Image style={styles.itemImage} source={{ uri: recipe.image }} />
                <View>
                    <Text>Price reduced by: ${recipe.discount.toFixed(2)}</Text>
                </View>
            </View> */}
        </TouchableHighlight>
    )
}