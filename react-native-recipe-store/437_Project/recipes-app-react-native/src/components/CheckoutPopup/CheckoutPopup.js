import {
    Text,
    View,
    Button,
    TouchableHighlight
} from "react-native";
import { useContext } from 'react-native'
import { GPTpopupStyles, styles } from '../../AppStyles'
import { CartContext } from "../../CartContext";

export default function CheckoutPopup(props) {
    const onPressButton = props.onPressButton
    const [cart, setCart] = useContext(CartContext);



    return (
        <View style={GPTpopupStyles.modalContainer}>
            <View style={GPTpopupStyles.modalContent}>
                <Text>Hi !</Text>
                <TouchableHighlight style={GPTpopupStyles.closeButton} title="Close" onPress={onPressButton} >
                    <View><Text>Close</Text></View>
                </TouchableHighlight>
            </View>
        </View>
    )
}