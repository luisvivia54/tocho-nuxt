import { createError, defineEventHandler, getQuery, setResponseHeader } from "h3";

// Proxy de fotos de jugadores para el PDF de CURP (domingo admin).
// media.tochero5.mx no envía cabeceras CORS, así que el navegador no puede
// leer los píxeles para incrustarlos en el PDF; aquí se sirven desde el mismo
// origen. Solo se permite ese host para no abrir un proxy genérico.
const ALLOWED_HOST = "media.tochero5.mx";

export default defineEventHandler(async (event) => {
  const raw = String(getQuery(event).url || "");

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "URL inválida" });
  }

  if (target.protocol !== "https:" || target.hostname !== ALLOWED_HOST) {
    throw createError({ statusCode: 400, statusMessage: "Host no permitido" });
  }

  const res = await fetch(target.toString()).catch(() => null);
  const contentType = res?.headers.get("content-type") || "";
  if (!res || !res.ok || !contentType.startsWith("image/")) {
    throw createError({ statusCode: 404, statusMessage: "Foto no disponible" });
  }

  setResponseHeader(event, "content-type", contentType);
  setResponseHeader(event, "cache-control", "private, max-age=3600");
  return Buffer.from(await res.arrayBuffer());
});
