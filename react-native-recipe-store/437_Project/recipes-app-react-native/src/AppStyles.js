import { StyleSheet, Dimensions } from "react-native";

// screen sizing
const { width, height } = Dimensions.get("window");
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 250;

const IMAGE_MARGIN = 20;

const ITEM_CONTAINER_HEIGHT = 400

const ITEM_CARD_ALT_HEIGHT = 200
const ITEM_CARD_ALT_WIDTH = 200

const pleasantGreen = '#aafca9'
const borderGreen = '#1e8449'
const functionalGreen = '#27ae60'

// our main styles
export const styles = StyleSheet.create({
  searchResultContainer: {
    height: 50,
    borderStyle: "solid",
    borderColor: "green",
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    padding: 10,
    margin: 10
  },
  modalContainer: {
    height: "100%",
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: "90%",
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnIcon: {
    width: 14,
    height: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    width: 250,
    justifyContent: "space-around"
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'grey'
  },
  searchInput: {
    backgroundColor: "#EDEDED",
    color: "black",
    width: 180,
    height: 50,
  },
  sectionListHeader: {
    margin: 5,
    marginTop: 0,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    fontSize: 30,
    fontWeight: "bold",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 0,
    textAlign: "center"
  },
  storeContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "green", // Border color
    borderStyle: 'solid',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemContainerAlt: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd", // Border color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1
  },
  imageAlt: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 0,
    padding: 0
  },
  itemCard: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 0,
    marginBottom: 10,
    marginLeft: 20,
    alignSelf: 'flex-start',
    width: "90%",
  },
  ingredientFilterTagBox: {
    height: 20,
  },
  ingredientFilterTag: {
    textAlign: "center",
    backgroundColor: "#dcdcdc",
    borderColor: "green",
    borderWidth: 2,
    borderTopEndRadius: 15
  },
  ingredientFilterTagSelected: {
    textAlign: "center",
    backgroundColor: "green",
    color: "white",
    borderColor: "green",
    borderWidth: 2,
    borderTopEndRadius: 15
  },
  ingredientFilterTagText: {
    fontWeight: "bold"
  },
  storeIngredientAndFilterBox: {
    height: 'auto',

  },
  itemCardAlt: {
    textAlign:"center",
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 2,
    marginBottom: 10,
    width: ITEM_CARD_ALT_WIDTH,
    height: ITEM_CARD_ALT_HEIGHT,
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },  //https://jorgecolonconsulting.com/react-native-text-wrap/
  itemHeaderTextAlt: {
    fontSize: 24,
    fontWeight: "bold", // Make the text bold
    color: "black", // Change the text color
    textAlign: "left",
    flex: 1,
    width: 1,
    marginTop: 20,
    marginLeft: 10
  },
  itemImageAlt: {
    width: 120,
    height: 120,
    borderRadius: 10,
    margin: 0,
    marginRight: 5,
    padding: 0
  },
  // Additional styles for store header and category
  storeHeaderText: {
    fontSize: 24,
    fontWeight: "bold", // Make the text bold
    color: "#333", // Change the text color
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  storeHeaderBox: {
    width: "90%",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 8,
    marginBottom: 20,
    marginLeft: 20,
    alignSelf: 'flex-start'
  },
  // Additional styles for category
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    minHeight:100
  },
  categoryHeader: {
    left:10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444444",
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginTop: 5,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 150
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    borderStyle: 'solid',
    borderColor: 'green',
    borderWidth: 2
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    height: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    borderRadius: 10,
    marginRight: IMAGE_MARGIN,
  },
  itemImageAlt: {
    width: 120,
    height: 120,
    borderRadius: 10,
    margin: 0,
    marginRight: 5,
    padding: 0
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  storeContainer: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  storeHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryHeader: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainerSmall: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    height: "auto"
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    minHeight:326  
  },
  itemContainerLong: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    height: ITEM_CONTAINER_HEIGHT + 30
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - 30,
    height: RECIPE_ITEM_HEIGHT - 30,
    borderRadius: 10,
    marginRight: 10,
  },
  headerButtonContainer: {
    borderRadius: 20,
    underlayColor: "transparent",
    padding: 0
  },
  trashButtonContainer: {
    borderRadius: 20,
    underlayColor: "transparent",
    padding: 0,
    right:30
  },
  headerButtonImage: {
    justifyContent: 'center',
    width: 25,
    height: 25,
    margin: 6
  },
  trashButtonImage: {
    justifyContent: 'center',
    width: 30,
    height: 30,
    margin: 6
  },
  itemDetails: {
    flex: 1,
  },
  itemDetailsAlt: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: "center"
  },
  itemDetailsHome: {
    flex: 1,
    padding: 0,
    margin: 0,
    height: 30
  },
  homeSectionHeaderText: {
    marginTop: 20,
    width: "98%",
    textAlign: "center",
    padding: 8,
    marginBottom: 20,
    marginLeft: 20,
    alignSelf: 'flex-start',
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Gill Sans",
    marginLeft: 0,
    paddingLeft: 0
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    borderColor: 'red',
    borderStyle: 'solid'
  },
  homeSubsectionHeaderText: {
    padding: 8,
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemName: {
    flex: 1,
    width: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemNameAlt: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemNameAltSmall: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 11,
    color: "#555",
  },
  itemDiscount: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 0,
    paddingBottom: 0
  },
  itemDiscountPleasant: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 0,
    paddingBottom: 0,
    color:pleasantGreen
  },
  homeBigSeparator: {
    minHeight: 20,
    backgroundColor: "green",
  },
  
  homeBigSeparatorPleasant: {
    minHeight: 10,
    backgroundColor: pleasantGreen,
  },
  homeAltSeparator: {
    minHeight: 10,
  },
  itemIngredientsText: {
    fontSize: 13,
    flex: 1,
    width: 1,
  },
  wrappingTextBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1,
    marginBottom: 0,
  },
  itemIngredientsBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1,
    borderColor: functionalGreen,
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginVertical: 3
  },
  debugBorder: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 15,
  },
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
  },
  categoriesPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  },
  cartIcon: {
    width: 50,
    height: 50,

  },
  movableCart: {

  },
  screenTitleText: {
    marginTop: 0,
    paddingTop: 0,
    textAlign: 'center',
    bottom: 7
  },
  greenHighlight: {
    padding: 10,
    backgroundColor: '#aafca9',
    borderRadius: 8,
    padding: 5,
    textAlign: "center"
  },
});

export const drawerStyles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20
  }
});

export const searchStyles = StyleSheet.create({
  screenTitleText: {
    marginTop: 0,
    paddingTop: 0,
    textAlign: 'center',
    bottom: 7
  },
  container: styles.container,
  photo: styles.photo,
  title: styles.title,
  category: styles.category,
  btnIcon: {
    height: 14,
    width: 14,
  },
  searchContainer: {
    padding: 0,
    margin: 0,
    flexDirection: "row",
    alignItems: "left",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    width: 250,
    justifyContent: "space-between",
    paddingLeft: 10,
    right: 14,
    bottom: 6
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: 'grey',
    padding: 0,
    margin: 0,
    alignSelf: "center"
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: 'grey',
    padding: 0,
    margin: 0,
    alignSelf: "center",
    justifyContent: "flex-end",
    marginRight: 5
  },
  searchInput: {
    backgroundColor: "#EDEDED",
    color: "black",
    width: 180,
    height: 50,
    padding: 0,
    margin: 0,
    textAlign: 'left',
    paddingLeft: 3
  }
})

export const GPTpopupStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    minHeight: '90%',
    maxHeight: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#27ae60',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#27ae60',
    marginLeft: 10
  },
  smallerHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#27ae60',
  },
  smallerHeaderTextBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  scrollView: {
    width: '100%',
  },
  itemCardAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  itemDetailsAlt: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  itemImageAlt: {
    width: 180,
    height: 180,
    borderRadius: 5,
  },
  itemNameAlt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 11,
    color: "#555",
    marginRight:25
  },
  recipePriceBox: {
    flexDirection: 'column',
    width: '65%',
    alignItems:'flex-end'
  },
  itemDiscount: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 0,
    paddingBottom: 0,
    color:'#27ae60',
    marginRight:25
  },
  homePSButton: {
    backgroundColor: pleasantGreen,
    color: pleasantGreen,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: borderGreen, // Darker green for border
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
    fontSize: 16,
    marginRight: 10,
    maxWidth:160,
    maxHeight:40,
    textAlign: "center",
    alignSelf: 'center',
    marginBottom: 10
  },
  addToCartBtn: {
    backgroundColor: '#aafca9',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: borderGreen, // Darker green for border
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
    fontSize: 16,
    marginRight: 10,
    maxWidth:130
  },
  ingredientControlsButton: {
    backgroundColor: '#aafca9',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: borderGreen, // Darker green for border
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
    fontSize: 16,
    marginRight: 10,
    maxWidth:130,
    marginTop: 5
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: pleasantGreen,
    borderColor: borderGreen,
    borderStyle: 'solid',
    borderWidth: 2,
    color: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  itemIngredientsBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginBottom: 3,
    maxWidth: 100,
    maxHeight: 100
  },
  itemIngredientsText: {
    fontSize: 13,
    flex: 1,
    width: 1,
  },
})