import {
  defineEventHandler,
  getQuery,
  getRouterParam,
  getHeader,
  readBody,
} from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // /api/t5/<path...>  ->  <path...>
  const raw = getRouterParam(event, "path");
  const path = Array.isArray(raw) ? raw.join("/") : raw || "";

  // OJO: tu apiBase YA incluye /api
  const base = String(config.public.apiBase || "").replace(/\/+$/, "");
  const url = `${base}/${path}`;

  const query = getQuery(event);
  const method = event.method || "GET";

  const headers: Record<string, string> = { accept: "application/json" };

  // Pasa Authorization si existe (por si luego proteges endpoints)
  const auth = getHeader(event, "authorization");
  if (auth) headers.authorization = auth;

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);
  const body = hasBody ? await readBody(event) : undefined;

  return await $fetch(url, { method, query, body, headers });
});