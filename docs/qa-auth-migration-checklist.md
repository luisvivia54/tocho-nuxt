# QA Checklist: Auth Header Migration and Roster Validation

## Objetivo

Validar que las requests protegidas del frontend sigan enviando `Authorization: Bearer <jwt>` después de la migración al helper compartido `useAuthedFetch()`, y que los flujos nuevos de validación de roster bloqueen envíos incompletos antes de pegarle al backend.

## Alcance de lo que se cambió

- `app/pages/admin/partidos.vue`
- `app/composables/useAuthedFetch.ts`
- `app/composables/useJuevesTeamEditor.ts`
- `app/pages/jueves/admin/partidos.vue`
- `app/pages/jueves/mi-equipo.vue`
- `app/composables/useTeamEditor.ts`

## Preparación antes de probar

1. Iniciar sesión con un usuario que tenga permisos suficientes para los flujos de admin/capitán.
2. Abrir DevTools en la pestaña `Network`.
3. En cada request protegida revisar:
   - que exista header `Authorization: Bearer ...`
   - que en multipart no exista un `Content-Type: multipart/form-data` seteado manualmente por el frontend
   - que en JSON el request body llegue como JSON
4. Si una request falla, revisar el response JSON y anotar:
   - `code`
   - `message`
   - `traceId`

## Casos críticos a validar

### 1. Admin partidos domingo

Archivo relacionado: `app/pages/admin/partidos.vue`

Probar:

1. Crear partido.
2. Editar partido.
3. Borrar partido programado.
4. Borrar o revertir partido final.
5. Editar score final.
6. Guardar player stats.
7. Finalizar partido.

Requests esperadas:

- `POST https://tocho5-api.tochero5.mx/api/games?leagueId=1`
- `POST https://tocho5-api.tochero5.mx/api/partido/update`
- `DELETE https://tocho5-api.tochero5.mx/api/games/:id`
- `DELETE https://tocho5-api.tochero5.mx/api/admin/games/:id`
- `PATCH https://tocho5-api.tochero5.mx/api/admin/games/:id/score`
- `PUT https://tocho5-api.tochero5.mx/api/games/:id/player-stats`

Esperado:

- Todas con `Authorization: Bearer ...`
- Sin `401 UNAUTHENTICATED`
- Mensajes de UI coherentes si el backend rechaza algo

### 2. Admin partidos jueves

Archivo relacionado: `app/pages/jueves/admin/partidos.vue`

Probar:

1. Crear partido.
2. Borrar partido programado.
3. Revertir partido final.
4. Finalizar partido.

Requests esperadas:

- `POST /api/t5/games`
- `DELETE /api/t5/games/:id`
- `DELETE /api/t5/admin/games/:id`
- `POST /api/t5/partido/update`

Esperado:

- Todas con `Authorization: Bearer ...`
- El proxy `/api/t5/*` debe reenviar ese header intacto
- No debe depender ya de `authHeaders()` manual en esa vista

### 3. Mi equipo jueves

Archivo relacionado: `app/pages/jueves/mi-equipo.vue`

Probar:

1. Cargar equipos del capitán.
2. Abrir edición de equipo existente.
3. Crear equipo nuevo.
4. Editar equipo existente.
5. Subir logo.
6. Agregar jugadores al crear equipo.
7. Hacer soft delete del equipo.

Requests esperadas:

- `GET ${API_BASE}/teams/mine` o alguno de sus fallbacks protegidos
- `GET ${API_BASE}/teams/:id`
- `POST ${API_BASE}/teams/mine`
- `PUT/PATCH ${API_BASE}/teams/:id`
- `POST ${API_BASE}/assets/upload`
- `POST ${API_BASE}/teams/:id/players`
- `PATCH ${API_BASE}/teams/:id/active` o fallback `PATCH ${API_BASE}/teams/:id`

Esperado:

- Las requests protegidas llevan `Authorization: Bearer ...`
- `POST` y `PATCH` JSON con `Content-Type: application/json`
- `POST` multipart sin forzar manualmente `Content-Type`
- Si falla el alta de jugador, el submit no debe tragarse el error

Validación funcional adicional:

1. Intentar guardar un jugador con nombre pero sin CURP.
2. Intentar guardar un jugador con CURP pero sin foto.
3. Intentar guardar un jugador con foto pero sin nombre.

Esperado:

- El frontend no debe mandar request.
- Debe aparecer error de validación en UI.

### 4. Editor general de equipo y roster

Archivo relacionado: `app/composables/useTeamEditor.ts`

Probar en las vistas que consumen este composable:

1. Guardar datos del equipo.
2. Subir logo.
3. Eliminar foto del carrusel.
4. Reemplazar foto del carrusel.
5. Crear foto nueva del carrusel.
6. Eliminar jugador.
7. Crear jugador.
8. Editar jugador.
9. Desactivar equipo.

Requests esperadas:

- `PUT /api/t5/teams/:id`
- `POST /api/t5/teams/:id/logo`
- `DELETE /api/t5/teams/:id/photos/:photoId`
- `PUT /api/t5/teams/:id/photos/:photoId`
- `POST /api/t5/teams/:id/photos`
- `DELETE /api/t5/teams/:id/players/:playerId`
- `POST /api/t5/teams/:id/players`
- `PUT /api/t5/teams/:id/players/:playerId`
- `PATCH /api/t5/teams/:id/active`

Esperado:

- Todas con `Authorization: Bearer ...`
- Multipart sin `Content-Type` manual
- Si el backend responde `413`, la UI debe mostrar mensaje de archivo demasiado grande

### 5. Roster jueves con validación obligatoria

Archivo relacionado: `app/composables/useJuevesTeamEditor.ts`

Probar:

1. Agregar jugador sin nombre.
2. Agregar jugador sin CURP.
3. Agregar jugador sin foto.
4. Agregar jugador completo.
5. Editar jugador existente con foto nueva.
6. Eliminar jugador.

Esperado:

- Si falta nombre, CURP o foto, no debe salir request y la UI debe bloquear el guardado.
- Si el jugador está completo, sí debe salir request autenticada.
- Los errores ya no deben quedarse solo en consola.

## Verificaciones del helper compartido

Archivo relacionado: `app/composables/useAuthedFetch.ts`

Validar indirectamente:

1. Las requests autenticadas hacen refresh de token antes de salir.
2. Si hay `401`, el helper intenta un retry único.
3. Los errores que regresan del backend siguen mostrando `message`, `code` y `traceId` cuando existan.
4. En `FormData`, el browser pone el boundary automáticamente.
5. En JSON, el request sale con `Content-Type: application/json`.

## Casos de regresión a vigilar

1. Requests que antes funcionaban y ahora salgan sin `Authorization`.
2. Requests multipart que fallen por boundary roto.
3. Requests JSON que lleguen vacías o mal serializadas.
4. Mensajes genéricos en UI donde antes el backend mandaba `message` útil.
5. Loops que sigan marcando éxito aunque una sub-request interna haya fallado.

## Incidencia conocida de backend

Durante la validación del alta de jugadores apareció una falla del backend al subir fotos a storage:

- `S3Exception: Credential access key has length 21, should be 32`
- stack en `R2StorageService.uploadPlayerPhoto(...)`

Interpretación:

- Si vuelve a aparecer ese error, no es un problema del header de auth ni del helper del frontend.
- Es una configuración inválida del storage/R2/S3 del backend.

Qué debe anotar QA si ocurre:

1. Endpoint exacto.
2. Fecha y hora.
3. `traceId` si el backend lo envía.
4. Que el request sí llevaba `Authorization`.
5. Que el fallo ocurrió al subir foto, no al autenticar.

## Evidencia mínima esperada

Para cada flujo crítico, guardar:

1. Screenshot de DevTools mostrando `Authorization: Bearer ...`.
2. Screenshot del response con `200/201` cuando sea exitoso.
3. Screenshot del mensaje de error en UI cuando la validación bloquee el envío.
4. Si hay error backend, screenshot del response con `code`, `message`, `traceId`.

## Estado técnico de validación

Verificación local ya corrida después de los cambios:

- `./node_modules/.bin/nuxi typecheck`
- `./node_modules/.bin/nuxt build`

Ambas pasaron en el workspace local.
