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
import { GPTpopupStyles } from '../../../AppStyles'

export default function IngredientMatch(props) {
    const ingredient = props.ingredient
    const store = props.store
    const navigation = props.navigation
    const addItemToCart = props.addItemToCart
    const onPressStore = props.onPressStore
    const onPressFilter = props.onPressFilter
    const atStore = props.atStore

    function renderButton() {
        return (atStore ?
            <TouchableHighlight onPress={() => onPressFilter(ingredient.name)} style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
                <View><Text>Add to filter</Text></View>
            </TouchableHighlight>
            : <TouchableHighlight onPress={() => onPressStore(store)} style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
                <View><Text>Visit Store</Text></View>
            </TouchableHighlight>)
    }

    function renderButtons() {

        return (
            <View style={{flexDirection: 'row'}}>
                {renderButton()}
                <TouchableHighlight onPress={() => addItemToCart(ingredient)} style={GPTpopupStyles.addToCartBtn} title="Add to Cart" >
                    <View><Text>Add to Cart</Text></View>
                </TouchableHighlight>
            </View>
        )
    }

    return (
        <View style={GPTpopupStyles.itemCardAlt} >
            <View style={GPTpopupStyles.itemDetailsAlt}>
                <Text style={GPTpopupStyles.smallerHeaderText}>{store.title}</Text>
                <View style={{ marginLeft: 0, flex: 1 }}>
                    <Text style={GPTpopupStyles.itemNameAlt}>{ingredient.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={GPTpopupStyles.itemPrice}>${ingredient.price.toFixed(2)} </Text>
                        <Arrow size={10} color={'black'} />
                        <Text style={GPTpopupStyles.itemDiscount}> ${(ingredient.price - ingredient.discount).toFixed(2)}</Text>
                    </View>
                </View>
                {renderButtons()}
            </View>

        </View>
    )
}