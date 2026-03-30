# Bug Report

Fecha de revision: 2026-03-29

## Proyecto revisado

- App principal en `/Users/luisvivia/Desktop/VStudio/tocho-nuxt`
- App secundaria en `/Users/luisvivia/Desktop/VStudio/tocho-nuxt/tocho-nuxt-keycloak`

## Bugs confirmados y corregidos

### 1. Typecheck roto en el proxy `/api/t5/*`

- Archivo: `server/api/t5/[...path].ts`
- Sintoma: `nuxi typecheck` fallaba con `TS2321: Excessive stack depth comparing types`.
- Causa: el uso de `$fetch(url, ...)` dentro de una ruta catch-all de servidor disparaba la inferencia de rutas tipadas de Nuxt y reventaba el analisis de tipos.
- Impacto: el proyecto principal no podia pasar typecheck.
- Correccion: se reemplazo la llamada por `proxyRequest(...)` de `h3`, que ademas preserva mejor el comportamiento de proxy HTTP.

### 2. Configuracion de ESLint rota

- Archivos: `nuxt.config.ts` y `eslint.config.mjs`
- Sintoma: ESLint fallaba al arrancar con `Cannot find package '@nuxt/eslint-config'`.
- Causa: el archivo `eslint.config.mjs` importaba directamente `@nuxt/eslint-config/flat`, pero el proyecto usa el modulo `@nuxt/eslint`, que genera su propia configuracion dentro de `.nuxt/`.
- Impacto: no se podia ejecutar lint y eso ocultaba errores reales del proyecto.
- Correccion: se activo `@nuxt/eslint` en `nuxt.config.ts` y `eslint.config.mjs` ahora consume `./.nuxt/eslint.config.mjs`.

### 3. Admin de partidos del jueves cargaba equipos desde rutas inexistentes

- Archivo: `app/pages/jueves/admin/partidos.vue`
- Sintoma: la pantalla consultaba `/api/teams/list` y `/api/teams`, rutas que no existen en `server/api`.
- Causa: la vista estaba usando endpoints locales equivocados en lugar del proxy real `/api/t5/*`.
- Impacto: la lista de equipos del formulario podia quedar vacia y el autocompletado de local/visitante dejaba de funcionar, bloqueando la creacion de partidos.
- Correccion: se cambiaron las llamadas a `/api/t5/teams/list` y `/api/t5/teams`, que si existen y responden correctamente.

### 4. Acciones de crear, finalizar y borrar partidos del jueves estaban en modo placeholder

- Archivo: `app/pages/jueves/admin/partidos.vue`
- Sintoma: los botones mostraban mensajes de ejemplo y hacian `console.log`, pero no guardaban cambios reales.
- Causa: la UI estaba montada, pero las mutaciones al backend nunca se habian conectado.
- Impacto: el modulo de admin podia parecer funcional, pero no creaba partidos, no cerraba juegos con score final y no eliminaba registros.
- Correccion: se conectaron las acciones reales contra el backend via `/api/t5/*`, reutilizando autenticacion con Keycloak, refresco de la lista y mensajes de exito/error.

### 5. Ruta `ping` duplicada en dos ubicaciones

- Archivos: `server/api/ping.ts` y `app/server/api/ping.ts`
- Sintoma: existian dos handlers para la misma ruta `/api/ping`.
- Causa: quedo un archivo duplicado dentro de `app/server/api`, pero Nitro estaba resolviendo la version de `server/api`.
- Impacto: no rompia el runtime actual, pero hacia ambiguas las pruebas y podia inducir a editar el archivo equivocado.
- Correccion: se elimino la copia de `app/server/api/ping.ts` para dejar una sola fuente de verdad.

## Validaciones ejecutadas

### App principal

- `./node_modules/.bin/nuxt build`
- `./node_modules/.bin/nuxi typecheck`
- `./node_modules/.bin/eslint app server nuxt.config.ts --ext .ts,.vue`
- `curl http://127.0.0.1:4011/jueves/admin`
- `curl http://127.0.0.1:4011/api/t5/teams/list?leagueId=2`
- `curl http://127.0.0.1:4011/api/t5/teams?leagueId=2`

### App secundaria

- `../node_modules/.bin/nuxt build`
- `../node_modules/.bin/nuxi typecheck`

## Estado final esperado

- La app principal compila y pasa typecheck.
- La app secundaria compila y pasa typecheck.
- ESLint ya puede ejecutarse en la app principal, pero actualmente reporta deuda tecnica previa: 822 hallazgos (452 errores y 370 warnings), dominados por `no-explicit-any`, `no-empty` y reglas de formato Vue.

## Pendientes detectados por lint

- Los hallazgos actuales de ESLint no estaban visibles antes porque la configuracion estaba rota.
- La mayoria no son fallos funcionales confirmados sino deuda de tipado y estilo repartida por muchas paginas grandes.
- Conviene tratarlos en una tarea separada para no mezclar refactor de tipado masivo con fixes funcionales del proyecto.
