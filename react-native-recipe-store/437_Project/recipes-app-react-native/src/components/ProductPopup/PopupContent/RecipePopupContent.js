import {
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  Button,
  Modal,
  StyleSheet
} from "react-native";
import { styles, GPTpopupStyles } from '../../../AppStyles'

export default function RecipePopupContent(props) {
  const recipe = props.recipe
  const addItemToCart = props.addItemToCart

  const ingredients = recipe.ingredients.join(", ");
  const discountPrice = (recipe.price - recipe.discount).toFixed(2);

  return (
    <View style={styles.itemContainer} >
      <View style={styles.itemDetails}>
        <Text style={GPTpopupStyles.smallerHeaderText}>{recipe.title}{'\n'}
          <Text style={{ fontSize: 11 }}>From: {recipe.store.title}</Text></Text>
        <Image style={styles.itemImage} source={{ uri: recipe.image }} />
        <View>
          <View style={styles.itemIngredientsBox}>
            <Text style={styles.itemIngredientsText}><Text style={{ fontWeight: 'bold' }}>Ingredients</Text>{'\n'}{ingredients}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={GPTpopupStyles.recipePriceBox}>
              <Text style={GPTpopupStyles.itemPrice}>Original Price: ${recipe.price.toFixed(2)}</Text>
              <Text style={GPTpopupStyles.itemPrice}>Discount: -${recipe.discount.toFixed(2)}</Text>
              <Text style={GPTpopupStyles.itemDiscount}>Your Price: ${discountPrice}</Text>
            </View>
            <View style={{ right: 10, bottom: 10 }}>
              <TouchableHighlight onPress={() => addItemToCart(recipe)} style={GPTpopupStyles.addToCartBtn} >
                <View><Text>Add to cart</Text></View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
  //return <View><Text>hi recipes!</Text></View>
}