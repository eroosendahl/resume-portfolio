import { StyleSheet, Dimensions } from "react-native";

// screen sizing
const { width, height } = Dimensions.get("window");
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 250;

const IMAGE_MARGIN = 20;

// 2 photos per width
export const mainStyles = StyleSheet.create({
  storeContainer: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd", // Border color
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
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight:0,
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
    width: "90%"
  },  //https://jorgecolonconsulting.com/react-native-text-wrap/
  itemHeaderTextAlt: {
    fontSize: 24,
    fontWeight: "bold", // Make the text bold
    color: "#333", // Change the text color
    textAlign: "left",
    flex: 1,
    width: 1,
    marginTop: 20,
    marginLeft: 10
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
  },
  categoryHeader: {
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
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    height: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    borderRadius: 10,
    marginRight: IMAGE_MARGIN,
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
    padding: 20,
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
    fontSize: 18,
    fontWeight: "bold",
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
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - 30,
    height: RECIPE_ITEM_HEIGHT - 30,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    color: "#555",
  },
  itemDiscount: {
    fontSize: 16,
    marginBottom: 0,
    paddingBottom: 0
  },
  itemIngredientsText: {
    fontSize: 12,
    flex: 1,
    width: 1,
    paddingBottom: 20
  },
  itemIngredientsBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1
  },
  debugBorder: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 15,
  }
});