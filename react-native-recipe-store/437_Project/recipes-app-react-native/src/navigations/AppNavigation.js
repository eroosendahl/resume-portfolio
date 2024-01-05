import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/Home/HomeScreen";
import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import SearchScreen from "../screens/Search/SearchScreen";
import IngredientByStoreScreen from "../screens/IngredientByStore/IngredientByStoreScreen";
import StoreScreen from "../screens/Store/StoreScreen";
import IngredientsScreen from "../screens/Ingredients/IngredientsScreen";
import IngredientScreen from "../screens/Ingredient/IngredientScreen";
import RecipesScreen from "../screens/Recipes/RecipesScreen";
import RecipeScreen from "../screens/Recipe/RecipeScreen";
import StoresScreen from "../screens/Stores/StoresScreen";
import AllStoresInventoriesScreen from "../screens/AllStoresInventories/AllStoresInventoriesScreen";
import Login from "../screens/Login/Login";
import Signup from "../screens/Signup";
import Settings from "../screens/Settings/Settings";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import OnboardingStoresScreen from "../screens/Onboarding/OnboardingStoresScreen";
import MovableView from 'react-native-movable-view';
import { Image, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../AppStyles';
import CartScreen from "../screens/Cart/CartScreen";
import { useNavigation } from "@react-navigation/native";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
function MainNavigator({ user }) {
  const navigation = useNavigation();
  function HomeScreenWithCart(props) {
    return (
      <>
        <HomeScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function SearchScreenWithCart(props) {
    return (
      <>
        <SearchScreen {...props} />
        <MovableCart />
      </>
    );
  }

  function IngredientByStoreScreenWithCart(props) {
    return (
      <>
        <IngredientByStoreScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function CategoriesScreenWithCart(props) {
    return (
      <>
        <CategoriesScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function StoresScreenWithCart(props) {
    return (
      <>
        <StoresScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function AllStoresInventoriesScreenWithCart(props) {
    return (
      <>
        <AllStoresInventoriesScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function StoreScreenWithCart(props) {
    return (
      <>
        <StoreScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function IngredientsScreenWithCart(props) {
    return (
      <>
        <IngredientsScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function IngredientScreenWithCart(props) {
    return (
      <>
        <IngredientScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function RecipesScreenWithCart(props) {
    return (
      <>
        <RecipesScreen {...props} />
        <MovableCart />
      </>
    );
  }
  function RecipeScreenWithCart(props) {
    return (
      <>
        <RecipeScreen {...props} />
        <MovableCart />
      </>
    );
  }
  

  
  

  

  const stackHeaderStyle = {
    headerStyle: {
      height:80, 
    }
  }


  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
          textAlign: "center",
          alignSelf: "center",
          flex: 1,
        },
      }}
      initialRouteName={user ? "Home" : "Onboarding"}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Search" component={SearchScreenWithCart} options={stackHeaderStyle}  />
      <Stack.Screen name="Home" component={HomeScreenWithCart} options={stackHeaderStyle} />
      <Stack.Screen name="IngredientByStore" component={IngredientByStoreScreenWithCart}  options={stackHeaderStyle}  />
      <Stack.Screen name="Categories" component={CategoriesScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Stores" component={StoresScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="AllStoresInventories" component={AllStoresInventoriesScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Store" component={StoreScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Ingredients" component={IngredientsScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Ingredient" component={IngredientScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Recipes" component={RecipesScreenWithCart}  options={stackHeaderStyle} />
      <Stack.Screen name="Recipe" component={RecipeScreenWithCart} options={stackHeaderStyle}  />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="OnboardingStoresScreen" component={OnboardingStoresScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DrawerStack({ user }) {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName="Main"
      drawerStyle={{
        width: 250,
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        <DrawerContainer navigation={navigation} />
      )}
    >
      <Drawer.Screen name="Main">
        {props => {
          const routeName = getFocusedRouteNameFromRoute(props.route) ?? 'Home';
          return (
            <>
              <MainNavigator {...props} user={user} />
             
            </>
          );
        }}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
function MovableCart({ currentScreen }) {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));

  const animateCart = () => {

    Animated.timing(scaleValue, {
      toValue: 2,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {

      navigation.navigate('Cart');

      scaleValue.setValue(1);
    });
  };

  if (currentScreen === 'Signup' || currentScreen === 'Onboarding' || currentScreen === 'Cart') {
    return null;
  }

  return (
    <MovableView style={styles.movableCart}>
      <TouchableOpacity onPress={animateCart}>
        <Animated.Image
          source={require('../../assets/icons/cart.png')}
          style={[styles.cartIcon, { transform: [{ scale: scaleValue }] }]}
        />
      </TouchableOpacity>
    </MovableView>
  );
}

export default function AppContainer({ user }) {

  return (
    <>
      <NavigationContainer>
        <DrawerStack user={user} />
      </NavigationContainer>
    </>
  );
}


console.disableYellowBox = true;
