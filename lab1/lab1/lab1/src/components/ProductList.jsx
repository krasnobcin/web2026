import ProductCard from "./ProductCard";

export default function ProductList({ products, onAdd }) {
  return (
    <div className="products">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}