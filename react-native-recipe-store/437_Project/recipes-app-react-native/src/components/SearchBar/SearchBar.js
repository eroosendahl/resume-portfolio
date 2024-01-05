import React from "react";
import { View, Image, Pressable, } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { searchStyles as styles } from '../../AppStyles';

export default function SearchBar(props) {
  const handleSearch = props.handleSearch
  var placeholder = props.placeholder
  const searchedValue = props.searchedValue

  if (!placeholder) placeholder = "noplaceholder"

  function render() {
    return (
      <View style={styles.searchContainer}>
        <Image style={styles.searchIcon} source={require("../../../assets/icons/search.png")} />
        <TextInput
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={searchedValue}
          clearButtonMode='never'
          placeholder={placeholder}
          textAlign="left"
        />
        <Pressable style={styles.closeIcon} onPress={() => handleSearch("")}>
          <Image style={styles.closeIcon} source={require("../../../assets/icons/close.png")} />
        </Pressable>
      </View>
    )
  }

  return render()
}