import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import TouchableRecipeCard from '../RecipeCard/TouchableRecipeCard'
import { styles } from '../../AppStyles'

export default function RecipeList(props) {
  const onPress = props.onPress
  const data = props.data
  const store = props.store
  const filter = props.filter

  // const renderRecipes = (props.renderRecipes ? props.renderRecipes :
  //   ({ item }) => {
  //     const ingredients = item.ingredients.join(", ");
  //     const discountPrice = (item.price - item.discount).toFixed(2);
  //     return <TouchableRecipeCard store={store} recipe={item} onPress={onPress} />
  //   })

  function recipeMatchesFilter(recipe, ingredientFilter) {
    const res = (ingredientFilter.every(
      (filterIngredient) => (recipe.ingredients.some(
        (recipeIngredient) => (recipeIngredient === filterIngredient)))))
    return res
  }

  const renderRecipes = ({ item }) => {
    if (filter && filter.length > 0 && !recipeMatchesFilter(item, filter)) return

    return <TouchableRecipeCard store={store} recipe={item} onPress={onPress}/>
  };

  return (
    <View>
      <FlatList
        horizontal
        data={data}
        renderItem={(item) => renderRecipes(item)}
        keyExtractor={(item) => {
          return item.id
        }}
      />
    </View>
  )
}