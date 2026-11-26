import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const toForm = (p) => ({ name: p.name, price: String(p.price), image: p.image });

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // último dato confirmado
  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | failed
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (res.status === 404) return setStatus("notfound");
        if (!res.ok) throw new Error();
        const json = await res.json();
        setProduct(json.data);
        setForm(toForm(json.data));
        setStatus("ready");
      } catch {
        setStatus("failed");
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaved(false);
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.details?.map((d) => d.mensaje) ?? [json.error ?? "Error al guardar"]);
        return; // product NO cambia: se conserva el último dato confirmado
      }
      setProduct(json.data);
      setForm(toForm(json.data));
      setSaved(true);
    } catch {
      setErrors(["No se pudo conectar con el servidor."]);
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") return <main className="container"><p>Cargando...</p></main>;
  if (status === "notfound")
    return (
      <main className="container">
        <p className="error">Producto no encontrado.</p>
        <Link to="/">Volver al catálogo</Link>
      </main>
    );
  if (status === "failed")
    return (
      <main className="container">
        <p className="error">No se pudo cargar el producto.</p>
        <Link to="/">Volver al catálogo</Link>
      </main>
    );

  return (
    <main className="container">
      <Link to="/">← Volver al catálogo</Link>

      <article className="card">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p className="price">${Number(product.price).toFixed(2)}</p>
      </article>

      <form onSubmit={handleSubmit} className="form">
        <h2>Editar producto</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Precio" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="URL de la imagen" value={form.image} onChange={handleChange} />
        {errors.map((m) => <p key={m} className="error">{m}</p>)}
        {saved && <p className="ok">Producto actualizado.</p>}
        <button type="submit" disabled={sending}>
          {sending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}