import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ProductForm from "./ProductForm.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setProducts(json.data);
      } catch (err) {
        setError("No se pudo cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <main className="container">
      <h1>Catálogo de productos</h1>
      <ProductForm onCreated={(p) => setProducts((prev) => [p, ...prev])} />

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty">Aún no hay productos en el catálogo.</p>
      )}

      <div className="grid">
        {products.map((p) => (
          <article key={p.id} className="card">
            <img src={p.image} alt={p.name} />
            <h2>
              <Link to={`/products/${p.id}`}>{p.name}</Link>
            </h2>
            <p className="price">${Number(p.price).toFixed(2)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}