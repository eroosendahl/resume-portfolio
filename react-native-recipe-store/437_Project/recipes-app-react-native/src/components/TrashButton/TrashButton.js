import React, { useState } from "react";
import { TouchableHighlight, Image, Text, View } from "react-native";
import PropTypes from "prop-types";
import { styles } from '../../AppStyles'

//https://stackoverflow.com/questions/34625829/change-button-style-on-press-in-react-native
export default function TrashButton(props) {
  const { title, onPress } = props;
  const [isPressed, setIsPressed] = useState(false)

  const toggleIsPressed = () => {
    setIsPressed(!isPressed)
  }

  return (
    <TouchableHighlight 
    underlayColor={'#25CF7A'} 
    title={title} 
    style={styles.trashButtonContainer} 
    onPress={onPress}
    onHideUnderlay={toggleIsPressed}
    onShowUnderlay={toggleIsPressed}>
      <View>
        {isPressed ?
          <Image style={styles.trashButtonImage} source={require("../../../assets/icons/trashClosed.png")} />
          : <Image style={styles.trashButtonImage} source={require("../../../assets/icons/trashOpen.png")} />}

      </View>
    </TouchableHighlight>
  );
}

TrashButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
