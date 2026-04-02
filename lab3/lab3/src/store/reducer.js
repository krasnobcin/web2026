// store/reducer.js

export const initialState = {
  viewState: "LOADING",      // LOADING | LIST | EMPTY_SEARCH | ERROR | CARD_VIEW
  search: "",
  products: [],              // Все загруженные товары
  filteredProducts: [],      // Отфильтрованные товары для отображения
  selectedProduct: null,
  error: null,
  cart: [],
  cartState: "EMPTY"         // EMPTY | WITH_ITEMS
};

export const actions = {
  loadData: (products) => ({ type: "LOAD_DATA", payload: products }),
  searchInput: (text) => ({ type: "SEARCH_INPUT", payload: text }),
  search: () => ({ type: "SEARCH" }),
  clearSearch: () => ({ type: "CLEAR_SEARCH" }),
  selectItem: (product) => ({ type: "SELECT_ITEM", payload: product }),
  loadError: (error) => ({ type: "LOAD_ERROR", payload: error }),
  addToCart: (product) => ({ type: "ADD_TO_CART", payload: product }),
  removeFromCart: (id) => ({ type: "REMOVE_FROM_CART", payload: id }),
  clearCart: () => ({ type: "CLEAR_CART" }),
  
  // 👇 Новые действия для имитации загрузки
  setLoading: () => ({ type: "SET_LOADING" }),
  setFilteredProducts: (products) => ({ type: "SET_FILTERED_PRODUCTS", payload: products }),
  setViewState: (viewState) => ({ type: "SET_VIEW_STATE", payload: viewState }),
};

export function reducer(state, action) {
  switch (action.type) {
    // === Загрузка данных ===
    case "LOAD_DATA":
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
        viewState: action.payload.length ? "LIST" : "EMPTY_SEARCH",
        error: null
      };

    case "LOAD_ERROR":
      return {
        ...state,
        error: action.payload,
        viewState: "ERROR"
      };

    // === Поиск и фильтрация ===
    case "SEARCH_INPUT":
      return {
        ...state,
        search: action.payload
        // viewState не меняем — пользователь ещё вводит текст
      };

    case "SET_LOADING":
      return {
        ...state,
        viewState: "LOADING"
      };

    case "SET_FILTERED_PRODUCTS":
      return {
        ...state,
        filteredProducts: action.payload,
        viewState: action.payload.length ? "LIST" : "EMPTY_SEARCH"
      };

    case "SEARCH":
      // Синхронная фильтрация (если не нужна имитация загрузки)
      const filtered = state.products.filter((p) =>
        p.name.toLowerCase().includes(state.search.toLowerCase())
      );
      return {
        ...state,
        filteredProducts: filtered,
        viewState: filtered.length ? "LIST" : "EMPTY_SEARCH"
      };

    case "CLEAR_SEARCH":
      return {
        ...state,
        search: "",
        filteredProducts: state.products,
        viewState: state.products.length ? "LIST" : "EMPTY_SEARCH"
      };

    // === Просмотр товара ===
    case "SELECT_ITEM":
      return {
        ...state,
        selectedProduct: action.payload,
        viewState: action.payload ? "CARD_VIEW" : "LIST"
      };

    case "SET_VIEW_STATE":
      // Универсальное действие для смены viewState (для имитации загрузки)
      return {
        ...state,
        viewState: action.payload
      };

    // === Корзина ===
    case "ADD_TO_CART":
      const existing = state.cart.find((item) => item.id === action.payload.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        cart: newCart,
        cartState: newCart.length ? "WITH_ITEMS" : "EMPTY"
      };

    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter((item) => item.id !== action.payload);
      return {
        ...state,
        cart: filteredCart,
        cartState: filteredCart.length ? "WITH_ITEMS" : "EMPTY"
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        cartState: "EMPTY"
      };

    // === По умолчанию ===
    default:
      return state;
  }
}