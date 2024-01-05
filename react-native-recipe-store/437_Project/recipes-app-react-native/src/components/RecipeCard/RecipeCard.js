import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    Image,
  } from "react-native";
  import { styles } from '../../AppStyles'


export default function RecipeCard(props) {
    const recipe = props.recipe
    const ingredients = recipe.ingredients.join(", ");
    const discountPrice = (recipe.price - recipe.discount).toFixed(2);

    return (
        <View
            style={styles.itemContainer}
            underlayColor="#f0f0f0"
            onPress={() => {
                onPress(recipe)
            }}
        >
            <View style={styles.itemDetails}>
                <Image style={styles.itemImage} source={{ uri: recipe.image }} />
                <View>
                    <View style={styles.wrappingTextBox}>
                        <Text style={styles.itemName}>{recipe.name}</Text>
                    </View>
                    <View style={styles.itemIngredientsBox}>
                        <Text style={styles.itemIngredientsText}>{ingredients}</Text>
                    </View>
                    <Text style={styles.itemPrice}>
                        Original Price: ${recipe.price.toFixed(2)}
                    </Text>
                    <Text style={styles.itemDiscount}>
                        Discounted Price: ${discountPrice}        saved: ${recipe.discount.toFixed(2)}!
                    </Text>
                </View>
            </View>
        </View>
    )
}