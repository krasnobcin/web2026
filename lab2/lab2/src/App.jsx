import { useReducer, useEffect } from "react";
import { reducer, initialState, actions } from "./store/reducer";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import CartSummary from "./components/CartSummary";
import "./App.css";

// Пример данных
import { products as productsData } from "./data/products";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Имитируем загрузку каталога при старте
  useEffect(() => {
    dispatch({ type: "LOAD_DATA_START" }); 
    const timer = setTimeout(() => {
      try {
        dispatch(actions.loadData(productsData));
      } catch (err) {
        dispatch(actions.loadError("Ошибка загрузки каталога"));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Имитация загрузки при поиске
  useEffect(() => {
    if (state.search === "") {
      dispatch(actions.clearSearch());
      return;
    }
    dispatch(actions.setLoading());
    const timer = setTimeout(() => {
      const filtered = state.products.filter((p) =>
        p.name.toLowerCase().includes(state.search.toLowerCase())
      );
      dispatch(actions.setFilteredProducts(filtered));
    }, 500);
    return () => clearTimeout(timer);
  }, [state.search, state.products]);

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Выбираем один товар для просмотра
  const productsToShow =
    state.viewState === "CARD_VIEW" && state.selectedProduct
      ? [state.selectedProduct]
      : state.filteredProducts;

  return (
    <>
      <h1>
        {state.viewState === "LOADING"
          ? "Загрузка..."
          : state.viewState === "ERROR"
          ? "Ошибка загрузки"
          : state.viewState === "EMPTY_SEARCH"
          ? "Ничего не найдено"
          : state.viewState === "CARD_VIEW"
          ? state.selectedProduct?.name
          : "Каталог товаров"}
      </h1>

      {state.viewState === "LOADING" && (
        <p className="loading-text">Подождите, данные загружаются...</p>
      )}

      {state.viewState !== "LOADING" && state.viewState !== "ERROR" && (
        <>
          <SearchBar
            value={state.search}
            onChange={(value) => dispatch(actions.searchInput(value))}
          />
          <button onClick={() => dispatch(actions.search())}>Поиск</button>
          <button onClick={() => dispatch(actions.clearSearch())}>Очистить</button>
        </>
      )}

      {state.viewState === "ERROR" && <p>{state.error}</p>}

      {productsToShow.length > 0 && (
        <ProductList
          products={productsToShow}
          onAdd={(product) => dispatch(actions.addToCart(product))}
          onView={(product) => dispatch(actions.selectItem(product))} // новая пропс-функция
        />
      )}

      {state.viewState === "EMPTY_SEARCH" && (
        <h3 className="loading-text">По вашему запросу ничего не найдено.</h3>
      )}

      <div className="cart">
        <h3>Корзина</h3>
        {state.cartState === "EMPTY" ? (
          <p>Пусто</p>
        ) : (
          state.cart.map((item) => (
            <div key={item.id}>
              <p>
                {item.name} x {item.quantity}
              </p>
              <button onClick={() => dispatch(actions.removeFromCart(item.id))}>
                Удалить
              </button>
            </div>
          ))
        )}
        {state.cartState === "WITH_ITEMS" && (
          <button onClick={() => dispatch(actions.clearCart())}>Очистить корзину</button>
        )}
        <CartSummary total={total} count={totalCount} />
      </div>
    </>
  );
}