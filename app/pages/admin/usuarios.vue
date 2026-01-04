<!-- app/pages/admin/usuarios.vue -->
<template>
  <main
    class="min-h-screen bg-[#050816] text-slate-50 selection:bg-cyan-300/30 selection:text-cyan-100"
    :class="{ 'is-drawer-open': !!selectedUser }"
  >
    <!-- Fondo (sin fixed layers para scroll más fluido) -->
    <div class="pointer-events-none absolute inset-0 -z-10 bg-surface"></div>

    <!-- Top bar -->
    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div
                class="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400/25 to-indigo-400/25 ring-1 ring-white/10"
              ></div>
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
                Cambia <b>Rol</b> (Usuario ↔ Capitán) y el <b>máx. de equipos</b>.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:opacity-60"
              @click="saveDirty"
              :disabled="isSaving || !dirtyIds.size"
              title="Guardar cambios a BD/Keycloak"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-3-6.7" />
                <path d="M21 3v6h-6" />
              </svg>
              Guardar cambios
              <span
                v-if="dirtyIds.size"
                class="ml-1 inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-100 ring-1 ring-cyan-400/20"
              >
                {{ dirtyIds.size }}
              </span>
            </button>

            <button
              class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
              @click="reloadNow"
              :disabled="isLoading || !canCallApi"
              title="Recargar desde BD"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4v6h6" />
                <path d="M20 20v-6h-6" />
                <path d="M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" />
              </svg>
              Recargar
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

    <!-- Content -->
    <section class="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div v-for="s in stats" :key="s.label" class="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs text-slate-400">{{ s.label }}</p>
              <p class="mt-1 text-2xl font-extrabold tracking-tight text-white">{{ s.value }}</p>
              <p class="mt-1 text-xs text-slate-400">{{ s.hint }}</p>
            </div>
            <div class="grid h-12 w-12 place-items-center rounded-3xl bg-black/20 ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" class="h-6 w-6 text-slate-200" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="s.iconPath"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search + filter -->
      <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div class="flex items-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-2xl bg-black/20 ring-1 ring-white/10">
                <svg viewBox="0 0 24 24" class="h-5 w-5 text-slate-200" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>

              <div class="flex-1">
                <input
                  ref="searchInput"
                  v-model="query"
                  class="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  placeholder="Buscar por nombre, correo o Keycloak ID…"
                />
                <p class="mt-1 text-xs text-slate-400">Tip: escribe “capitán”, “usuario” o “admin”.</p>
              </div>

              <button
                class="hidden md:inline-flex rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                @click="clearAll"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <button :class="chipClass(roleOnly === 'all')" @click="roleOnly='all'">Todos</button>
                <button :class="chipClass(roleOnly === 'CAPTAIN')" @click="roleOnly='CAPTAIN'">Capitanes</button>
                <button :class="chipClass(roleOnly === 'USER')" @click="roleOnly='USER'">Usuarios</button>
                <button :class="chipClass(roleOnly === 'ADMIN')" @click="roleOnly='ADMIN'">Admins</button>
              </div>

              <select
                v-model="sortKey"
                class="h-10 rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="createdDesc">Más nuevos</option>
                <option value="nameAsc">Nombre A → Z</option>
                <option value="teamsDesc">Más equipos permitidos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Table + drawer -->
      <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <!-- Table -->
        <div class="lg:col-span-8">
          <div class="rounded-3xl border border-white/10 bg-white/5">
            <div class="flex flex-col gap-2 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-semibold text-white">Directorio</p>
                <p class="text-xs text-slate-400">
                  {{ totalElements }} resultados · Página {{ page + 1 }} / {{ totalPages }}
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
              <table class="w-full">
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
                    class="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                    @click="openUser(u.id)"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div
                          class="relative grid place-items-center ring-1 ring-white/10 h-10 w-10 rounded-2xl"
                          :style="u.avatarStyle"
                        >
                          <span class="text-xs font-black tracking-wide text-white/90">{{ u.initials }}</span>
                          <span class="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"></span>
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-semibold text-white">
                            {{ u.fullName }}
                            <span
                              v-if="u.flags.verified"
                              class="ml-1 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/20"
                            >
                              Verificado
                            </span>
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
                        :class="u.isActive ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20' : 'bg-red-500/10 text-red-200 ring-red-400/20'"
                      >
                        {{ u.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>

                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-2xl bg-black/20 px-2.5 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10"
                      >
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
                          <path d="M9 18h6" />
                          <path d="M10 4h4l6 6v10H4V10l6-6z" />
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
                        <p class="text-sm font-semibold text-white">Sin resultados</p>
                        <p class="mt-1 text-xs text-slate-400">Intenta ajustar filtros o busca con otro término.</p>
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

                <!-- Skeleton -->
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

            <!-- Pagination -->
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
              <!-- Header -->
              <div class="border-b border-white/10 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="relative grid place-items-center ring-1 ring-white/10 h-14 w-14 rounded-[20px]" :style="selectedUser.avatarStyle">
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
                          :class="selectedUser.isActive ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20' : 'bg-red-500/10 text-red-200 ring-red-400/20'"
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

              <!-- Body -->
              <div class="p-4 space-y-4">
                <!-- Rol -->
                <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p class="text-sm font-semibold text-white">Rol</p>
                  <p class="mt-1 text-xs text-slate-400">Sube a Capitán o baja a Usuario.</p>

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

                  <div v-else class="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-xs text-slate-300">
                      Este usuario es <b>Admin</b>. En esta vista no se cambia.
                    </p>
                  </div>
                </div>

                <!-- Límite de equipos -->
                <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p class="text-sm font-semibold text-white">Máximo de equipos</p>
                  <p class="mt-1 text-xs text-slate-400">Define cuántos equipos puede crear/administrar.</p>

                  <div class="mt-3 flex items-center gap-2">
                    <button
                      class="h-11 w-11 rounded-2xl border border-white/10 bg-black/20 text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      @click="bumpTeams(-1)"
                    >
                      <svg viewBox="0 0 24 24" class="mx-auto h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
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
                      class="h-11 w-11 rounded-2xl border border-white/10 bg-black/20 text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      @click="bumpTeams(1)"
                    >
                      <svg viewBox="0 0 24 24" class="mx-auto h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
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

                  <p class="mt-3 text-xs text-slate-400">
                    Sugerencia: <b>Usuario</b> 0–1. <b>Capitán</b> 1–3 (ajústalo a tu negocio).
                  </p>
                </div>

                <!-- Acciones -->
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

                <!-- Info -->
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
                <p class="mt-1 text-xs text-slate-400">Aquí podrás cambiar rol y límite de equipos.</p>
              </div>
            </aside>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 z-[60] w-full max-w-sm space-y-2 px-4">
      <TransitionGroup name="toast" tag="div" class="space-y-2">
        <div v-for="t in toasts" :key="t.id" class="rounded-3xl border border-white/10 bg-[#070a1d] p-3 shadow-lg shadow-black/25">
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

            <button class="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-200 hover:bg-black/30" @click="removeToast(t.id)" aria-label="Cerrar">
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
import { useAuthz } from '@/composables/useAuthz'

type RoleDb = 'ADMIN' | 'CAPTAIN' | 'USER'
type PatchRole = 'CAPTAIN' | 'USER'

type AdminUserRowDTO = {
  id: number
  keycloakId: string
  email: string
  fullName: string
  role: string
  maxTeamsAllowed: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type SpringPage<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
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

function toPatchRole(r: RoleDb): PatchRole | undefined {
  return r === 'CAPTAIN' ? 'CAPTAIN' : r === 'USER' ? 'USER' : undefined
}

/* ---------------- API base ----------------
   .env:
   NUXT_PUBLIC_API_BASE=https://tocho5-api.tochero5.mx/api
*/
const config = useRuntimeConfig()
const API_BASE = computed(() => {
  return (
    (config.public as any).apiBase ||
    (config.public as any).apiUrl ||
    'https://tocho5-api.tochero5.mx/api'
  )
})

/* ---------------- Auth / KC token ---------------- */
const nuxtApp = useNuxtApp()
const { isAuthenticated } = useAuthz() as any
const kcReady = useState<boolean>('kcReady', () => false)

const canCallApi = computed(() => {
  return process.client && kcReady.value && !!isAuthenticated.value
})

function getKc() {
  return (nuxtApp as any).$kc
}

async function getAccessToken(): Promise<string> {
  if (!process.client) return ''

  const kc = getKc()
  if (!kc || !kcReady.value) return ''

  try {
    if (typeof kc.updateToken === 'function') {
      await kc.updateToken(30)
    }
  } catch {
    // ignore
  }

  return typeof kc.token === 'string' ? kc.token : ''
}

type ApiFetchOpts = {
  method?: string
  headers?: Record<string, string>
  body?: any
  requireAuth?: boolean
}

async function apiFetch<T>(path: string, opts: ApiFetchOpts = {}): Promise<T> {
  const requireAuth = opts.requireAuth ?? true
  const token = await getAccessToken()

  if (requireAuth && !token) {
    throw new Error('NO_TOKEN')
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers || {}),
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const url = path.startsWith('http') ? path : `${API_BASE.value}${path}`

  return await $fetch<T>(url, {
    ...opts,
    headers,
  })
}

/* -------- state -------- */
const users = ref<User[]>([])
const totalElements = ref(0)
const totalPages = ref(1)

const query = ref('')
const roleOnly = ref<'all' | RoleDb>('all')
const sortKey = ref<'createdDesc' | 'nameAsc' | 'teamsDesc'>('createdDesc')

const page = ref(0) // backend 0-based
const pageSize = ref(25)

const isLoading = ref(false)
const isSaving = ref(false)

const selectedUserId = ref<number | null>(null)
const roleDraft = ref<RoleDb>('USER')
const teamsDraft = ref<number>(0)

const dirtyIds = ref<Set<number>>(new Set())
const draftById = ref<Record<number, AdminUserPatchRequest>>({})

const searchInput = ref<HTMLInputElement | null>(null)

/* -------- computed -------- */
const selectedUser = computed(() => {
  if (!selectedUserId.value) return null
  return users.value.find(u => u.id === selectedUserId.value) || null
})

watch(selectedUser, (u) => {
  if (!u) return
  roleDraft.value = u.role
  teamsDraft.value = clampTeams(u.maxTeamsAllowed)
})

/* -------- load (debounced) -------- */
let tReload: any = null
function scheduleReload() {
  if (tReload) clearTimeout(tReload)
  tReload = setTimeout(() => reloadNow(), 260)
}
onBeforeUnmount(() => { if (tReload) clearTimeout(tReload) })

watch([query, roleOnly, sortKey, pageSize], () => {
  page.value = 0
  selectedUserId.value = null
  scheduleReload()
})

watch(page, () => {
  if (page.value < 0) page.value = 0
  if (page.value > totalPages.value - 1) page.value = Math.max(0, totalPages.value - 1)
  scheduleReload()
})

async function reloadNow() {
  if (!canCallApi.value) {
    // no spamear toasts; solo si intentan manualmente
    return
  }

  isLoading.value = true
  try {
    const params = new URLSearchParams()
    if (query.value.trim()) params.set('q', query.value.trim())
    if (roleOnly.value !== 'all') params.set('role', roleOnly.value)
    params.set('page', String(page.value))
    params.set('size', String(pageSize.value))
    params.set('sort', sortKey.value)

    const res = await apiFetch<SpringPage<AdminUserRowDTO>>(`/admin/users?${params.toString()}`)
    users.value = (res.content || []).map(rowToUser)
    totalElements.value = Number(res.totalElements ?? 0)
    totalPages.value = Math.max(1, Number(res.totalPages ?? 1))

    if (selectedUserId.value && !users.value.some(u => u.id === selectedUserId.value)) {
      selectedUserId.value = null
    }
  } catch (e: any) {
    const msg = String(e?.message || '')
    if (msg.includes('NO_TOKEN')) {
      toast('No hay token aún (esperando Keycloak)…', 'info')
    } else if (e?.status === 401) {
      toast('401: Token inválido/expirado o sin rol admin', 'danger')
    } else {
      toast('Error cargando usuarios', 'danger')
    }
  } finally {
    isLoading.value = false
  }
}

/* ✅ Carga SOLO cuando ya esté listo Keycloak + auth */
watch(
  () => ({ ready: kcReady.value, auth: !!isAuthenticated.value }),
  async ({ ready, auth }) => {
    if (ready && auth && users.value.length === 0 && !isLoading.value) {
      await reloadNow()
    }
  },
  { immediate: true }
)

/* -------- actions -------- */
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

function applyChanges() {
  const u = selectedUser.value
  if (!u) return

  // Admin no cambia rol
  let nextRole: RoleDb = u.role
  if (u.role !== 'ADMIN') {
    nextRole = (roleDraft.value === 'CAPTAIN' ? 'CAPTAIN' : 'USER')
  } else {
    roleDraft.value = 'ADMIN'
  }

  let nextTeams = clampTeams(teamsDraft.value)

  // regla opcional: USER máximo 1
  if (nextRole === 'USER' && nextTeams > 1) {
    nextTeams = 1
    teamsDraft.value = 1
    toast('Usuario: límite recortado a 1', 'info')
  }

  // UI optimista
  u.role = nextRole
  u.maxTeamsAllowed = nextTeams
  u.updatedAt = new Date().toISOString()
  refreshUi(u)

  // patch (SIN ADMIN)
  const patch: AdminUserPatchRequest = {
    maxTeamsAllowed: nextTeams,
  }
  const pr = toPatchRole(nextRole)
  if (pr) patch.role = pr

  draftById.value = { ...draftById.value, [u.id]: patch }
  dirtyIds.value = new Set(dirtyIds.value).add(u.id)
  toast('Cambios aplicados (pendientes de guardar)', 'success')
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
      const patch = draftById.value[id]
      if (!patch) {
        const nd = new Set(dirtyIds.value); nd.delete(id); dirtyIds.value = nd
        continue
      }

      try {
        const updated = await apiFetch<AdminUserRowDTO>(`/admin/users/${id}`, {
          method: 'PATCH',
          body: patch,
        })

        const idx = users.value.findIndex(u => u.id === id)
        if (idx >= 0) users.value[idx] = rowToUser(updated)

        const nd = new Set(dirtyIds.value); nd.delete(id); dirtyIds.value = nd
        const { [id]: _, ...rest } = draftById.value
        draftById.value = rest

        toast(`Guardado: ${shortKc(updated.keycloakId)}`, 'success')
      } catch (e: any) {
        if (e?.status === 401) toast('401 guardando: token/rol', 'danger')
        else toast(`Falló guardar usuario ${id}`, 'danger')
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

/* -------- UI helpers -------- */
type ToastTone = 'success' | 'info' | 'danger'
type Toast = { id: string; message: string; tone: ToastTone; meta: string }
const toasts = ref<Toast[]>([])
const toastTimers = new Map<string, any>()

function toast(message: string, tone: ToastTone = 'info') {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const meta = new Date().toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit' })
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
onBeforeUnmount(() => {
  toastTimers.forEach(t => clearTimeout(t))
  toastTimers.clear()
})

function chipClass(active: boolean) {
  return [
    'rounded-2xl px-3 py-2 text-xs font-semibold ring-1 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
    active ? 'bg-cyan-500/15 text-cyan-100 ring-cyan-400/20' : 'bg-black/20 text-slate-200 ring-white/10 hover:bg-black/30',
  ]
}

function badgeClass(tone: string) {
  const map: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-200 ring-indigo-400/20',
    purple: 'bg-purple-500/10 text-purple-200 ring-purple-400/20',
    slate: 'bg-white/5 text-slate-200 ring-white/10',
  }
  return ['inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', map[tone] || map.slate]
}

function roleTone(r: RoleDb) {
  return r === 'ADMIN' ? 'indigo' : r === 'CAPTAIN' ? 'purple' : 'slate'
}
function roleLabel(r: RoleDb) {
  return r === 'ADMIN' ? 'Admin' : r === 'CAPTAIN' ? 'Capitán' : 'Usuario'
}

function toastIconWrap(tone: ToastTone) {
  return tone === 'success'
    ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/20'
    : tone === 'danger'
      ? 'bg-red-500/10 text-red-100 ring-red-400/20'
      : 'bg-cyan-500/10 text-cyan-100 ring-cyan-400/20'
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
}

function shortKc(kc: string) {
  const s = (kc || '').trim()
  if (s.length <= 10) return s || '—'
  return `${s.slice(0, 6)}…${s.slice(-4)}`
}

function clampTeams(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(99, Math.floor(n)))
}

/* -------- perf: avatar + initials -------- */
function initialsOf(name: string) {
  const n = (name || '').trim()
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

function normalizeRole(v: any): RoleDb {
  const s = String(v ?? '').trim().toUpperCase()
  if (!s) return 'USER'
  if (s.includes('ADMIN')) return 'ADMIN'
  if (s.includes('CAPTAIN') || s.includes('CAPITAN')) return 'CAPTAIN'
  return 'USER'
}

function rowToUser(r: AdminUserRowDTO): User {
  const role = normalizeRole(r.role)
  const initials = initialsOf(r.fullName)
  const style = avatarStyle(r.email || r.keycloakId || r.fullName)

  return {
    id: r.id,
    keycloakId: r.keycloakId,
    email: r.email,
    fullName: r.fullName,
    role,
    maxTeamsAllowed: clampTeams(r.maxTeamsAllowed),
    isActive: !!r.isActive,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    flags: { verified: role === 'ADMIN' },
    initials,
    avatarStyle: style,
  }
}

function refreshUi(u: User) {
  u.initials = initialsOf(u.fullName)
  u.avatarStyle = avatarStyle(u.email || u.keycloakId || u.fullName)
}

/* -------- stats -------- */
const stats = computed(() => {
  const icon = {
    users: 'M16 21a4 4 0 00-8 0M12 11a4 4 0 100-8 4 4 0 000 8zM20 21a6 6 0 00-9-5.2',
    captain: 'M12 2l3 7h7l-5.5 4 2.1 7L12 16l-6.6 4 2.1-7L2 9h7l3-7z',
    shield: 'M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z',
  }
  return [
    { label: 'Usuarios', value: totalElements.value, hint: 'Total (según filtro)', iconPath: icon.users },
    { label: 'Capitanes (página)', value: users.value.filter(u => u.role === 'CAPTAIN').length, hint: 'Conteo de esta página', iconPath: icon.captain },
    { label: 'Admins (página)', value: users.value.filter(u => u.role === 'ADMIN').length, hint: 'Conteo de esta página', iconPath: icon.shield },
  ]
})

/* ⌘K para focus en búsqueda */
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
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
.cv-auto { content-visibility: auto; contain-intrinsic-size: 900px; }

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
