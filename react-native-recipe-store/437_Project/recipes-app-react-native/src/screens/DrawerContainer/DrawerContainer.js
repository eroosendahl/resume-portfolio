import React, { useState, useEffect } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { drawerStyles as styles } from '../../AppStyles';

import MenuButton from "../../components/MenuButton/MenuButton";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { CommonActions } from '@react-navigation/native';

// ...

export default function DrawerContainer(props) {
  const { navigation } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe; // Make sure we unbind the listener when the component unmounts.
  }, [auth]);

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="RETURN HOME"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        />
        {/* <MenuButton
          title="BROWSE CATEGORIES"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("Categories");
            navigation.closeDrawer();
          }}
        /> */}
        <MenuButton
          title="SEARCH"
          source={require("../../../assets/icons/search.png")}
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title={"Logout"}

          onPress={() => {
            signOut(auth).then(() => {
            }).catch((error) => {
              console.error("Error signing out:", error);
            });
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'OnboardingScreen' }],
              })
            );
          }}

        />
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
