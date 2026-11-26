import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [errors, setErrors] = useState([]);
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(
          json.details?.map((d) => d.mensaje) ?? [json.error ?? "Error al guardar"]
        );
        return;
      }
      onCreated(json.data);
      setForm({ name: "", price: "", image: "" });
    } catch {
      setErrors(["No se pudo conectar con el servidor."]);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Registrar producto</h2>
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
      <input name="price" type="number" step="0.01" placeholder="Precio" value={form.price} onChange={handleChange} />
      <input name="image" placeholder="URL de la imagen" value={form.image} onChange={handleChange} />
      {errors.map((m) => (
        <p key={m} className="error">{m}</p>
      ))}
      <button type="submit" disabled={sending}>
        {sending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}