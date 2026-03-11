import { defineEventHandler, getQuery, getRouterParam, getHeader, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const raw = getRouterParam(event, "path");
  const path = Array.isArray(raw) ? raw.join("/") : raw || "";

  // ✅ Normaliza apiBase:
  // - si viene "https://tocho5-api.tochero5.mx" => lo convertimos a ".../api"
  // - si ya viene ".../api" => lo dejamos igual
  let base = String(config.public.apiBase || "").replace(/\/+$/, "");
  if (!base.endsWith("/api")) base = `${base}/api`;

  const url = `${base}/${path}`;

  const query = getQuery(event);
  const method = event.method || "GET";
  const headers: Record<string, string> = { accept: "application/json" };

  const auth = getHeader(event, "authorization");
  if (auth) headers.authorization = auth;

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);
  const body = hasBody ? await readBody(event) : undefined;

  return await $fetch(url, { method, query, body, headers });
});
