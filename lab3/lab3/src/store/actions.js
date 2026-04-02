export const actions = {
  search: (value) => ({ type: "SEARCH", payload: value }),
  addToCart: (product) => ({ type: "ADD_TO_CART", payload: product }),
  removeFromCart: (id) => ({ type: "REMOVE_FROM_CART", payload: id }),
  clearCart: () => ({ type: "CLEAR_CART" })
};