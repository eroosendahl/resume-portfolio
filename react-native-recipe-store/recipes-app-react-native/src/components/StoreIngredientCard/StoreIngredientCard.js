import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  StyleSheet
} from "react-native";
//import { styles, } from "../../AppStyles";
import Arrow from 'react-native-arrow'


export default function StoreIngredientCard(props) {
  const ingredient = props.ingredient
  const onPressFilterTag = props.onPressFilterTag
  const onPressPurchaseTag = props.onPressPurchaseTag
  const ingredientFilter = props.ingredientFilter

  function renderIngredientTag(inputIngredient) {
    ingredientName = inputIngredient.name
    if (ingredientFilter.some((filterIngredientName) => (filterIngredientName === ingredientName))) {
      return <View style={styles.ingredientFilterTagBox}>
        <TouchableHighlight
          style={styles.ingredientFilterTagSelected}
          underlayColor="#f0f0f0"
          onPress={() => onPressFilterTag(inputIngredient.name)}
        >
          <View><Text style={styles.ingredientFilterTagText}>Remove from filter</Text></View>
        </TouchableHighlight>
      </View>
    } else {
      return (<View style={styles.ingredientFilterTagBox}>
        <TouchableHighlight
          style={styles.ingredientFilterTag}
          underlayColor="#f0f0f0"
          onPress={() => onPressFilterTag(inputIngredient.name)}
        >
          <View><Text style={styles.ingredientFilterTagText}>Add to filter</Text></View>
        </TouchableHighlight>
      </View>)
    }
  }

  function renderPurchaseTag(inputIngredient) {
    return <View style={styles.ingredientFilterTagBox}>
      <TouchableHighlight
        style={styles.ingredientFilterTag}
        underlayColor="#f0f0f0"
        onPress={() => onPressPurchaseTag(inputIngredient)}
      >
        <View><Text style={styles.ingredientFilterTagText}>Add to cart</Text></View>
      </TouchableHighlight>
    </View>
  }

  return (
    <View style={styles.storeIngredientCard}>
      {renderIngredientTag(ingredient)}
      <View style={styles.storeIngredientDetailsBox} >
        <Image style={styles.storeIngredientCardImage} source={{ uri: ingredient.image }} />
        <View style={{ marginLeft: 0, flex: 1 }}>
          <Text style={styles.storeIngredientCardName}>{ingredient.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.itemPrice}>${ingredient.price.toFixed(2)} </Text>
            <Arrow size={10} color={'black'} />
            <Text style={styles.itemDiscount}> ${(ingredient.price - ingredient.discount).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ingredientPurchaseTagBox}>
        {renderPurchaseTag(ingredient)}
      </View>
    </View>
  )
}

const borderGreen = '#1e8449'

const styles = StyleSheet.create({
  storeIngredientCard: {
    flexDirection: 'column', // Changed to column
    alignItems: 'stretch', // Adjusted to stretch
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  ingredientFilterTagBox: {
    marginBottom: 10,
  },
  ingredientFilterTag: {
    padding: 10,
    backgroundColor: '#aafca9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: borderGreen
  },
  ingredientFilterTagSelected: {
    padding: 10,
    backgroundColor: '#light-blue',
    borderRadius: 8,
  },
  ingredientFilterTagText: {
    color: '#333',
  },
  storeIngredientDetailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIngredientCardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  storeIngredientCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontSize: 14,
    color: '#333',

  },
  ingredientPurchaseTagBox: {
    marginTop: 10,
  },
  ingredientPurchaseTag: {
    padding: 10,
    backgroundColor: '#aafca9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: borderGreen
  },
  ingredientPurchaseTagText: {
    color: '#333',
  },
});