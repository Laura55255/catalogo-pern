import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import ProductForm from "./ProductForm.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null); // producto en confirmación
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

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

  const handleDelete = async (id) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
      // 404: ya no existe en el servidor, también se retira de la lista
      if (!res.ok && res.status !== 404) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmingId(null);
    } catch {
      setDeleteError("No se pudo eliminar el producto. Intenta de nuevo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="container">
      <h1>Catálogo de productos</h1>
      <ProductForm onCreated={(p) => setProducts((prev) => [p, ...prev])} />

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty">Aún no hay productos en el catálogo.</p>
      )}

      {deleteError && <p className="error">{deleteError}</p>}

      <div className="grid">
        {products.map((p) => (
          <article key={p.id} className="card">
            <img src={p.image} alt={p.name} />
            <h2>
              <Link to={`/products/${p.id}`}>{p.name}</Link>
            </h2>
            <p className="price">${Number(p.price).toFixed(2)}</p>
            {confirmingId === p.id ? (
              <div className="confirm" role="alertdialog" aria-label="Confirmar eliminación">
                <p>¿Eliminar "{p.name}"?</p>
                <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}>
                  {deletingId === p.id ? "Eliminando..." : "Confirmar"}
                </button>
                <button onClick={() => setConfirmingId(null)} disabled={deletingId === p.id}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                className="btn-delete"
                onClick={() => {
                  setDeleteError(null);
                  setConfirmingId(p.id);
                }}
              >
                Eliminar
              </button>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}