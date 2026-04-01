import { useState } from "react";
import CartSummary from "./components/CartSummary";
import { products } from "./data/products";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity,0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <h1>Каталог товаров</h1>

      <SearchBar value={search} onChange={setSearch} />

      <div className="container">
        <ProductList products={filteredProducts} onAdd={addToCart} />

        <div className="cart">
          <h3>Корзина</h3>

          {cart.length === 0 ? (
            <p>Пусто</p>
          ) : (
            cart.map((item) => (
              <div key={item.id}>
                <p>
                  {item.name} x {item.quantity}
                </p>
                <button onClick={() => removeFromCart(item.id)}>
                  Удалить
                </button>
              </div>
            ))
          )}

          <CartSummary total={total} count={totalCount} />
        </div>
      </div>
    </>
  );
}