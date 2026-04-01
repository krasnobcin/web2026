export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Поиск товаров..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        display: "block",
        margin: "20px auto",
        padding: "10px",
        width: "300px"
      }}
    />
  );
}