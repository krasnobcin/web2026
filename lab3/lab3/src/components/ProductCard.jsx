export default function ProductCard({ product, onAdd, onView }) {
  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAdd(product)}>Добавить</button>
      <button onClick={() => onView(product)}>Просмотр</button> {/* новая кнопка */}
    </div>
  );
}