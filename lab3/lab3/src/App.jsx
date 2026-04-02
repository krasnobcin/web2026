import { useReducer, useEffect } from "react";
import { reducer, initialState, actions } from "./store/reducer";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import CartSummary from "./components/CartSummary";
import "./App.css";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(actions.setLoading());

      try {
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();

        const mapped = data.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.thumbnail
        }));

        dispatch(actions.loadData(mapped));
      } catch (err) {
        dispatch(actions.loadError("Ошибка загрузки каталога"));
      }
    };

  fetchProducts();
}, []);

  useEffect(() => {
    if (state.search === "") {
      dispatch(actions.clearSearch());
      return;
    }

    const fetchSearch = async () => {
      dispatch(actions.setLoading());

      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${state.search}`
        );
        const data = await res.json();

        const mapped = data.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.thumbnail
        }));

        dispatch(actions.setFilteredProducts(mapped));
      } catch (err) {
        dispatch(actions.loadError("Ошибка поиска"));
      }
    };

  const delay = setTimeout(fetchSearch, 400); // debounce
  return () => clearTimeout(delay);
}, [state.search]);

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