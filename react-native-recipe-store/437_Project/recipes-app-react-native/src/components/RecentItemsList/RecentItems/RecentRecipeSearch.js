import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
} from "react-native";
import { styles } from '../../../AppStyles'

export default function RecentRecipeSearch(props) {
    const recentRecipe = props.recipeData
    const navigation = props.navigation

    const onPressRecipeSearch = async (item) => {
        navigation.navigate("Recipe", { recipeItem: item });
      };

    const ingredients = recentRecipe.ingredients.join(", ");
    return (
        <TouchableHighlight
            style={styles.itemContainer}
            underlayColor="#f0f0f0"
            onPress={() => {
                onPressRecipeSearch(recentRecipe)
            }}
        >
            <View style={styles.itemDetails}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Search for similar recipes to:</Text>
                <Image style={styles.itemImage} source={{ uri: recentRecipe.image }} />
                <View>
                    <View style={styles.wrappingTextBox}>
                        <Text style={styles.itemName}>{recentRecipe.name}</Text>
                    </View>
                    <View style={styles.itemIngredientsBox}>
                        <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}