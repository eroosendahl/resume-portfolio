import React from "react";
import { TouchableHighlight, Image, Text, View } from "react-native";
import PropTypes from "prop-types";
import { styles } from '../../AppStyles'

export default function HomeButton(props) {
  const { title, onPress, source } = props;

  return (
    <TouchableHighlight underlayColor={'#25CF7A'} title={title} style={styles.headerButtonContainer} onPress={onPress}>
      <View>
        <Image style={styles.headerButtonImage} source={require("../../../assets/icons/home.png")} />
      </View>
    </TouchableHighlight>
  );
}

HomeButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
