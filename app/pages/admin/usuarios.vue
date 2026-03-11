<!-- app/pages/admin/usuarios.vue -->
<template>
  <main
    class="min-h-screen bg-[#050816] text-slate-50 selection:bg-cyan-300/30 selection:text-cyan-100"
    :class="{ 'is-drawer-open': !!selectedUser }"
  >
    <div class="pointer-events-none absolute inset-0 -z-10 bg-surface"></div>

    <!-- Top bar -->
    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400/25 to-indigo-400/25 ring-1 ring-white/10"></div>
              <div class="absolute inset-0 grid place-items-center">
                <span class="text-xs font-black tracking-wide text-cyan-100">T5</span>
              </div>
            </div>

            <div>
              <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Tochero5 · Consola Admin
              </p>
              <h1 class="text-xl font-extrabold tracking-tight text-white">Usuarios</h1>
              <p class="mt-0.5 text-xs text-slate-400">
                Directorio, filtros por pestaña y edición rápida de rol / límite de equipos.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              class="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:opacity-60"
              @click="saveDirty"
              :disabled="isSaving || dirtyCount === 0 || !canCallApi"
              title="Guardar cambios pendientes"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V7l4-4h10l4 4v12a2 2 0 0 1-2 2z" />
                <path d="M17 21v-8H7v8" />
                <path d="M7 3v4h8V3" />
              </svg>
              Guardar cambios
              <span
                v-if="dirtyCount"
                class="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white ring-1 ring-white/10"
              >
                {{ dirtyCount }}
              </span>
            </button>

            <button
              class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
              @click="reloadNow"
              :disabled="isLoading || !canCallApi"
              title="Recargar desde backend"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4v6h6" />
                <path d="M20 20v-6h-6" />
                <path d="M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" />
              </svg>
              {{ isLoading ? 'Cargando…' : 'Recargar' }}
            </button>

            <div class="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <span class="text-xs text-slate-300">Buscar rápido</span>
              <kbd class="rounded-lg border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">⌘</kbd>
              <kbd class="rounded-lg border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">K</kbd>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <!-- Hero resumen -->
      <div class="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div class="xl:col-span-8">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {{ currentTabLabel }}
              </span>

              <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold text-slate-200">
                {{ filteredTotal }} resultado(s)
              </span>

              <span
                v-if="loadError"
                class="inline-flex items-center rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-100"
              >
                Error de carga
              </span>
            </div>

            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Gestión de usuarios por rol
            </h2>

            <p class="mt-2 max-w-3xl text-sm text-slate-300">
              Cambia de pestaña para ver <b>Admins</b>, <b>Capitanes</b>, <b>Usuarios</b> o el directorio completo.
              La tabla, contadores y panel lateral cambian con la pestaña activa.
            </p>
          </div>

          <div class="xl:col-span-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Cargados</p>
                <p class="mt-1 text-2xl font-extrabold text-white">{{ allUsers.length }}</p>
                <p class="mt-1 text-xs text-slate-500">Total del backend</p>
              </div>

              <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Pestaña</p>
                <p class="mt-1 text-2xl font-extrabold text-white">{{ filteredTotal }}</p>
                <p class="mt-1 text-xs text-slate-500">Después de filtros</p>
              </div>

              <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Editados</p>
                <p class="mt-1 text-2xl font-extrabold text-cyan-100">{{ dirtyCount }}</p>
                <p class="mt-1 text-xs text-slate-500">Pendientes por guardar</p>
              </div>

              <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Endpoint</p>
                <p class="mt-1 truncate text-sm font-bold text-slate-100">
                  {{ resolvedListPath || 'sin resolver' }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Ruta activa del back</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs + search -->
      <div class="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div class="xl:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pestañas</p>

          <div class="mt-3 flex flex-wrap gap-2">
            <button :class="tabClass(roleOnly === 'all')" @click="roleOnly = 'all'">
              Todos
              <span class="tab-counter">{{ roleCountMap.all }}</span>
            </button>

            <button :class="tabClass(roleOnly === 'CAPTAIN')" @click="roleOnly = 'CAPTAIN'">
              Capitanes
              <span class="tab-counter">{{ roleCountMap.CAPTAIN }}</span>
            </button>

            <button :class="tabClass(roleOnly === 'USER')" @click="roleOnly = 'USER'">
              Usuarios
              <span class="tab-counter">{{ roleCountMap.USER }}</span>
            </button>

            <button :class="tabClass(roleOnly === 'ADMIN')" @click="roleOnly = 'ADMIN'">
              Admins
              <span class="tab-counter">{{ roleCountMap.ADMIN }}</span>
            </button>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div class="md:col-span-8">
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Buscar
              </label>

              <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                <svg viewBox="0 0 24 24" class="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="7" />
                </svg>

                <input
                  ref="searchInput"
                  v-model="query"
                  class="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  placeholder="Nombre, correo, Keycloak ID o palabras como admin / capitán / usuario"
                />
              </div>
            </div>

            <div class="md:col-span-4">
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Orden
              </label>

              <select
                v-model="sortKey"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="createdDesc">Más nuevos</option>
                <option value="nameAsc">Nombre A → Z</option>
                <option value="teamsDesc">Más equipos permitidos</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-300">
              Página {{ page + 1 }} / {{ totalPages }}
            </span>

            <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-300">
              {{ filteredTotal }} coinciden
            </span>

            <span
              v-if="selectedUser"
              class="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-cyan-100"
            >
              Seleccionado: {{ selectedUser.fullName }}
            </span>

            <button
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-semibold text-slate-200 hover:bg-black/30"
              @click="clearAll"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div class="xl:col-span-5 grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Resumen de roles</p>

            <div class="mt-3 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-slate-300">Admins</span>
                <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-100 ring-1 ring-indigo-400/20">
                  {{ roleCountMap.ADMIN }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-slate-300">Capitanes</span>
                <span class="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-100 ring-1 ring-purple-400/20">
                  {{ roleCountMap.CAPTAIN }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-slate-300">Usuarios</span>
                <span class="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
                  {{ roleCountMap.USER }}
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Estado</p>

            <div class="mt-3 space-y-2 text-sm">
              <p class="text-slate-200">
                Back:
                <span class="font-semibold" :class="loadError ? 'text-rose-200' : 'text-emerald-200'">
                  {{ loadError ? 'Con error' : 'OK' }}
                </span>
              </p>

              <p class="text-slate-200">
                Auth:
                <span class="font-semibold" :class="canCallApi ? 'text-emerald-200' : 'text-amber-200'">
                  {{ canCallApi ? 'Lista' : 'Esperando token' }}
                </span>
              </p>

              <p class="text-slate-400 text-xs">
                Esta vista intenta varias rutas del backend y normaliza respuestas tipo array, page, items o data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error banner -->
      <div
        v-if="loadError"
        class="mt-4 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
      >
        {{ loadError }}
      </div>

      <!-- Table + drawer -->
      <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <!-- Table -->
        <div class="lg:col-span-8">
          <div class="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div class="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-base font-extrabold text-white">{{ currentTabLabel }}</p>
                  <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                    {{ filteredTotal }} resultado(s)
                  </span>
                </div>

                <p class="mt-1 text-xs text-slate-400">
                  Mostrando {{ pageStart + 1 }}–{{ pageEnd }} de {{ filteredTotal }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
                  @click="reloadNow"
                  :disabled="isLoading || !canCallApi"
                >
                  {{ isLoading ? 'Cargando…' : 'Refrescar' }}
                </button>
              </div>
            </div>

            <div class="overflow-x-auto cv-auto">
              <table class="w-full min-w-[880px]">
                <thead class="text-left text-xs text-slate-400">
                  <tr class="border-b border-white/10">
                    <th class="px-4 py-3">Usuario</th>
                    <th class="px-4 py-3">Rol</th>
                    <th class="px-4 py-3">Activo</th>
                    <th class="px-4 py-3">Máx. equipos</th>
                    <th class="px-4 py-3">Creado</th>
                    <th class="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody v-if="!isLoading">
                  <tr
                    v-for="u in users"
                    :key="u.id"
                    v-memo="[u.id, u.role, u.maxTeamsAllowed, u.isActive, u.updatedAt]"
                    class="border-b border-white/5 cursor-pointer hover:bg-white/5"
                    @click="openUser(u.id)"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div
                          class="relative grid h-10 w-10 place-items-center rounded-2xl ring-1 ring-white/10"
                          :style="u.avatarStyle"
                        >
                          <span class="text-xs font-black tracking-wide text-white/90">{{ u.initials }}</span>
                          <span class="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"></span>
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-semibold text-white">
                            {{ u.fullName }}
                            <span
                              v-if="dirtyIds.has(u.id)"
                              class="ml-1 inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-100 ring-1 ring-cyan-400/20"
                            >
                              Editado
                            </span>
                          </p>
                          <p class="truncate text-xs text-slate-400">{{ u.email }}</p>
                          <p class="truncate text-[11px] text-slate-500">KC: {{ shortKc(u.keycloakId) }}</p>
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3">
                      <span :class="badgeClass(roleTone(u.role))">{{ roleLabel(u.role) }}</span>
                    </td>

                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1"
                        :class="u.isActive ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20' : 'bg-rose-500/10 text-rose-200 ring-rose-400/20'"
                      >
                        {{ u.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>

                    <td class="px-4 py-3">
                      <span class="inline-flex items-center rounded-2xl bg-black/20 px-2.5 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
                        {{ u.maxTeamsAllowed }}
                      </span>
                    </td>

                    <td class="px-4 py-3">
                      <p class="text-sm text-slate-200">{{ fmtDate(u.createdAt) }}</p>
                      <p class="text-[11px] text-slate-500">Upd: {{ fmtDate(u.updatedAt) }}</p>
                    </td>

                    <td class="px-4 py-3 text-right" @click.stop>
                      <button
                        class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        @click="openUser(u.id)"
                      >
                        Editar
                        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr v-if="users.length === 0">
                    <td colspan="6" class="px-4 py-12">
                      <div class="grid place-items-center text-center">
                        <div class="mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-black/20 ring-1 ring-white/10">
                          <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-200" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 21l-4.35-4.35" />
                            <circle cx="11" cy="11" r="7" />
                          </svg>
                        </div>

                        <p class="text-sm font-semibold text-white">Sin resultados en {{ currentTabLabel.toLowerCase() }}</p>
                        <p class="mt-1 text-xs text-slate-400">
                          Prueba otra pestaña, cambia el texto de búsqueda o recarga los usuarios.
                        </p>

                        <button
                          class="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          @click="clearAll"
                        >
                          Limpiar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tbody v-else>
                  <tr v-for="i in 8" :key="i" class="border-b border-white/5">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-2xl bg-white/10 animate-pulse"></div>
                        <div class="flex-1">
                          <div class="h-3 w-44 rounded bg-white/10 animate-pulse"></div>
                          <div class="mt-2 h-3 w-64 rounded bg-white/5 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3"><div class="h-7 w-20 rounded-2xl bg-white/10 animate-pulse"></div></td>
                    <td class="px-4 py-3"><div class="h-7 w-16 rounded-2xl bg-white/10 animate-pulse"></div></td>
                    <td class="px-4 py-3"><div class="h-7 w-16 rounded-2xl bg-white/10 animate-pulse"></div></td>
                    <td class="px-4 py-3"><div class="h-3 w-24 rounded bg-white/10 animate-pulse"></div></td>
                    <td class="px-4 py-3 text-right"><div class="ml-auto h-9 w-20 rounded-2xl bg-white/10 animate-pulse"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex flex-col gap-3 border-t border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <p class="text-xs text-slate-400">
                Página <span class="font-semibold text-slate-200">{{ page + 1 }}</span> de
                <span class="font-semibold text-slate-200">{{ totalPages }}</span>
              </p>

              <div class="flex items-center gap-2">
                <button
                  class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 disabled:opacity-50 disabled:hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                  :disabled="page <= 0 || isLoading"
                  @click="page--"
                >
                  Anterior
                </button>

                <button
                  class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 disabled:opacity-50 disabled:hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                  :disabled="page >= totalPages - 1 || isLoading"
                  @click="page++"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer -->
        <div class="lg:col-span-4">
          <Transition name="slide">
            <aside v-if="selectedUser" class="sticky top-[92px] rounded-3xl border border-white/10 bg-white/5">
              <div class="border-b border-white/10 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="relative grid h-14 w-14 place-items-center rounded-[20px] ring-1 ring-white/10"
                      :style="selectedUser.avatarStyle"
                    >
                      <span class="text-xs font-black tracking-wide text-white/90">{{ selectedUser.initials }}</span>
                      <span class="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"></span>
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-base font-extrabold text-white">{{ selectedUser.fullName }}</p>
                      <p class="truncate text-xs text-slate-400">{{ selectedUser.email }}</p>

                      <div class="mt-2 flex flex-wrap gap-2">
                        <span :class="badgeClass(roleTone(selectedUser.role))">{{ roleLabel(selectedUser.role) }}</span>
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1"
                          :class="selectedUser.isActive ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20' : 'bg-rose-500/10 text-rose-200 ring-rose-400/20'"
                        >
                          {{ selectedUser.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    @click="closeUser"
                    title="Cerrar"
                  >
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-4 p-4">
                <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p class="text-sm font-semibold text-white">Rol</p>
                  <p class="mt-1 text-xs text-slate-400">
                    Cambia entre Usuario y Capitán. Los Admins se muestran en modo lectura.
                  </p>

                  <div v-if="selectedUser.role !== 'ADMIN'" class="mt-3 grid grid-cols-2 gap-2">
                    <button
                      class="rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      :class="roleDraft === 'USER' ? 'bg-cyan-500/15 text-cyan-100' : 'bg-black/20 text-slate-100 hover:bg-black/30'"
                      @click="roleDraft = 'USER'"
                    >
                      Usuario
                    </button>

                    <button
                      class="rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      :class="roleDraft === 'CAPTAIN' ? 'bg-indigo-500/15 text-indigo-100' : 'bg-black/20 text-slate-100 hover:bg-black/30'"
                      @click="roleDraft = 'CAPTAIN'"
                    >
                      Capitán
                    </button>
                  </div>

                  <div v-else class="mt-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-3">
                    <p class="text-xs text-indigo-100">
                      Este usuario pertenece a la pestaña <b>Admins</b> y aquí solo se muestra como referencia.
                    </p>
                  </div>
                </div>

                <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p class="text-sm font-semibold text-white">Máximo de equipos</p>
                  <p class="mt-1 text-xs text-slate-400">
                    Define cuántos equipos puede crear o administrar.
                  </p>

                  <div class="mt-3 flex items-center gap-2">
                    <button
                      class="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20 text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      @click="bumpTeams(-1)"
                    >
                      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14" />
                      </svg>
                    </button>

                    <input
                      v-model.number="teamsDraft"
                      type="number"
                      inputmode="numeric"
                      min="0"
                      max="99"
                      class="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                    />

                    <button
                      class="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20 text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      @click="bumpTeams(1)"
                    >
                      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <button class="pill" @click="teamsDraft = 0">0</button>
                    <button class="pill" @click="teamsDraft = 1">1</button>
                    <button class="pill" @click="teamsDraft = 2">2</button>
                    <button class="pill" @click="teamsDraft = 3">3</button>
                    <button class="pill" @click="teamsDraft = 5">5</button>
                    <button class="pill" @click="teamsDraft = 10">10</button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    @click="resetDraft"
                  >
                    Descartar
                  </button>

                  <button
                    class="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    @click="applyChanges"
                  >
                    Aplicar
                  </button>
                </div>

                <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p class="text-sm font-semibold text-white">Info</p>

                  <div class="mt-3 space-y-2 text-sm">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-xs text-slate-400">Keycloak ID</span>
                      <span class="text-sm font-semibold text-slate-100">{{ shortKc(selectedUser.keycloakId) }}</span>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                      <span class="text-xs text-slate-400">Creado</span>
                      <span class="text-sm font-semibold text-slate-100">{{ fmtDate(selectedUser.createdAt) }}</span>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                      <span class="text-xs text-slate-400">Actualizado</span>
                      <span class="text-sm font-semibold text-slate-100">{{ fmtDate(selectedUser.updatedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </Transition>

          <Transition name="fade">
            <aside v-if="!selectedUser" class="sticky top-[92px] rounded-3xl border border-white/10 bg-white/5 p-6">
              <div class="grid place-items-center text-center">
                <div class="mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-black/20 ring-1 ring-white/10">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-200" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
                    <path d="M20 21a8 8 0 10-16 0" />
                  </svg>
                </div>
                <p class="text-sm font-semibold text-white">Selecciona un usuario</p>
                <p class="mt-1 text-xs text-slate-400">
                  El panel lateral cambia según el usuario y la pestaña actual.
                </p>
              </div>
            </aside>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 z-[60] w-full max-w-sm space-y-2 px-4">
      <TransitionGroup name="toast" tag="div" class="space-y-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="rounded-3xl border border-white/10 bg-[#070a1d] p-3 shadow-lg shadow-black/25"
        >
          <div class="flex items-start gap-3">
            <div class="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ring-1 ring-white/10" :class="toastIconWrap(t.tone)">
              <svg v-if="t.tone === 'success'" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <svg v-else-if="t.tone === 'danger'" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10 3h4l8 18H2L10 3z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 16h.01" />
                <path d="M12 12a2 2 0 10-2-2" />
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>

            <div class="flex-1">
              <p class="text-sm font-semibold text-white">{{ t.message }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ t.meta }}</p>
            </div>

            <button
              class="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-200 hover:bg-black/30"
              @click="removeToast(t.id)"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig, useNuxtApp, useState } from '#imports'
import { $fetch } from 'ofetch'

type RoleDb = 'ADMIN' | 'CAPTAIN' | 'USER'
type PatchRole = 'CAPTAIN' | 'USER'

type AdminUserRowDTO = {
  id?: number
  userId?: number
  keycloakId?: string
  keycloak_id?: string
  kcId?: string
  email?: string
  fullName?: string
  full_name?: string
  name?: string
  firstName?: string
  first_name?: string
  lastName?: string
  last_name?: string
  role?: string
  roleName?: string
  roles?: string[] | string
  authorities?: string[] | string
  maxTeamsAllowed?: number
  max_teams_allowed?: number
  maxTeams?: number
  teamLimit?: number
  isActive?: boolean
  active?: boolean
  enabled?: boolean
  status?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  emailVerified?: boolean
}

type SpringPage<T> = {
  content?: T[]
  data?: T[] | { content?: T[]; totalElements?: number; totalPages?: number; number?: number; size?: number }
  items?: T[]
  users?: T[]
  totalElements?: number
  totalPages?: number
  number?: number
  size?: number
}

type User = {
  id: number
  keycloakId: string
  email: string
  fullName: string
  role: RoleDb
  maxTeamsAllowed: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  flags: { verified: boolean }
  initials: string
  avatarStyle: Record<string, string>
}

type AdminUserPatchRequest = {
  role?: PatchRole
  maxTeamsAllowed?: number
  isActive?: boolean
}

type ApiFetchOpts = {
  method?: string
  headers?: Record<string, string>
  body?: any
  requireAuth?: boolean
}

type ToastTone = 'success' | 'info' | 'danger'
type Toast = { id: string; message: string; tone: ToastTone; meta: string }

const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)

const ADMIN_USERS_LIST_CANDIDATES = [
  '/admin/users',
  '/admin/users/list',
  '/users',
  '/users/list'
]
const ADMIN_USERS_PATCH_BASE = '/admin/users'

function normalizeApiBase(input: any) {
  const fallback = 'https://tocho5-api.tochero5.mx/api'
  let s = String(input || fallback).trim()
  if (!s) s = fallback
  s = s.replace(/\/+$/, '')
  if (!/\/api$/i.test(s)) s = `${s}/api`
  return s
}

const API_BASE = computed(() => normalizeApiBase((config.public as any)?.apiBase || (config.public as any)?.apiUrl))
const resolvedListPath = ref('')

const query = ref('')
const roleOnly = ref<'all' | RoleDb>('all')
const sortKey = ref<'createdDesc' | 'nameAsc' | 'teamsDesc'>('createdDesc')
const page = ref(0)
const pageSize = ref(25)

const isLoading = ref(false)
const isSaving = ref(false)
const loadError = ref('')

const allUsers = ref<User[]>([])
const selectedUserId = ref<number | null>(null)
const roleDraft = ref<RoleDb>('USER')
const teamsDraft = ref<number>(0)

const dirtyIds = ref<Set<number>>(new Set())
const draftById = ref<Record<number, AdminUserPatchRequest>>({})
const searchInput = ref<HTMLInputElement | null>(null)

const toasts = ref<Toast[]>([])
const toastTimers = new Map<string, any>()

const canCallApi = computed(() => process.client && kcReady.value)

function getKc() {
  return (nuxtApp as any).$kc
}

function toPatchRole(r: RoleDb): PatchRole | undefined {
  return r === 'CAPTAIN' ? 'CAPTAIN' : r === 'USER' ? 'USER' : undefined
}

function safeString(v: any) {
  return String(v ?? '').trim()
}

function clampTeams(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(99, Math.floor(n)))
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso || '—'
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
}

function shortKc(kc: string) {
  const s = safeString(kc)
  if (!s) return '—'
  if (s.length <= 10) return s
  return `${s.slice(0, 6)}…${s.slice(-4)}`
}

function roleLabel(r: RoleDb) {
  return r === 'ADMIN' ? 'Admin' : r === 'CAPTAIN' ? 'Capitán' : 'Usuario'
}

function roleTone(r: RoleDb) {
  return r === 'ADMIN' ? 'indigo' : r === 'CAPTAIN' ? 'purple' : 'slate'
}

function badgeClass(tone: string) {
  const map: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-200 ring-indigo-400/20',
    purple: 'bg-purple-500/10 text-purple-200 ring-purple-400/20',
    slate: 'bg-white/5 text-slate-200 ring-white/10',
  }
  return ['inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', map[tone] || map.slate]
}

function tabClass(active: boolean) {
  return [
    'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
    active
      ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100'
      : 'border-white/10 bg-black/20 text-slate-200 hover:bg-black/30'
  ]
}

function toastIconWrap(tone: ToastTone) {
  return tone === 'success'
    ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/20'
    : tone === 'danger'
      ? 'bg-red-500/10 text-red-100 ring-red-400/20'
      : 'bg-cyan-500/10 text-cyan-100 ring-cyan-400/20'
}

function toast(message: string, tone: ToastTone = 'info') {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const meta = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  toasts.value = [{ id, message, tone, meta }, ...toasts.value].slice(0, 4)
  const timer = setTimeout(() => removeToast(id), 3200)
  toastTimers.set(id, timer)
}

function removeToast(id: string) {
  const timer = toastTimers.get(id)
  if (timer) clearTimeout(timer)
  toastTimers.delete(id)
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function initialsOf(name: string) {
  const n = safeString(name)
  if (!n) return 'U'
  const parts = n.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase() || '').join('') || 'U'
}

function avatarHue(seed: string) {
  const s = (seed || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hues = [190, 210, 240, 265, 285]
  return hues[s % hues.length] ?? 210
}

function avatarStyle(seed: string) {
  const h = avatarHue(seed)
  return {
    background: `linear-gradient(135deg, hsla(${h}, 90%, 60%, .25), hsla(${(h + 50) % 360}, 90%, 60%, .18))`,
  }
}

function normalizeRoleFromRow(row: any): RoleDb {
  const tokens: string[] = []

  const pushValue = (v: any) => {
    if (Array.isArray(v)) {
      for (const x of v) tokens.push(String(x ?? '').toUpperCase())
      return
    }
    if (v != null) tokens.push(String(v).toUpperCase())
  }

  pushValue(row?.role)
  pushValue(row?.roleName)
  pushValue(row?.roles)
  pushValue(row?.authorities)

  const merged = tokens.join(' ')
  if (merged.includes('ADMIN')) return 'ADMIN'
  if (merged.includes('CAPTAIN') || merged.includes('CAPITAN')) return 'CAPTAIN'
  return 'USER'
}

function normalizeActiveFromRow(row: any) {
  const direct = row?.isActive ?? row?.active ?? row?.enabled
  if (typeof direct === 'boolean') return direct

  const status = safeString(row?.status).toUpperCase()
  if (status === 'ACTIVE' || status === 'ENABLED') return true
  if (status === 'INACTIVE' || status === 'DISABLED') return false

  return !!direct
}

function rowToUser(r: AdminUserRowDTO): User {
  const firstName = safeString(r.firstName ?? r.first_name)
  const lastName = safeString(r.lastName ?? r.last_name)
  const fullName =
    safeString(r.fullName ?? r.full_name ?? r.name) ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    safeString(r.email) ||
    'Usuario'

  const email = safeString(r.email) || 'sin-correo'
  const keycloakId = safeString(r.keycloakId ?? r.keycloak_id ?? r.kcId)
  const role = normalizeRoleFromRow(r)
  const initials = initialsOf(fullName)
  const style = avatarStyle(email || keycloakId || fullName)

  return {
    id: Number(r.id ?? r.userId ?? 0) || 0,
    keycloakId,
    email,
    fullName,
    role,
    maxTeamsAllowed: clampTeams(r.maxTeamsAllowed ?? r.max_teams_allowed ?? r.maxTeams ?? r.teamLimit),
    isActive: normalizeActiveFromRow(r),
    createdAt: safeString(r.createdAt ?? r.created_at) || new Date().toISOString(),
    updatedAt: safeString(r.updatedAt ?? r.updated_at) || safeString(r.createdAt ?? r.created_at) || new Date().toISOString(),
    flags: { verified: !!(r.emailVerified || role === 'ADMIN') },
    initials,
    avatarStyle: style,
  }
}

function refreshUi(u: User) {
  u.initials = initialsOf(u.fullName)
  u.avatarStyle = avatarStyle(u.email || u.keycloakId || u.fullName)
}

async function getAccessToken(): Promise<string> {
  if (!process.client) return ''
  const kc = getKc()
  if (!kc || !kcReady.value) return ''

  try {
    if (typeof kc.updateToken === 'function') await kc.updateToken(30)
  } catch {
    // ignore
  }

  return typeof kc.token === 'string' ? kc.token : ''
}

async function apiFetch<T>(path: string, opts: ApiFetchOpts = {}): Promise<T> {
  const requireAuth = opts.requireAuth ?? true
  const token = await getAccessToken()

  if (requireAuth && !token) throw new Error('NO_TOKEN')

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers || {}),
  }

  if (opts.body != null && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const url = path.startsWith('http') ? path : `${API_BASE.value}${path}`

  try {
    return await $fetch<T>(url, { ...opts, headers })
  } catch (e: any) {
    if (e?.status === 401 && process.client) {
      const kc = getKc()
      try {
        if (kc && typeof kc.updateToken === 'function') {
          await kc.updateToken(0)
          const token2 = await getAccessToken()
          const headers2 = { ...headers }
          if (token2) headers2.Authorization = `Bearer ${token2}`
          return await $fetch<T>(url, { ...opts, headers: headers2 })
        }
      } catch {
        // ignore
      }
    }
    throw e
  }
}

function unpackUsersResponse(res: any) {
  if (Array.isArray(res)) {
    return { items: res, totalPages: 1, totalElements: res.length, paged: false }
  }

  if (res && Array.isArray(res.content)) {
    return {
      items: res.content,
      totalPages: Number(res.totalPages ?? 1) || 1,
      totalElements: Number(res.totalElements ?? res.content.length ?? 0) || 0,
      paged: true
    }
  }

  if (res?.data && Array.isArray(res.data)) {
    return { items: res.data, totalPages: 1, totalElements: res.data.length, paged: false }
  }

  if (res?.data && Array.isArray(res.data?.content)) {
    return {
      items: res.data.content,
      totalPages: Number(res.data.totalPages ?? 1) || 1,
      totalElements: Number(res.data.totalElements ?? res.data.content.length ?? 0) || 0,
      paged: true
    }
  }

  if (res && Array.isArray(res.items)) {
    return { items: res.items, totalPages: 1, totalElements: res.items.length, paged: false }
  }

  if (res && Array.isArray(res.users)) {
    return { items: res.users, totalPages: 1, totalElements: res.users.length, paged: false }
  }

  return { items: [], totalPages: 1, totalElements: 0, paged: false }
}

function uniqUsers(list: User[]) {
  const map = new Map<number, User>()
  for (const u of list) {
    if (!u.id) continue
    map.set(u.id, u)
  }
  return Array.from(map.values())
}

async function fetchUsersFromCandidate(candidate: string) {
  const size = 200
  let currentPage = 0
  let totalPagesRemote = 1
  const acc: User[] = []

  while (true) {
    const join = candidate.includes('?') ? '&' : '?'
    const path = `${candidate}${join}page=${currentPage}&size=${size}`
    const res = await apiFetch<any>(path)
    const unpacked = unpackUsersResponse(res)

    const mapped = (unpacked.items || [])
      .map((x: AdminUserRowDTO) => rowToUser(x))
      .filter((x: User) => x.id > 0)

    acc.push(...mapped)

    if (!unpacked.paged) break

    totalPagesRemote = Math.max(1, Number(unpacked.totalPages || 1))
    currentPage += 1
    if (currentPage >= totalPagesRemote) break
    if (currentPage > 50) break
  }

  return uniqUsers(acc)
}

async function fetchAllUsersFromBack() {
  let lastErr: any = null

  for (const candidate of ADMIN_USERS_LIST_CANDIDATES) {
    try {
      const rows = await fetchUsersFromCandidate(candidate)
      resolvedListPath.value = candidate
      return rows
    } catch (e: any) {
      lastErr = e
    }
  }

  throw lastErr || new Error('No se pudo resolver ningún endpoint de usuarios')
}

async function reloadNow() {
  if (!canCallApi.value) return

  isLoading.value = true
  loadError.value = ''

  try {
    const rows = await fetchAllUsersFromBack()
    allUsers.value = rows

    if (selectedUserId.value && !allUsers.value.some(u => u.id === selectedUserId.value)) {
      selectedUserId.value = null
    }
  } catch (e: any) {
    const msg = String(e?.message || '')

    if (msg.includes('NO_TOKEN')) {
      loadError.value = 'Aún no hay token de Keycloak disponible.'
      toast('No hay token aún (Keycloak)…', 'info')
    } else if (e?.status === 401) {
      loadError.value = '401: token inválido o usuario sin rol admin.'
      toast('401: token inválido o sin rol admin', 'danger')
    } else {
      loadError.value = e?.data?.message || e?.message || 'Error cargando usuarios desde el backend.'
      toast('Error cargando usuarios', 'danger')
    }
  } finally {
    isLoading.value = false
  }
}

const roleCountMap = computed(() => {
  const acc = { all: allUsers.value.length, ADMIN: 0, CAPTAIN: 0, USER: 0 }
  for (const u of allUsers.value) {
    if (u.role === 'ADMIN') acc.ADMIN++
    else if (u.role === 'CAPTAIN') acc.CAPTAIN++
    else acc.USER++
  }
  return acc
})

const currentTabLabel = computed(() => {
  if (roleOnly.value === 'CAPTAIN') return 'Capitanes'
  if (roleOnly.value === 'USER') return 'Usuarios'
  if (roleOnly.value === 'ADMIN') return 'Admins'
  return 'Todos los usuarios'
})

const filteredBase = computed(() => {
  let out = allUsers.value.slice()

  if (roleOnly.value !== 'all') {
    out = out.filter(u => u.role === roleOnly.value)
  }

  const q = safeString(query.value).toLowerCase()
  if (q) {
    out = out.filter((u) => {
      const roleToken = roleLabel(u.role).toLowerCase()
      return (
        safeString(u.fullName).toLowerCase().includes(q) ||
        safeString(u.email).toLowerCase().includes(q) ||
        safeString(u.keycloakId).toLowerCase().includes(q) ||
        roleToken.includes(q)
      )
    })
  }

  out.sort((a, b) => {
    if (sortKey.value === 'nameAsc') {
      return a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' })
    }
    if (sortKey.value === 'teamsDesc') {
      return b.maxTeamsAllowed - a.maxTeamsAllowed || a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' })
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return out
})

const filteredTotal = computed(() => filteredBase.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTotal.value / pageSize.value)))
const pageStart = computed(() => (page.value * pageSize.value))
const pageEnd = computed(() => Math.min(filteredTotal.value, pageStart.value + pageSize.value))
const users = computed(() => filteredBase.value.slice(pageStart.value, pageEnd.value))
const dirtyCount = computed(() => dirtyIds.value.size)

const selectedUser = computed(() => {
  if (!selectedUserId.value) return null
  return allUsers.value.find(u => u.id === selectedUserId.value) || null
})

watch(selectedUser, (u) => {
  if (!u) return
  roleDraft.value = u.role
  teamsDraft.value = clampTeams(u.maxTeamsAllowed)
})

watch([query, roleOnly, sortKey], () => {
  page.value = 0
})

watch(filteredTotal, () => {
  if (page.value > totalPages.value - 1) {
    page.value = Math.max(0, totalPages.value - 1)
  }
})

watch(filteredBase, (rows) => {
  if (!selectedUserId.value) return
  const found = rows.some(u => u.id === selectedUserId.value)
  if (!found) selectedUserId.value = null
})

function openUser(id: number) {
  selectedUserId.value = id
}

function closeUser() {
  selectedUserId.value = null
}

function bumpTeams(delta: number) {
  teamsDraft.value = clampTeams((Number(teamsDraft.value) || 0) + delta)
}

function resetDraft() {
  const u = selectedUser.value
  if (!u) return
  roleDraft.value = u.role
  teamsDraft.value = clampTeams(u.maxTeamsAllowed)
  toast('Cambios descartados', 'info')
}

async function saveOne(id: number) {
  const patch = draftById.value[id]
  if (!patch) return

  const updated = await apiFetch<AdminUserRowDTO>(`${ADMIN_USERS_PATCH_BASE}/${id}`, {
    method: 'PATCH',
    body: patch,
  })

  const idx = allUsers.value.findIndex(u => u.id === id)
  if (idx >= 0) allUsers.value[idx] = rowToUser(updated)

  const newDirty = new Set(dirtyIds.value)
  newDirty.delete(id)
  dirtyIds.value = newDirty

  const rest = { ...draftById.value }
  delete rest[id]
  draftById.value = rest

  toast(`Guardado: ${shortKc(updated.keycloakId ?? '')}`, 'success')
}

function applyChanges() {
  const u = selectedUser.value
  if (!u) return

  let nextRole: RoleDb = u.role
  if (u.role !== 'ADMIN') {
    nextRole = roleDraft.value === 'CAPTAIN' ? 'CAPTAIN' : 'USER'
  }

  let nextTeams = clampTeams(teamsDraft.value)

  if (nextRole === 'USER' && nextTeams > 1) {
    nextTeams = 1
    teamsDraft.value = 1
    toast('Usuario: límite recortado a 1', 'info')
  }

  const patch: AdminUserPatchRequest = {
    maxTeamsAllowed: nextTeams
  }

  const pr = toPatchRole(nextRole)
  if (pr) patch.role = pr

  u.role = nextRole
  u.maxTeamsAllowed = nextTeams
  u.updatedAt = new Date().toISOString()
  refreshUi(u)

  draftById.value = { ...draftById.value, [u.id]: patch }
  dirtyIds.value = new Set(dirtyIds.value).add(u.id)

  toast('Aplicado. Guardando…', 'info')

  ;(async () => {
    if (!canCallApi.value) {
      toast('No autenticado todavía (Keycloak)…', 'info')
      return
    }

    isSaving.value = true
    try {
      await saveOne(u.id)
    } catch (e: any) {
      toast(e?.status === 401 ? '401 guardando: token/rol admin' : `Falló guardar usuario ${u.id}`, 'danger')
    } finally {
      isSaving.value = false
    }
  })()
}

async function saveDirty() {
  const ids = Array.from(dirtyIds.value)
  if (!ids.length) return

  if (!canCallApi.value) {
    toast('No autenticado todavía (Keycloak)…', 'info')
    return
  }

  isSaving.value = true
  try {
    for (const id of ids) {
      try {
        await saveOne(id)
      } catch (e: any) {
        toast(e?.status === 401 ? '401 guardando: token/rol admin' : `Falló guardar usuario ${id}`, 'danger')
      }
    }
  } finally {
    isSaving.value = false
  }
}

function clearAll() {
  query.value = ''
  roleOnly.value = 'all'
  sortKey.value = 'createdDesc'
  page.value = 0
  toast('Filtros reiniciados', 'info')
}

function onKeydown(e: KeyboardEvent) {
  const isMac = navigator.platform.toLowerCase().includes('mac')
  const cmdk =
    (isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
    (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')

  if (cmdk) {
    e.preventDefault()
    searchInput.value?.focus()
    toast('Búsqueda rápida', 'info')
  }
}

watch(
  () => kcReady.value,
  async (ready) => {
    if (ready && allUsers.value.length === 0 && !isLoading.value) {
      await reloadNow()
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  const timer = setTimeout(() => {
    if (kcReady.value && allUsers.value.length === 0 && !isLoading.value) reloadNow()
  }, 700)

  toastTimers.set('__boot__', timer)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  toastTimers.forEach(t => clearTimeout(t))
  toastTimers.clear()
})
</script>

<style scoped>
.bg-surface {
  background:
    radial-gradient(circle at 12% 10%, rgba(34, 211, 238, 0.14), transparent 46%),
    radial-gradient(circle at 88% 92%, rgba(99, 102, 241, 0.14), transparent 48%),
    radial-gradient(ellipse at top, rgba(56, 189, 248, 0.06), transparent 56%),
    radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.06), transparent 56%),
    radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%);
}

.cv-auto {
  content-visibility: auto;
  contain-intrinsic-size: 900px;
}

.pill {
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.20);
  color: rgba(226,232,240,0.95);
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background .15s ease;
}
.pill:hover { background: rgba(0,0,0,0.30); }

.tab-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.45rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 11px;
  line-height: 1;
  font-weight: 800;
}

.fade-enter-active, .fade-leave-active { transition: opacity .14s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform .16s ease, opacity .16s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(6px); opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: transform .16s ease, opacity .16s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(8px); opacity: 0; }

::-webkit-scrollbar { height: 10px; width: 10px; }
::-webkit-scrollbar-thumb { background: rgba(148,163,184,.22); border-radius: 999px; }
::-webkit-scrollbar-track { background: rgba(15,23,42,.2); }

.is-drawer-open { transform: translateZ(0); }
</style>