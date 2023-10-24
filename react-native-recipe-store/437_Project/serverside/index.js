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

// app.all(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })

var admin = require("firebase-admin");

var serviceAccount = require("./project-4fe07-firebase-adminsdk-rgvp7-7b94daa6b6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/DummyData', async (req, res) => {
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
                store: ingredient.store
            })),
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
            discount: ingredient.discount
        })),
        recipes: recipes.map(recipe => ({
            name: recipe.name,
            image: recipe.image,
            ingredients: recipe.ingredients,
            price: calcRecipePrice(ingredients, recipe.ingredients),
            discount: calcRecipeDiscount(ingredients, recipe.ingredients)
        }))
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
    const apiEndpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=grocery_or_supermarket&key=AIzaSyAk74CeIOpVgatZXZbGfAyJ7KpvLTfIa1I`;

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