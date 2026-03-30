import {
  defineEventHandler,
  getHeader,
  getProxyRequestHeaders,
  getQuery,
  getRouterParam,
  proxyRequest,
} from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const raw = getRouterParam(event, "path");
  const path = Array.isArray(raw) ? raw.join("/") : raw || "";

  // ✅ Normaliza apiBase:
  // - si viene "https://tocho5-api.tochero5.mx" => lo convertimos a ".../api"
  // - si ya viene ".../api" => lo dejamos igual
  let base = String(config.public.apiBase || "").replace(/\/+$/, "");
  if (!base.endsWith("/api")) base = `${base}/api`;

  const target = new URL(path, `${base}/`);
  const query = getQuery(event);
  const headers: Record<string, string> = {
    ...getProxyRequestHeaders(event),
    accept: "application/json",
  };

  const auth = getHeader(event, "authorization");
  if (auth) headers.authorization = auth;

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) target.searchParams.append(key, String(item));
      }
      continue;
    }

    if (value != null) target.searchParams.append(key, String(value));
  }

  return await proxyRequest(event, target.toString(), {
    headers,
    fetchOptions: {
      ignoreResponseError: true,
    },
  });
});
