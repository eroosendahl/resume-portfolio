import React, { useState } from 'react';
import { CartContext } from './CartContext';

export class Store {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.ingredients = data.ingredients;
    }

}

export const awsIP = "http://ec2-3-86-208-16.compute-1.amazonaws.com:3000"

export async function getStoreNameFromID(storeID) {
    const storeFetchURL = awsIP + '/StoreData/' + storeID
    const storeResponse = await fetch(storeFetchURL)
    const storePromise = await storeResponse.json()
    return storePromise.title
}
export function addItemToCart(storesData, cart, item, setCart) {
    const isArray = Array.isArray(storesData)
    const store = (isArray ? storesData.find(store => store.id === item.storeid) : storesData)
    if (item.storeid === undefined) console.log(item)

    // Check if item is a recipe or an ingredient
    if (item.ingredients) {
        // Item is a recipe
        item.ingredientPrices = item.ingredients.map(ingredientName => {
            const storeIngredient = store.ingredients.find(storeIngredient => storeIngredient.name === ingredientName);
            return {
                name: ingredientName,
                price: storeIngredient.price,
                discount: storeIngredient.discount,
                salePrice: storeIngredient.price - storeIngredient.discount
            };
        });
    } else {
        // Item is an ingredient
        item.price = store.ingredients.find(storeIngredient => storeIngredient.name === item.name).price;
        item.store = store.title
    }

    const isItemInCart = cart.some(cartItem => cartItem.id === item.id && cartItem.name === item.name);


    if (isItemInCart) {
        alert("This item is already in your cart.");
    } else {
        // Find the first recipe in the cart
        const firstRecipeInCart = cart.find(cartItem => cartItem.ingredients);
        // If the first recipe in the cart exists and its storeid is different from the item's storeid
        if(item.ingredients) {
            if (firstRecipeInCart && firstRecipeInCart.storeid !== item.storeid) {
                console.log("AAA")
                cart.forEach(item => (console.log(item.storeid)))
                console.log(firstRecipeInCart.storeid)
                console.log(item.storeid)
                alert("Cannot add this to cart as it is from a different store.");
            } else {
                setCart(currentCart => [...currentCart, item]);
                alert("Item added to Cart!");
            }
        }
        else {
            setCart(currentCart => [...currentCart, item]);
                alert("Item added to Cart!");
        }
       
    }
};


export async function purchaseItem(item, userUID) {
    if (!(item.ingredients)) return
    const updateRecent = awsIP + '/UpdateRecent/'
    const updatePopularity = awsIP + '/UpdatePopularity/'
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Home/recipe/${item.storeid}`);
    const result = await response.text();
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`);
    const popResult = await popResponse.text();
}


export function constructRecipesInStoresData(inputStoresData, inputRecipesData) {
    if (Array.isArray(inputStoresData)) {
        inputStoresData.forEach((storeItem) => {
            storeItem.recipes = []
            inputRecipesData.forEach((recipeItem) => {
                if (recipeItem.ingredients.every(
                    (recipeIngredientName) => {
                        return storeItem.ingredients.some(
                            (storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                    })) {
                    recipeItem.storeid = storeItem.id
                    recipeItem.storeTitle = storeItem.title

                    storeItem.recipes.push(JSON.parse(JSON.stringify(recipeItem)))
                }
            })
        })
        return inputStoresData
    } else {
        const inputStoreData = inputStoresData
        inputStoreData.recipes = []
        inputRecipesData.forEach((recipeItem) => {
            if (recipeItem.ingredients.every( // strict matching
                (recipeIngredientName) => {
                    return inputStoreData.ingredients.some(
                        (storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                })) {
                inputStoreData.recipes.push(recipeItem)
            }
        })

        return inputStoreData
    }
}


export function constructPricesInRecipes(inputStoresData) {
    if (inputStoresData.length == 0) return

    if (Array.isArray(inputStoresData)) {
        inputStoresData.forEach((storeItem) => {
            storeItem.recipes.forEach((recipeItem) => {
                var sumPrices = 0
                var sumDiscounts = 0
                recipeItem.ingredients.forEach((recipeIngredientName) => {
                    const storeIngredientItemCopy = storeItem.ingredients.find((storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                    sumPrices += storeIngredientItemCopy.price
                    sumDiscounts += storeIngredientItemCopy.discount
                })
                recipeItem.price = sumPrices
                recipeItem.discount = sumDiscounts
                recipeItem.salePrice = sumPrices - sumDiscounts
            })
        })
    } else {
        const inputStoreData = inputStoresData
        inputStoreData.recipes.forEach((recipeItem) => {
            var sumPrices = 0
            var sumDiscounts = 0
            recipeItem.ingredients.forEach((recipeIngredientName) => {
                const storeIngredientItemCopy = inputStoreData.ingredients.find((storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                sumPrices += storeIngredientItemCopy.price
                sumDiscounts += storeIngredientItemCopy.discount
            })
            recipeItem.price = sumPrices
            recipeItem.discount = sumDiscounts
            recipeItem.salePrice = sumPrices - sumDiscounts
        })
    }

}

export function gatherPopularRecipes(inputStoreItem) {
    if (inputStoreItem.recipes === undefined) return

    const inputRecipes = inputStoreItem.recipes
    const inputRecipePopularities = inputStoreItem.recipePopularity

    inputRecipePopularities.sort((a, b) => (b.clicks - a.clicks))

    const popularIDs = inputRecipePopularities.map((popularityItem) => (popularityItem.id))

    const popularRecipes = []

    inputRecipePopularities.forEach(recPop => {
        if (recPop.popular) {
            const forcedPopRec = inputRecipes.find(rec => (rec.id === recPop.id))
            if (forcedPopRec != undefined) popularRecipes.push(forcedPopRec)
        }
    })

    popularIDs.map((popRecipeID) => {
        const eligibleRecipe = inputRecipes.find((recipe) => (recipe.id === popRecipeID))
        if (eligibleRecipe != undefined && !popularRecipes.some(popRec => (popRec.id === eligibleRecipe.id))) popularRecipes.push(eligibleRecipe)
    })

    const topTenPopRecipes = popularRecipes.slice(0, 9)
    return topTenPopRecipes
}

export function compareByName(userInput, itemTitle) {
    if (itemTitle === undefined) return
    return (itemTitle.toLowerCase().startsWith(userInput.toLowerCase()))
}
