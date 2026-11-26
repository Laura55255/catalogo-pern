import { z } from "zod";

// DTO de entrada: name, price e image
export const productSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  price: z.coerce.number().positive("El precio debe ser un número mayor que 0"),
  image: z.string().trim().url("La imagen debe ser una URL válida"),
});