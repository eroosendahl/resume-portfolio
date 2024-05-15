import {
    Text,
    View,
    Button,
    Image,
    TouchableHighlight
} from "react-native";
import { styles } from '../../AppStyles'

export default function SearchResult(props) {
    const item = props.item
    const onPress = props.onPress

    if (item.type == "store") return (
        <TouchableHighlight onPress={() => (onPress(item))} style={styles.searchResultContainer}>

            <View>
                <Image source={{ uri: item.image }} />
                <Text>{item.title}</Text>
            </View>
        </TouchableHighlight>
    )

    if (item.type == "recipe") return (
        <TouchableHighlight onPress={() => (onPress(item))} style={styles.searchResultContainer}>
            
            <View>
                <Image source={{ uri: item.image }} />
                <Text>{item.title}</Text>
            </View>
        </TouchableHighlight>

    )

    if (item.type == "ingredient") return (
        <TouchableHighlight onPress={() => (onPress(item))} style={styles.searchResultContainer}>
            
            <View>
                <Image source={{ uri: item.image }} />
                <Text>{item.title}</Text>
            </View>
        </TouchableHighlight>
    )
}