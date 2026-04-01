export default function CartSummary({ total, count }) {
  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
      <p>Товаров: {count}</p>
      <h4>Итого: ${total}</h4>
    </div>
  );
}