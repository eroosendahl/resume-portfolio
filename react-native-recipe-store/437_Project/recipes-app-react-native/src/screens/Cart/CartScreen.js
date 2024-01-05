import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Modal } from 'react-native';
import { CartContext } from '../../CartContext';
import { ScrollView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getAuth } from "firebase/auth";
import { purchaseItem, getStoreNameFromID } from '../../Utility';
import CheckoutPopup from '../../components/CheckoutPopup/CheckoutPopup';
import TrashButton from '../../components/TrashButton/TrashButton';

const CartScreen = () => {
  const [cart, setCart] = useContext(CartContext);
  const [openIndex, setOpenIndex] = useState(null);
  const userUID = getAuth().currentUser.uid
  const [checkingOut, setCheckingOut] = useState(false)
  const [storeName, setStoreName] = useState("")

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const toggleModal = () => {
    setCheckingOut(!checkingOut);
  };

  const removeIngredient = (recipeIndex, ingredientIndex) => {
    const newCart = [...cart];
    newCart[recipeIndex].ingredientPrices.splice(ingredientIndex, 1);
    setCart(newCart);
  };

  const totalCost = cart.reduce((total, item) => {
    if (item.ingredientPrices) { // item is a recipe
      return total + item.ingredientPrices.reduce((sum, ingredient) => sum + (ingredient.price - ingredient.discount), 0);
    } else { // item is an ingredient
      return total + (item.price - item.discount);
    }
  }, 0);

  const totalSavings = cart.reduce((total, item) => {
    if (item.ingredientPrices) { // item is a recipe
      return total + item.ingredientPrices.reduce((sum, ingredient) => sum + ingredient.discount, 0);
    } else { // item is an ingredient
      return total + item.discount;
    }
  }, 0);


  // Fetch the store name when the cart updates
  useEffect(() => {
    const fetchStoreName = async () => {
      if (cart.length > 0) {
        // Find the first recipe in the cart
        const firstRecipe = cart.find(item => item.ingredients);

        let name;
        if (firstRecipe) {
          // If a recipe is found, fetch the store name using the storeid
          name = await getStoreNameFromID(firstRecipe.storeid);
        } else {
          // If no recipe is found, use the store property of the first ingredient
          name = cart[0].store;
        }

        setStoreName(name);
        console.log(name);
      }
    };

    fetchStoreName();
  }, [cart]);



  const purchaseCart = () => {
    cart.forEach(recipe => {
      purchaseItem(recipe, userUID)
    })
    alert("Your cart is purchased.\nYour recent items, and stores' recipe popularities have updated.")
    setCart([])
  }

  const emptyCart = () => {
    alert("Your cart is emptied.")
    console.log(cart[0].storeid)

    setCart([])
  }

  function renderCartHeader() {

    if (cart.length != 0) {
      return <Text style={styles.title}>Your cart</Text>
    } else {
      return <Text style={styles.title}>Your cart is empty</Text>
    }
  }

  function render() {
    return (
      <View style={styles.container}>
        <View style={{ right: 15, flexDirection: "row" }}>
          <TrashButton title="Empty Cart" onPress={emptyCart} />
          {renderCartHeader()}
        </View>

        <Text style={styles.instructions}>Click a recipe to see its ingredients.</Text>
        {cart.length > 0 && storeName && <Text style={styles.storeName}>{storeName}</Text>}
        {/* <Text style={styles.costStatistics}>Total Cost: ${totalCost.toFixed(2)}</Text>
        <Text style={styles.costStatistics}>Total Savings: ${totalSavings.toFixed(2)}</Text> */}
        <ScrollView style={{ width: "100%" }}>
          {cart.map((recipe, index) => {
            if (recipe.ingredientPrices) { // item is a recipe
              if (!recipe.name) recipe.name = recipe.title
              if (!recipe.title) recipe.title = recipe.name
              const longRecipeLength = 44
              const isRecipeLong = (recipe.title.length > longRecipeLength)
              const recipeTitleText = (isRecipeLong ? recipe.title.slice(0, longRecipeLength) + "..." : recipe.title)

              return <View key={index} style={styles.recipeContainer}>
                <TouchableOpacity onPress={() => setOpenIndex(openIndex === index ? null : index)}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle}>{recipe.name}</Text>
                    <Text style={styles.recipePrice}> ${recipe.ingredientPrices.reduce((sum, ingredient) => sum + ingredient.price - ingredient.discount, 0).toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
                {openIndex === index && recipe.ingredientPrices.map((ingredient, ingredientIndex) => (
                  <View key={ingredientIndex} style={styles.ingredientContainer}>
                    <Text style={styles.ingredient}>{ingredient.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.ingredientPriceStrikethrough}>${ingredient.price.toFixed(2)}</Text>
                      <Text style={styles.ingredientSalePrice}>${ingredient.salePrice.toFixed(2)}</Text>
                    </View>
                  </View>

                ))}
              </View>
            }
          })}

          {cart.map((ingredient, index) => {
            if (!ingredient.ingredientPrices) { // item is an ingredient
              return (
                <View key={index} style={styles.ingredientContainer}>
                  <Text style={styles.ingredient}>{ingredient.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.ingredientPriceStrikethrough}>${ingredient.price.toFixed(2)}</Text>
                    <Text style={styles.ingredientSalePrice}>${(ingredient.price - ingredient.discount).toFixed(2)}</Text>
                  </View>
                </View>
              );
            }
          })}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.totalPriceStrikethrough}>${(totalCost + totalSavings).toFixed(2)}</Text>
              <Text style={styles.totalPrice}>${totalCost.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={purchaseCart} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Purchase Cart</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return render()
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Add this line
    alignItems: 'center', // Add this line
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
  },
  costStatistics: {
    fontSize: 16,
    marginBottom: 10,
  },
  recipeContainer: {
    marginBottom: 20,
    borderWidth: 0,
    borderRadius: 5,
    padding: 10,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    width:260
  },
  recipePrice: {
    fontSize: 16,
  },
  ingredientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF'
  },
  ingredient: {
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientPriceStrikethrough: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  ingredientSalePrice: {
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 20,
    position: 'absolute', // Add this line
    bottom: 5, // Add this line
    width: '100%', // Add this line
  },
  emptyCartButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 20,
    position: 'absolute', // Add this line
    bottom: 60, // Add this line
    width: '50%', // Add this line
    height: 10,
    left: 50
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalPriceStrikethrough: {
    fontSize: 20,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  totalPrice: {
    fontSize: 20,
    color: 'red',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center', // centers the text in the bubble
  },

});

export default CartScreen;
