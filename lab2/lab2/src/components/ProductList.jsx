import ProductCard from "./ProductCard";

// 👇 Добавьте onView в параметры компонента
export default function ProductList({ products, onAdd, onView }) {
  return (
    <div className="products">
      {products.map((p) => (
        <ProductCard 
          key={p.id} 
          product={p} 
          onAdd={onAdd}
          onView={onView} // 👈 Передаём onView в ProductCard!
        />
      ))}
    </div>
  );
}