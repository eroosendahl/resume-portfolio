import {
    Text,
    View,
    Button,
    TouchableHighlight
} from "react-native";
import { GPTpopupStyles, styles } from '../../AppStyles'
import RecipePopupContent from './PopupContent/RecipePopupContent'
import IngredientPopupContent from './PopupContent/IngredientPopupContent'

export default function ProductPopup(props) {
    const product = props.product
    const onPressButton = props.onPressButton
    const addItemToCart = props.addItemToCart

    console.log("product.storeid")
    console.log(product.storeid)

    if(product.store)console.log(product.store)

    function isRecipe(item) {
        if (item.ingredients != undefined) return true
        else return false
    }

    var popupContent;

    if (isRecipe(product)) 
        popupContent = <RecipePopupContent addItemToCart={addItemToCart} recipe={product} />
    else 
        popupContent = <IngredientPopupContent addItemToCart={addItemToCart} ingredient={product}/>

    return (
        <View style={GPTpopupStyles.modalContainer}>
            <View style={GPTpopupStyles.modalContent}>
                {popupContent}
                <TouchableHighlight style={GPTpopupStyles.closeButton} title="Close" onPress={onPressButton} >
                    <View><Text>Close</Text></View>
                </TouchableHighlight>
            </View>
        </View>
    )
}