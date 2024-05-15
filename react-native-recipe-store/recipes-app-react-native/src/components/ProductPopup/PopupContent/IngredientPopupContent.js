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
import Arrow from 'react-native-arrow'
import { styles, GPTpopupStyles } from '../../../AppStyles'

/**
 * 
 * I believe this is currently unused -erik
 */

export default function IngredientPopupContent(props) {
    const ingredient = props.ingredient
    const addItemToCart = props.addItemToCart

    console.log("ingredient")
    console.log(ingredient)

    return (
        <View style={GPTpopupStyles.itemCardAlt} >
            <View style={GPTpopupStyles.itemDetailsAlt}>
                <Text style={GPTpopupStyles.smallerHeaderText}>{ingredient.store.title}</Text>
                <View style={{ marginLeft: 0, flex: 1 }}>
                    <Text style={GPTpopupStyles.itemNameAlt}>{ingredient.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={GPTpopupStyles.itemPrice}>${ingredient.price.toFixed(2)} </Text>
                        <Arrow size={10} color={'black'} />
                        <Text style={GPTpopupStyles.itemDiscount}> ${(ingredient.price - ingredient.discount).toFixed(2)}</Text>
                    </View>
                </View>
                <TouchableHighlight style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
                    <View><Text>Add to Cart</Text></View>
                </TouchableHighlight>
                <TouchableHighlight style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
                    <View><Text>Visit Store</Text></View>
                </TouchableHighlight>
            </View>
        </View>
    )
}