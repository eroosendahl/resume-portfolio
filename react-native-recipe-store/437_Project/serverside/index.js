// Authors: Erik Roosendahl, Joshua Ki, and Matthew Schlittler
//


const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch');
// The following line will make middle ware parse everything as JSON, which could be bad so commenting out
// the 'strict: false' should allow for null values to parse
app.use(express.json({ strict: false }));

app.get('/', (req, res) => {
    console.log("default req received")
    res.send(JSON.stringify('Hello World!'))
})

app.get('/test', (req, res) => {
    console.log("test req received")
    console.log(req.body)
    res.send(req.body)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
var admin = require("firebase-admin");

var serviceAccount = require("./project-4fe07-firebase-adminsdk-rgvp7-7b94daa6b6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/allStores', async (req, res) => {
    console.log('Retrieving Data from DB')

    // Get data from Firestore
    const storesSnapshot = await db.collection('stores').get();
    const stores = storesSnapshot.docs.map(doc => doc.data());

    // Transform the data
    const transformedStores = stores.map(store => {
        const ingredients = store.ingredients || [];
        const recipes = store.recipes || [];
        return {
            id: store.id,
            image: store.image,
            title: store.title,
            ingredients: ingredients.map(ingredient => ({
                discount: ingredient.discount,
                id: ingredient.id,
                image: ingredient.image,
                name: ingredient.name,
                price: ingredient.price,
                store: ingredient.store,
                category: ingredient.category
            })),
            recipePopularity: store.recipePopularity,
            recipes: recipes.map(recipe => ({
                id: recipe.id,
                image: recipe.image,
                ingredients: recipe.ingredients,
                name: recipe.name,
                store: recipe.store,
                price: calcRecipePrice(ingredients, recipe.ingredients),
                discount: calcRecipeDiscount(ingredients, recipe.ingredients)
            }))
        };
    });

    res.send(JSON.stringify(transformedStores));
});

function calcRecipePrice(SIngr, RIngr) {
    sum = 0;
    SIngr.forEach(ingrObj => {
        if (RIngr.some(ingrName => ingrName === ingrObj.name))
            sum += ingrObj.price
    });
    return sum;
}

function calcRecipeDiscount(SIngr, RIngr) {
    sum = 0;
    SIngr.forEach(ingrObj => {
        if (RIngr.some(ingrName => ingrName === ingrObj.name))
            sum += ingrObj.discount
    });
    return sum;
}


app.get('/allRecipes', async (req, res) => {
    console.log('Retrieving all recipes from DB');

    // Get data from Firestore
    const recipesSnapshot = await db.collection('recipes').get();
    const recipes = recipesSnapshot.docs.map(doc => doc.data());

    // Transform the data
    const transformedRecipes = recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        ingredients: recipe.ingredients,
    }));

    res.send(JSON.stringify(transformedRecipes));
});

app.get('/recipeStores/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;
    console.log(`Retrieving stores for recipe ID: ${recipeId} from DB`);

    // Get the specific recipe from Firestore
    const recipeSnapshot = await db.collection('recipes').doc(recipeId).get();
    if (!recipeSnapshot.exists) {
        res.status(404).send('No recipe found with the given ID');
        return;
    }
    const recipe = recipeSnapshot.data();

    // Get all stores from Firestore
    const storesSnapshot = await db.collection('stores').get();
    const stores = storesSnapshot.docs.map(doc => doc.data());

    // Filter stores that have the ingredients of the recipe
    const filteredStores = stores.filter(store => {
        const ingredients = store.ingredients || [];
        return ingredients.some(ingredient => recipe.ingredients.includes(ingredient.name));
    });

    // Transform the data
    const transformedStores = filteredStores.map(store => {
        const ingredients = store.ingredients || [];
        return {
            id: store.id,
            image: store.image,
            title: store.title,
            ingredients: ingredients.filter(ingredient => recipe.ingredients.includes(ingredient.name)).map(ingredient => ({
                discount: ingredient.discount,
                image: ingredient.image,
                name: ingredient.name,
                price: ingredient.price
            }))
        };
    });

    res.send(JSON.stringify(transformedStores));
});



app.get('/StoreData/:storeId', async (req, res) => {
    const storeId = req.params.storeId;
    console.log(`Retrieving Data for Store ID: ${storeId} from DB`);

    // Get data from Firestore
    const storeSnapshot = await db.collection('stores').doc(storeId).get();
    if (!storeSnapshot.exists) {
        res.status(404).send('No store found with the given ID');
        return;
    }
    const store = storeSnapshot.data();

    // Transform the data
    const ingredients = store.ingredients || [];
    const recipes = store.recipes || [];

    const transformedStore = {
        id: store.id,
        image: store.image,
        title: store.title,
        ingredients: ingredients.map(ingredient => ({
            image: ingredient.image,
            name: ingredient.name,
            price: ingredient.price,
            discount: ingredient.discount,
            category: ingredient.category
        })),
        recipes: recipes.map(recipe => ({
            name: recipe.name,
            image: recipe.image,
            ingredients: recipe.ingredients,
            price: calcRecipePrice(ingredients, recipe.ingredients),
            discount: calcRecipeDiscount(ingredients, recipe.ingredients)
        })),
        recipePopularity: store.recipePopularity
    };

    res.send(JSON.stringify(transformedStore));
});

function removeUnmatchingRecipes(recipeList, inspectedIngredient) {
    return recipeList.filter((recipe) => {
        temp = recipe.ingredients.some((ingredientName) => {
            return (ingredientName === inspectedIngredient)
        })
        return temp
    })
}

app.get('/IngredientData/:ingredientName', async (req, res) => {
    const ingredientName = req.params.ingredientName;
    console.log(`Retrieving Data for Ingredient: ${ingredientName} from DB`);

    // Get data from Firestore
    const storesSnapshot = await db.collection('stores').get();
    const stores = storesSnapshot.docs.map(doc => doc.data());

    // Filter stores that have the ingredient
    const filteredStores = stores.filter(store => {
        const ingredients = store.ingredients || [];
        return ingredients.some(ingredient => ingredient.name === ingredientName);
    });

    // Transform the data
    const transformedStores = filteredStores.map(store => {
        const ingredients = store.ingredients || [];
        const recipes = store.recipes || [];
        const filteredRecipes = removeUnmatchingRecipes(recipes, ingredientName);
        return {
            id: store.id,
            image: store.image,
            title: store.title,
            ingredients: ingredients.map(ingredient => ({
                discount: ingredient.discount,
                image: ingredient.image,
                name: ingredient.name,
                price: ingredient.price
            })),
            recipes: filteredRecipes.map(recipe => ({
                image: recipe.image,
                ingredients: recipe.ingredients,
                name: recipe.name,
                price: calcRecipePrice(ingredients, recipe.ingredients),
                discount: calcRecipeDiscount(ingredients, recipe.ingredients)
            }))
        };
    });

    res.send(JSON.stringify(transformedStores));
});


app.post('/location', async (req, res) => {
    console.log('Received location:', req.body);

    // Get latitude and longitude from request body
    const latitude = req.body.coords.latitude;
    const longitude = req.body.coords.longitude;

    // Define the API endpoint
    const apiEndpoint = ``;

    // Send a request to the Google Places API
    const apiResponse = await fetch(apiEndpoint);

    // Parse the response as JSON
    const data = await apiResponse.json();

    // Extract the names of the stores
    const storeNames = data.results.map(result => result.name);
    console.log(storeNames)
    // Send back the store names
    res.json(storeNames);
});

app.post('/pinClosestStores', async (req, res) => {
    console.log('Received request:', req.body);
    const uid = req.body.uid;
    const userLoc = {
        latitude: req.body.coords.latitude,
        longitude: req.body.coords.longitude
    }

    // Get data from Firestore
    const storeSnapshot = await db.collection('stores').get();
    const stores = storeSnapshot.docs.map(doc => doc.data());

    const formattedStores = stores.map(s => {
        s.distance = calcDistanceKm(userLoc, s.location);
        return s;
    });

    formattedStores.sort(function (a, b) { return a.distance - b.distance }); // This was recommended on w3schools.com for sorting numbers

    // Get user info to update capture
    var userData = await getUserInfo(uid);

    var storesToPin = formattedStores.slice(0, 3); // Get closest 3 stores, if 3 stores aren't availble, then work with what we have
    storesToPin.forEach(s => {
        if (!userData.pinnedStores.includes(s.id)) {
            userData.pinnedStores.push(s.id);
        }
    });

    // Save updated results back to firebase
    await db.collection("users").doc(uid).set(userData);

    console.log('Returned user info: ', userData);
    res.send(JSON.stringify(userData));
});

app.get('/allStoresByDistance/:latitude/:longitude', async (req, res) => {
    const userLoc = {
        latitude: req.params.latitude,
        longitude: req.params.longitude
    };
    console.log('Provide location: ', userLoc);
    console.log('Retrieving Data from DB');

    // Get data from Firestore
    const storesSnapshot = await db.collection('stores').get();
    const stores = storesSnapshot.docs.map(doc => doc.data());

    // Order the data by location
    // First add the distance to the data
    var storesOrdered = stores.map(store => {
        store.distance = calcDistanceMi(userLoc, store.location);
        return store;
    });

    // Now order it by the 
    storesOrdered.sort(function (a, b) { return a.distance - b.distance }); // This was recommended on w3schools.com for sorting numbers

    // Transform the data
    var transformedStores = storesOrdered.map(store => {
        const ingredients = store.ingredients || [];
        const recipes = store.recipes || [];
        return {
            id: store.id,
            image: store.image,
            title: store.title,
            distance: store.distance,
            ingredients: ingredients.map(ingredient => ({
                discount: ingredient.discount,
                id: ingredient.id,
                image: ingredient.image,
                name: ingredient.name,
                price: ingredient.price,
                store: ingredient.store,
                category: ingredient.category
            })),
            recipePopularity: store.recipePopularity,
            recipes: recipes.map(recipe => ({
                id: recipe.id,
                image: recipe.image,
                ingredients: recipe.ingredients,
                name: recipe.name,
                store: recipe.store,
                price: calcRecipePrice(ingredients, recipe.ingredients),
                discount: calcRecipeDiscount(ingredients, recipe.ingredients)
            }))
        };
    });

    res.send(JSON.stringify(transformedStores));
});

// Formula was adapted from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
// For the purposes of this class this kind of accuracy doesn't matter, but if it is ever expanded it would be nice to have.
function calcDistanceKm(start, end) {
    const radius = 6371; // Radius of Earth in km
    const dLat = deg2rad(end.latitude - start.latitude);
    const dLon = deg2rad(end.longitude - start.longitude);

    const arc = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(start.latitude)) * Math.cos(deg2rad(end.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const circumference = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
    const distance = radius * circumference;

    return distance;
}

function calcDistanceMi(start, end) {
    const km = calcDistanceKm(start, end);
    const kmToMi = 0.621371;
    return km * kmToMi;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

app.post('/GetStores', (req, res) => {
    console.log('Received request for stores');
    console.log(req.body);
    if (req.body !== undefined && req.body !== null) {
        if (req.body.lattitude !== undefined) {
            console.log('has lattitude');
        }
        if (req.body.longituded !== undefined) {
            console.log('has longitude');
        }
        if (req.body.address !== undefined) {
            console.log('has address');
        }
    }

    // Fake data for the moment
    var rtnVal = [];
    var numStores = Math.ceil(Math.random() * 10);
    for (var i = 1; i <= numStores; i++) {
        var numIng = Math.ceil(Math.random() * 10);

        var store = {
            name: `Fake Store #${i}`,
            address: `Fake Address #${i}`,
            ingredients: []
        };
        for (var j = 1; j <= numIng; j++) {
            var ing = {
                name: `Fake Ingredient #${j}`,
                quantity: 1,
                price: 2.55
            }
            store.ingredients.push(ing);
        }

        rtnVal.push(store);
    }

    res.send(JSON.stringify(rtnVal));
})

async function getUserInfo(uid) {
    var userData = {
        pinnedStores: [],
        recent: []
    };

    const userSnapshot = await db.collection('users').doc(uid).get();


    if (!userSnapshot.exists) {
        // Create user since they don't currently exist
        await db.collection("users").doc(uid).set(userData);
    }
    else {
        const user = userSnapshot.data();
        console.log("user")
        console.log(user)
        console.log.pinnedStores
        console.log("user.pinnedStores")
        console.log(user.pinnedStores)
        const pinnedStores = user.pinnedStores || [];
        const recent = user.recent || [];

        userData.pinnedStores = pinnedStores;
        userData.recent = recent;
    }

    return userData;
}

app.get('/UserInfo/:uid', async (req, res) => {
    const uid = req.params.uid;
    console.log(`Getting user data for ${uid}`);

    var userData = await getUserInfo(uid);
    console.log(userData);
    res.send(JSON.stringify(userData));
});

app.get('/PinStore/:uid/:store/:pin', async (req, res) => {
    const uid = req.params.uid;
    const store = req.params.store;
    const pin = req.params.pin == 'true';

    console.log(`Pinning store ${store} for ${uid}`);

    var userData = await getUserInfo(uid);
    console.log(pin);
    if (pin === true) {
        // Only push if the store isn't in the list already
        if (!userData.pinnedStores.includes(store)) {
            userData.pinnedStores.push(store);
        }
    }
    else {
        // filter out all stores that match requested store
        var temp = userData.pinnedStores.filter(function (key) {
            return key != store;
        });
        userData.pinnedStores = temp;
    }

    await db.collection("users").doc(uid).set(userData); // Save data back to database

    res.send(JSON.stringify(userData));
});

app.get('/UpdatePopularity/:store/:recipe', async (req, res) => {
    const storeID = req.params.store;
    const recipe = req.params.recipe;

    console.log(`Updating popularity at store ${storeID} for ${recipe}`);

    const storeSnapshot = await db.collection('stores').doc(storeID).get();
    if (!storeSnapshot.exists) {
        res.status(404).send('No store found with the given ID');
        return;
    }

    var store = storeSnapshot.data();
    var index = store.recipePopularity.findIndex(function (r) {
        return r.id == recipe;
    });
    console.log(`Index: ${index}`);
    if (index === -1) { // Did not find existing data, so create entry
        const newEntry = {
            id: recipe,
            clicks: 0 // will be incremented in a moment
        };
        index = store.recipePopularity.push(newEntry) - 1; // Push returns length of array, so decrement by one to get actual index
    }

    store.recipePopularity[index].clicks++; // increment the number of clicks

    // Save back to database
    await db.collection('stores').doc(storeID).set(store);

    res.send(JSON.stringify(store.recipePopularity[index]));
});

app.get('/UpdateRecent/:uid/:id/:screen/:type/:storeid', async (req, res) => {
    const maxRecent = 5;
    const uid = req.params.uid;
    const recID = req.params.id;
    const recScreen = req.params.screen;
    const recType = req.params.type;
    const recStoreID = req.params.storeid;
    const recent = {
        id: recID,
        screen: recScreen,
        type: recType,
        storeid: recStoreID
    };

    var userData = await getUserInfo(uid);

    // Find the index of the item in the recent list
    const index = userData.recent.findIndex(item => item.id === recID && item.screen === recScreen && item.type === recType && item.storeid == recStoreID);

    // If the item exists in the list, remove it
    if (index !== -1) {
        userData.recent.splice(index, 1);
    }

    // Add the item to the front of the list
    userData.recent.unshift(recent);

    // If the list exceeds maxRecent, remove the last item
    if (userData.recent.length > maxRecent) {
        userData.recent.pop();
    }

    await db.collection('users').doc(uid).set(userData);

    res.status(200).send(JSON.stringify(userData.recent));

});

app.get('/UpdateRecent/:uid/:id/:screen/:type/:store', async (req, res) => {
    const maxRecent = 5;
    const uid = req.params.uid;
    const recID = req.params.id;
    const recScreen = req.params.screen;
    const recType = req.params.type;
    const recStore = req.params.store;

    const recent = {
        id: recID,
        screen: recScreen,
        type: recType,
        store: recStore
    };

    var userData = await getUserInfo(uid);

    // Find the index of the item in the recent list
    const index = userData.recent.findIndex(item => item.id === recID && item.screen === recScreen && item.type === recType && item.recStore === recStore);

    // If the item exists in the list, remove it
    if (index !== -1) {
        userData.recent.splice(index, 1);
    }

    // Make sure it has a unique ID
    for (var i = 1; ; i++) {
        var usedIndex = userData.recent.findIndex(item => item.uid === (recType + i));
        if (usedIndex === -1) {
            recent.uid = recType + i;
            break;
        }
    }

    // Add the item to the front of the list
    userData.recent.unshift(recent);

    // If the list exceeds maxRecent, remove the last item
    if (userData.recent.length > maxRecent) {
        userData.recent.pop();
    }

    await db.collection('users').doc(uid).set(userData);

    res.status(200).send(JSON.stringify(userData.recent));
});

app.get('/SetRecipeForcedPopularity/:store/:recipe/:state', async (req, res) => {
    const storeID = req.params.store;
    const recipeID = req.params.recipe;
    const state = req.params.state == 'true';

    console.log('Getting current store info');
    var snapShot = await db.collection('stores').doc(storeID).get();
    var store = snapShot.data();
    //console.log(user);
    //console.log(user.recipePopularity);
    if (store.recipePopularity) {
        // Do nothing
    }
    else {
        console.log('creating recipePopularity');
        store.recipePopularity = [];
    }

    var found = false;
    for (var i = 0; i < store.recipePopularity.length && !found; i++) {
        if (store.recipePopularity[i].id == recipeID) {
            store.recipePopularity[i].popular = state;
            found = true;
            break;
        }
    }

    if (found) {
        // Doing the whole array because I don't think there is a way to do individual element of an array
        await db.collection('stores').doc(storeID).update({ recipePopularity: store.recipePopularity });
    }

    res.send(JSON.stringify(store));
});


app.post('/SetIngredientData/:store/:add', async (req, res) => {
    console.log('SetIngredientData Req: ', req.body);
    const storeID = req.params.store;
    const add = req.params.add == 'true';
    var ing = req.body; // Get ingredient data

    var snapShot = await db.collection('stores').doc(storeID).get();
    if (!snapShot.exists) {
        res.status(404).send('store does not exist');
    }
    else {
        var store = snapShot.data();
        var found = false;
        for (var i = 0; i < store.ingredients.length && !found; i++) {
            if (store.ingredients[i].id == ing.id) {
                store.ingredients[i] = ing;
                found = true;
                break;
            }
        }

        if (!found && add) {
            // This is new ingredient so create it
            var idx = store.ingredients.push(ing);
            store.ingredients[idx - 1].id = 'i' + idx;
            found = true;
        }

        if (found) {
            await db.collection('stores').doc(storeID).update({ ingredients: store.ingredients });
        }

        res.send(JSON.stringify(store));
    }
});
