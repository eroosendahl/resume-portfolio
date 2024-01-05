import { TouchableHighlight, Image, Text, View } from "react-native";
import { styles } from "../../AppStyles";

export default function HomeSeparator(props) {
    const size = props.size

    if (size == "big") {
        return (
            <View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
            </View>

        )
    } else if (size == "medium") {
        return (
            <View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
            </View>

        )
    }
    else if (size == "small") {
        return (
            <View style={styles.homeBigSeparator}></View>
        )
    } else if (size =="tiny") {
        return (
            <View style={styles.homeBigSeparatorPleasant}></View>
        )
    }

}