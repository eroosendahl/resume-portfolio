import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import { styles, GPTpopupStyles } from '../../../AppStyles'
import Arrow from 'react-native-arrow'

export default function RecipeMatch(props) {
  const atStore = props.atStore
  const recipe = props.recipe
  const store = props.store
  const navigation = props.navigation
  const addItemToCart = props.addItemToCart
  const onPressStore = props.onPressStore

  const ingredients = recipe.ingredients.join(", ");
  const discountPrice = (recipe.price - recipe.discount).toFixed(2);

  function renderStoreNavButton() {
    return (atStore ? null :
      <TouchableHighlight onPress={() => onPressStore(store)} style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
        <View><Text>Visit Store</Text></View>
      </TouchableHighlight>)
  }

  return (
    <View style={styles.itemContainerSmall} >
      <View style={styles.itemDetailsAlt}>
        <Text style={GPTpopupStyles.smallerHeaderText}>{store.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={GPTpopupStyles.itemPrice}>${recipe.price.toFixed(2)} </Text>
          <Arrow size={10} color={'black'} />
          <Text style={GPTpopupStyles.itemDiscount}> ${(recipe.price - recipe.discount).toFixed(2)}</Text>
        </View>
      </View>
      <View>
        {renderStoreNavButton()}
        <TouchableHighlight onPress={() => addItemToCart(recipe)} style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
          <View><Text>Add to Cart</Text></View>
        </TouchableHighlight>
      </View>
    </View>
  )
}