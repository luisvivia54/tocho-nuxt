<template>
    <main
      class="min-h-screen bg-[#050816] text-slate-50 selection:bg-cyan-300/30 selection:text-cyan-100"
    >
      <!-- ✅ Ultra-light fixed background (1 solo layer, sin blur/filter, sin grid) -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden perf-layer">
        <div class="absolute inset-0 bg-lite"></div>
        <div class="absolute inset-0 opacity-[0.10] vignette"></div>
      </div>
  
      <!-- Top bar (sin blur) -->
      <header class="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 perf-layer">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400/25 to-indigo-400/25 ring-1 ring-white/10"></div>
                <div class="absolute inset-0 grid place-items-center">
                  <span class="text-xs font-black tracking-wide text-cyan-100">T5</span>
                </div>
              </div>
              <div>
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Tochero5 · Consola Admin</p>
                <h1 class="text-xl font-extrabold tracking-tight text-white">Usuarios</h1>
              </div>
            </div>
  
            <div class="flex flex-wrap items-center gap-2">
              <button
                class="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                @click="openInviteModal"
              >
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
                  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Nuevo usuario
              </button>
  
              <button
                class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                @click="fakeExport"
                title="Exportar (maqueta)"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Exportar
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
  
        <!-- Controls -->
        <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <!-- Search -->
          <div class="lg:col-span-6">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-3">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-black/20 ring-1 ring-white/10">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 text-slate-200" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 21l-4.35-4.35" />
                    <circle cx="11" cy="11" r="7" />
                  </svg>
                </div>
  
                <div class="flex-1">
                  <label class="sr-only">Buscar usuarios</label>
                  <input
                    v-model="query"
                    class="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                    placeholder="Buscar por nombre, correo, rol o teléfono…"
                  />
                  <p class="mt-1 text-xs text-slate-400">Tip: escribe “admin”, “capitán”, “staff”, “suspendido” o un correo.</p>
                </div>
  
                <div class="hidden md:flex items-center gap-2">
                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    @click="clearAll"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Filters -->
          <div class="lg:col-span-6">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-3">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div class="flex flex-wrap items-center gap-2">
                  <button :class="chipClass(statusFilter === 'all')" @click="statusFilter = 'all'">Todos</button>
                  <button :class="chipClass(statusFilter === 'active')" @click="statusFilter = 'active'">Activos</button>
                  <button :class="chipClass(statusFilter === 'pending')" @click="statusFilter = 'pending'">Pendientes</button>
                  <button :class="chipClass(statusFilter === 'suspended')" @click="statusFilter = 'suspended'">Suspendidos</button>
                </div>
  
                <div class="flex items-center gap-2">
                  <select
                    v-model="roleFilter"
                    class="h-10 rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Capitán">Capitán</option>
                    <option value="Usuario">Usuario</option>
                  </select>
  
                  <select
                    v-model="sortKey"
                    class="h-10 rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  >
                    <option value="createdDesc">Más nuevos</option>
                    <option value="nameAsc">Nombre A → Z</option>
                    <option value="roleAsc">Rol</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Bulk actions -->
        <Transition name="lift">
          <div
            v-if="selectedIds.size > 0"
            class="mt-4 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-3"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-black/25 ring-1 ring-white/10">
                  <span class="text-sm font-black text-cyan-100">{{ selectedIds.size }}</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Selección activa</p>
                  <p class="text-xs text-slate-300">Acciones masivas (maqueta)</p>
                </div>
              </div>
  
              <div class="flex flex-wrap items-center gap-2">
                <button
                  class="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  @click="toast('Invitación reenviada (mock)', 'success')"
                >
                  Reenviar invitación
                </button>
                <button
                  class="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/35 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                  @click="toast('Roles actualizados (mock)', 'info')"
                >
                  Cambiar rol
                </button>
                <button
                  class="rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                  @click="toast('Usuarios suspendidos (mock)', 'danger')"
                >
                  Suspender
                </button>
                <button
                  class="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                  @click="clearSelection"
                >
                  Limpiar selección
                </button>
              </div>
            </div>
          </div>
        </Transition>
  
        <!-- Users table + drawer -->
        <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <!-- Table -->
          <div class="lg:col-span-8">
            <div class="rounded-3xl border border-white/10 bg-white/5">
              <div class="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-sm font-semibold text-white">Directorio de usuarios</p>
                  <p class="text-xs text-slate-400">
                    Mostrando <span class="text-slate-200 font-semibold">{{ paginated.length }}</span> de
                    <span class="text-slate-200 font-semibold">{{ filteredSorted.length }}</span> resultados
                  </p>
                </div>
  
                <div class="flex items-center gap-2">
                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    @click="isLoading = !isLoading"
                    title="Simular loading"
                  >
                    {{ isLoading ? 'Quitar' : 'Simular' }} loading
                  </button>
                </div>
              </div>
  
              <div class="hidden md:block">
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="text-left text-xs text-slate-400">
                      <tr class="border-b border-white/10">
                        <th class="px-4 py-3">
                          <input
                            type="checkbox"
                            class="h-4 w-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400/30"
                            :checked="allOnPageSelected"
                            @change="onSelectAllChange"
                          />
                        </th>
                        <th class="px-4 py-3">Usuario</th>
                        <th class="px-4 py-3">Rol</th>
                        <th class="px-4 py-3">Estado</th>
                        <th class="px-4 py-3">Creado</th>
                        <th class="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
  
                    <tbody v-if="!isLoading">
                      <tr
                        v-for="u in paginated"
                        :key="u.id"
                        class="group border-b border-white/5 hover:bg-white/5 cursor-pointer"
                        @click="openUser(u.id)"
                      >
                        <td class="px-4 py-3" @click.stop>
                          <input
                            type="checkbox"
                            class="h-4 w-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400/30"
                            :checked="selectedIds.has(u.id)"
                            @change="(e) => onRowSelectChange(e, u.id)"
                          />
                        </td>
  
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-3">
                            <div
                              class="relative grid place-items-center ring-1 ring-white/10 h-10 w-10 rounded-2xl"
                              :style="avatarBg(u.email)"
                            >
                              <span class="text-xs font-black tracking-wide text-white/90">{{ initials(u.name) }}</span>
                              <span class="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"></span>
                            </div>
  
                            <div class="min-w-0">
                              <p class="truncate text-sm font-semibold text-white">
                                {{ u.name }}
                                <span
                                  v-if="u.flags.verified"
                                  class="ml-1 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/20"
                                >
                                  Verificado
                                </span>
                              </p>
                              <p class="truncate text-xs text-slate-400">{{ u.email }}</p>
                            </div>
                          </div>
                        </td>
  
                        <td class="px-4 py-3">
                          <span :class="badgeClass(roleTone(u.role))">{{ u.role }}</span>
                        </td>
  
                        <td class="px-4 py-3">
                          <span :class="badgeClass(statusTone(u.status))">{{ statusLabel(u.status) }}</span>
                        </td>
  
                        <td class="px-4 py-3">
                          <p class="text-sm text-slate-200">{{ fmtDate(u.createdAt) }}</p>
                          <p class="text-xs text-slate-400">{{ u.plan }}</p>
                        </td>
  
                        <td class="px-4 py-3 text-right" @click.stop>
                          <button
                            class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            @click="toast('Menú de acciones (mock)', 'info')"
                          >
                            Opciones
                            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
  
                      <tr v-if="filteredSorted.length === 0">
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
                              Limpiar filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
  
                    <tbody v-else>
                      <tr v-for="i in 8" :key="i" class="border-b border-white/5">
                        <td class="px-4 py-3"><div class="h-4 w-4 rounded bg-white/10 animate-pulse"></div></td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-2xl bg-white/10 animate-pulse"></div>
                            <div class="flex-1">
                              <div class="h-3 w-40 rounded bg-white/10 animate-pulse"></div>
                              <div class="mt-2 h-3 w-56 rounded bg-white/5 animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-3"><div class="h-7 w-20 rounded-2xl bg-white/10 animate-pulse"></div></td>
                        <td class="px-4 py-3"><div class="h-7 w-24 rounded-2xl bg-white/10 animate-pulse"></div></td>
                        <td class="px-4 py-3"><div class="h-3 w-28 rounded bg-white/10 animate-pulse"></div></td>
                        <td class="px-4 py-3 text-right"><div class="ml-auto h-9 w-24 rounded-2xl bg-white/10 animate-pulse"></div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
  
              <div class="flex flex-col gap-3 border-t border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                <p class="text-xs text-slate-400">
                  Página <span class="font-semibold text-slate-200">{{ page }}</span> de
                  <span class="font-semibold text-slate-200">{{ totalPages }}</span>
                </p>
  
                <div class="flex items-center gap-2">
                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 disabled:opacity-50 disabled:hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                    :disabled="page <= 1"
                    @click="page--"
                  >
                    Anterior
                  </button>
                  <button
                    class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 disabled:opacity-50 disabled:hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                    :disabled="page >= totalPages"
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
                      <div class="relative grid place-items-center ring-1 ring-white/10 h-14 w-14 rounded-[20px]" :style="avatarBg(selectedUser.email)">
                        <span class="text-xs font-black tracking-wide text-white/90">{{ initials(selectedUser.name) }}</span>
                        <span class="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"></span>
                      </div>
  
                      <div class="min-w-0">
                        <p class="truncate text-base font-extrabold text-white">{{ selectedUser.name }}</p>
                        <p class="truncate text-xs text-slate-400">{{ selectedUser.email }}</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <span :class="badgeClass(roleTone(selectedUser.role))">{{ selectedUser.role }}</span>
                          <span :class="badgeClass(statusTone(selectedUser.status))">{{ statusLabel(selectedUser.status) }}</span>
                          <span
                            v-if="selectedUser.flags.twoFA"
                            class="inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-100 ring-1 ring-cyan-400/20"
                          >
                            2FA
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
  
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      @click="toast('Invitación enviada (mock)', 'success')"
                    >
                      Enviar invite
                    </button>
                    <button
                      class="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      @click="toast('Editando permisos (mock)', 'info')"
                    >
                      Editar permisos
                    </button>
                  </div>
  
                  <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p class="text-sm font-semibold text-white">Resumen</p>
                    <div class="mt-3 space-y-2 text-sm">
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-xs text-slate-400">Teléfono</span>
                        <span class="text-sm font-semibold text-slate-100">{{ selectedUser.phone }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-xs text-slate-400">Plan</span>
                        <span class="text-sm font-semibold text-slate-100">{{ selectedUser.plan }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-xs text-slate-400">Creado</span>
                        <span class="text-sm font-semibold text-slate-100">{{ fmtDate(selectedUser.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
  
                  <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p class="text-sm font-semibold text-white">Controles rápidos (maqueta)</p>
  
                    <div class="mt-3 space-y-2">
                      <div class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-white">Acceso habilitado</p>
                          <p class="text-xs text-slate-400">Permite iniciar sesión</p>
                        </div>
                        <button
                          class="relative h-8 w-14 rounded-full ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                          :class="selectedUser.status === 'active' ? 'bg-cyan-500/25' : 'bg-black/25'"
                          @click="toggleAccess()"
                        >
                          <span
                            class="absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 transition"
                            :class="selectedUser.status === 'active' ? 'left-7' : 'left-1'"
                          ></span>
                        </button>
                      </div>
  
                      <div class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-white">Forzar cambio de contraseña</p>
                          <p class="text-xs text-slate-400">En el siguiente inicio</p>
                        </div>
                        <button
                          class="relative h-8 w-14 rounded-full ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                          :class="selectedUser.flags.forcePasswordReset ? 'bg-cyan-500/25' : 'bg-black/25'"
                          @click="toggleForceReset()"
                        >
                          <span
                            class="absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 transition"
                            :class="selectedUser.flags.forcePasswordReset ? 'left-7' : 'left-1'"
                          ></span>
                        </button>
                      </div>
  
                      <div class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-white">Requiere 2FA</p>
                          <p class="text-xs text-slate-400">Mayor seguridad</p>
                        </div>
                        <button
                          class="relative h-8 w-14 rounded-full ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                          :class="selectedUser.flags.twoFA ? 'bg-cyan-500/25' : 'bg-black/25'"
                          @click="toggle2FA()"
                        >
                          <span
                            class="absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 transition"
                            :class="selectedUser.flags.twoFA ? 'left-7' : 'left-1'"
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <div class="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p class="text-sm font-semibold text-white">Notas</p>
                    <p class="mt-2 text-sm text-slate-300">{{ selectedUser.notes }}</p>
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
                  <p class="mt-1 text-xs text-slate-400">Verás detalles, acciones y controles rápidos aquí.</p>
                </div>
              </aside>
            </Transition>
          </div>
        </div>
      </section>
  
      <!-- Invite modal (sin blur; perf-layer para evitar jank) -->
      <Transition name="pop">
        <div v-if="inviteModal" class="fixed inset-0 z-50 grid place-items-center p-4 perf-layer">
          <div class="absolute inset-0 bg-black/60" @click="inviteModal = false"></div>
  
          <div class="relative w-full max-w-xl rounded-[28px] border border-white/10 bg-[#070a1d] p-5 shadow-xl shadow-black/30">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Invitar usuario</p>
                <h2 class="text-xl font-extrabold text-white">Nuevo registro</h2>
                <p class="mt-1 text-sm text-slate-400">Esta es una maqueta. Aquí después conectas el POST real.</p>
              </div>
  
              <button
                class="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-200 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                @click="inviteModal = false"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <p class="mb-1.5 text-xs font-semibold text-slate-200">Nombre</p>
                <input
                  v-model="draft.name"
                  class="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="Ej. Luis Vivia"
                />
              </div>
  
              <div>
                <p class="mb-1.5 text-xs font-semibold text-slate-200">Correo</p>
                <input
                  v-model="draft.email"
                  class="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="correo@dominio.com"
                />
              </div>
  
              <div>
                <p class="mb-1.5 text-xs font-semibold text-slate-200">Rol</p>
                <select
                  v-model="draft.role"
                  class="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option>Usuario</option>
                  <option>Capitán</option>
                  <option>Staff</option>
                  <option>Admin</option>
                </select>
              </div>
  
              <div>
                <p class="mb-1.5 text-xs font-semibold text-slate-200">Plan</p>
                <select
                  v-model="draft.plan"
                  class="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option>Free</option>
                  <option>Pro</option>
                  <option>League+</option>
                </select>
              </div>
  
              <div class="md:col-span-2">
                <p class="mb-1.5 text-xs font-semibold text-slate-200">Mensaje (opcional)</p>
                <textarea
                  v-model="draft.message"
                  rows="3"
                  class="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="Ej. Hola, ya tienes acceso a la consola…"
                />
              </div>
            </div>
  
            <div class="mt-5 flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between">
              <button
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                @click="inviteModal = false"
              >
                Cancelar
              </button>
  
              <div class="flex items-center gap-2">
                <button
                  class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                  @click="toast('Guardado como borrador (mock)', 'info')"
                >
                  Guardar borrador
                </button>
                <button
                  class="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  @click="submitInvite"
                >
                  Enviar invitación
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Toasts -->
      <div class="fixed bottom-4 right-4 z-[60] w-full max-w-sm space-y-2 px-4 perf-layer">
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
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
  
  type Status = 'active' | 'pending' | 'suspended'
  type Role = 'Admin' | 'Staff' | 'Capitán' | 'Usuario'
  
  type User = {
    id: number
    name: string
    email: string
    phone: string
    role: Role
    status: Status
    plan: 'Free' | 'Pro' | 'League+'
    createdAt: string
    notes: string
    flags: { verified: boolean; twoFA: boolean; forcePasswordReset: boolean }
  }
  
  const users = ref<User[]>([
    {
      id: 101,
      name: 'Luis Vivia',
      email: 'luis@tochero5.mx',
      phone: '+52 55 1200 8899',
      role: 'Admin',
      status: 'active',
      plan: 'League+',
      createdAt: isoDaysAgo(180),
      notes: 'Admin principal. Acceso completo a módulos y auditoría.',
      flags: { verified: true, twoFA: true, forcePasswordReset: false },
    },
    {
      id: 102,
      name: 'Gustavo González',
      email: 'gustavo@tochero5.mx',
      phone: '+52 55 3001 2211',
      role: 'Staff',
      status: 'active',
      plan: 'Pro',
      createdAt: isoDaysAgo(72),
      notes: 'Staff de operación: capturas, validaciones y soporte a capitanes.',
      flags: { verified: true, twoFA: false, forcePasswordReset: false },
    },
    {
      id: 103,
      name: 'María Fernanda',
      email: 'mariaf@club.mx',
      phone: '+52 55 9090 1010',
      role: 'Capitán',
      status: 'pending',
      plan: 'Free',
      createdAt: isoDaysAgo(3),
      notes: 'Invitación enviada. Falta confirmar correo.',
      flags: { verified: false, twoFA: false, forcePasswordReset: false },
    },
    {
      id: 104,
      name: 'Carlos Rivera',
      email: 'carlos.r@equipo.mx',
      phone: '+52 55 7777 1212',
      role: 'Usuario',
      status: 'active',
      plan: 'Free',
      createdAt: isoDaysAgo(28),
      notes: 'Usuario estándar. Acceso a resultados y estadísticas.',
      flags: { verified: true, twoFA: false, forcePasswordReset: false },
    },
    {
      id: 105,
      name: 'Sofía Jiménez',
      email: 'sofia@liga.mx',
      phone: '+52 55 4321 9999',
      role: 'Staff',
      status: 'suspended',
      plan: 'Pro',
      createdAt: isoDaysAgo(220),
      notes: 'Cuenta suspendida por política interna (maqueta).',
      flags: { verified: true, twoFA: false, forcePasswordReset: true },
    },
    ...seedMore(26),
  ])
  
  const query = ref('')
  const statusFilter = ref<'all' | Status>('all')
  const roleFilter = ref<'all' | Role>('all')
  const sortKey = ref<'createdDesc' | 'nameAsc' | 'roleAsc'>('createdDesc')
  
  const page = ref(1)
  const pageSize = ref(10)
  const isLoading = ref(false)
  
  const selectedIds = ref<Set<number>>(new Set())
  const selectedUserId = ref<number | null>(null)
  
  const inviteModal = ref(false)
  const draft = reactive({
    name: '',
    email: '',
    role: 'Usuario' as Role,
    plan: 'Free' as 'Free' | 'Pro' | 'League+',
    message: '',
  })
  
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
  
  const filteredSorted = computed(() => {
    const q = query.value.trim().toLowerCase()
    let list = users.value.slice()
  
    if (statusFilter.value !== 'all') list = list.filter(u => u.status === statusFilter.value)
    if (roleFilter.value !== 'all') list = list.filter(u => u.role === roleFilter.value)
  
    if (q) {
      list = list.filter(u => {
        const hay = `${u.name} ${u.email} ${u.role} ${u.phone} ${statusLabel(u.status)} ${u.plan}`.toLowerCase()
        return hay.includes(q)
      })
    }
  
    switch (sortKey.value) {
      case 'nameAsc':
        list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        break
      case 'roleAsc':
        list.sort((a, b) => a.role.localeCompare(b.role, 'es'))
        break
      default:
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
    return list
  })
  
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredSorted.value.length / pageSize.value)))
  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredSorted.value.slice(start, start + pageSize.value)
  })
  
  watch([query, statusFilter, roleFilter, sortKey], () => {
    page.value = 1
    if (selectedUserId.value && !filteredSorted.value.some(u => u.id === selectedUserId.value)) {
      selectedUserId.value = null
    }
  })
  
  watch(page, () => {
    if (page.value > totalPages.value) page.value = totalPages.value
    if (page.value < 1) page.value = 1
  })
  
  const selectedUser = computed(() => {
    if (!selectedUserId.value) return null
    return users.value.find(u => u.id === selectedUserId.value) || null
  })
  
  const allOnPageSelected = computed(() => {
    const ids = paginated.value.map(u => u.id)
    if (ids.length === 0) return false
    return ids.every(id => selectedIds.value.has(id))
  })
  
  function openUser(id: number) {
    selectedUserId.value = id
  }
  function closeUser() {
    selectedUserId.value = null
  }
  function clearSelection() {
    selectedIds.value = new Set()
  }
  
  function onRowSelectChange(e: Event, id: number) {
    const checked = (e.target as HTMLInputElement).checked
    const s = new Set(selectedIds.value)
    if (checked) s.add(id)
    else s.delete(id)
    selectedIds.value = s
  }
  
  function onSelectAllChange(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    const s = new Set(selectedIds.value)
    for (const u of paginated.value) {
      if (checked) s.add(u.id)
      else s.delete(u.id)
    }
    selectedIds.value = s
  }
  
  function clearAll() {
    query.value = ''
    statusFilter.value = 'all'
    roleFilter.value = 'all'
    sortKey.value = 'createdDesc'
    clearSelection()
    toast('Filtros reiniciados', 'info')
  }
  
  function fakeExport() {
    toast('Export generado (mock). Conecta el endpoint cuando quieras.', 'success')
  }
  
  function openInviteModal() {
    inviteModal.value = true
    draft.name = ''
    draft.email = ''
    draft.role = 'Usuario'
    draft.plan = 'Free'
    draft.message = ''
  }
  
  function submitInvite() {
    inviteModal.value = false
    toast('Invitación enviada (mock)', 'success')
    if (!draft.name.trim() || !draft.email.trim()) return
  
    users.value.unshift({
      id: Math.floor(Math.random() * 90000) + 1000,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      phone: '+52 55 0000 0000',
      role: draft.role as Role,
      status: 'pending',
      plan: draft.plan,
      createdAt: new Date().toISOString(),
      notes: 'Nuevo registro creado desde la consola (maqueta).',
      flags: { verified: false, twoFA: false, forcePasswordReset: false },
    })
  }
  
  function toggleAccess() {
    if (!selectedUser.value) return
    selectedUser.value.status = selectedUser.value.status === 'active' ? 'suspended' : 'active'
    toast(
      selectedUser.value.status === 'active' ? 'Acceso habilitado (mock)' : 'Acceso deshabilitado (mock)',
      selectedUser.value.status === 'active' ? 'success' : 'danger',
    )
  }
  function toggleForceReset() {
    if (!selectedUser.value) return
    selectedUser.value.flags.forcePasswordReset = !selectedUser.value.flags.forcePasswordReset
    toast('Forzar cambio de contraseña (mock)', 'info')
  }
  function toggle2FA() {
    if (!selectedUser.value) return
    selectedUser.value.flags.twoFA = !selectedUser.value.flags.twoFA
    toast('Ajuste 2FA (mock)', 'info')
  }
  
  function chipClass(active: boolean) {
    return [
      'rounded-2xl px-3 py-2 text-xs font-semibold ring-1 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
      active ? 'bg-cyan-500/15 text-cyan-100 ring-cyan-400/20' : 'bg-black/20 text-slate-200 ring-white/10 hover:bg-black/30',
    ]
  }
  
  function badgeClass(tone: string) {
    const map: Record<string, string> = {
      success: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20',
      warn: 'bg-amber-500/10 text-amber-200 ring-amber-400/20',
      danger: 'bg-red-500/10 text-red-200 ring-red-400/20',
      cyan: 'bg-cyan-500/10 text-cyan-200 ring-cyan-400/20',
      indigo: 'bg-indigo-500/10 text-indigo-200 ring-indigo-400/20',
      purple: 'bg-purple-500/10 text-purple-200 ring-purple-400/20',
      slate: 'bg-white/5 text-slate-200 ring-white/10',
    }
    return ['inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', map[tone] || map.slate]
  }
  
  function statusLabel(s: Status) {
    return s === 'active' ? 'Activo' : s === 'pending' ? 'Pendiente' : 'Suspendido'
  }
  function statusTone(s: Status) {
    return s === 'active' ? 'success' : s === 'pending' ? 'warn' : 'danger'
  }
  function roleTone(r: Role) {
    return r === 'Admin' ? 'indigo' : r === 'Staff' ? 'cyan' : r === 'Capitán' ? 'purple' : 'slate'
  }
  
  function fmtDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
  }
  
  function toastIconWrap(tone: ToastTone) {
    return tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/20'
      : tone === 'danger'
        ? 'bg-red-500/10 text-red-100 ring-red-400/20'
        : 'bg-cyan-500/10 text-cyan-100 ring-cyan-400/20'
  }
  
  function initials(name: string) {
    const n = (name || '').trim()
    if (!n) return 'U'
    const parts = n.split(/\s+/).slice(0, 2)
    return parts.map(p => p[0]?.toUpperCase()).join('')
  }
  
  function avatarHue(seed: string) {
    const s = (seed || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const hues = [190, 210, 240, 265, 285]
    return hues[s % hues.length] ?? 210
  }
  function avatarBg(seed: string) {
    const h = avatarHue(seed)
    return {
      background: `linear-gradient(135deg, hsla(${h}, 90%, 60%, .25), hsla(${(h + 50) % 360}, 90%, 60%, .18))`,
    }
  }
  
  const stats = computed(() => {
    const icon = {
      users: 'M16 21a4 4 0 00-8 0M12 11a4 4 0 100-8 4 4 0 000 8zM20 21a6 6 0 00-9-5.2',
      captain: 'M12 2l3 7h7l-5.5 4 2.1 7L12 16l-6.6 4 2.1-7L2 9h7l3-7z',
      shield: 'M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z',
    }
    return [
      { label: 'Usuarios', value: users.value.length, hint: 'Total en el sistema', iconPath: icon.users },
      { label: 'Capitanes', value: users.value.filter(u => u.role === 'Capitán').length, hint: 'Administran equipo', iconPath: icon.captain },
      { label: 'Admins', value: users.value.filter(u => u.role === 'Admin').length, hint: 'Acceso total', iconPath: icon.shield },
    ]
  })
  
  // ⌘K handler
  function onKeydown(e: KeyboardEvent) {
    const isMac = navigator.platform.toLowerCase().includes('mac')
    const cmdk = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
    if (cmdk) {
      e.preventDefault()
      const el = document.querySelector<HTMLInputElement>('input[placeholder^="Buscar"]')
      el?.focus()
      toast('Búsqueda rápida', 'info')
    }
  }
  onMounted(() => window.addEventListener('keydown', onKeydown, { passive: true } as any))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown as any))
  
  function isoDaysAgo(days: number) {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }
  
  function seedMore(n: number): User[] {
    const first = ['Diego', 'Valeria', 'Jorge', 'Ana', 'Mateo', 'Diana', 'Pablo', 'Regina', 'Kevin', 'Camila', 'Héctor', 'Renata']
    const last = ['Luna', 'Sánchez', 'Ortega', 'Núñez', 'Ramos', 'Cruz', 'Vega', 'Mendoza', 'Herrera', 'Castillo']
    const roles: Role[] = ['Usuario', 'Capitán', 'Staff', 'Usuario', 'Usuario']
    const statuses: Status[] = ['active', 'active', 'pending', 'active', 'suspended']
  
    const arr: User[] = []
    for (let i = 0; i < n; i++) {
      const f = first[i % first.length] ?? 'Jugador'
      const l = last[(i * 3) % last.length] ?? 'Demo'
      const name = `${f} ${l}`
      const email = `${name.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@demo.mx`
  
      const role: Role = roles[i % roles.length] ?? 'Usuario'
      const status: Status = statuses[i % statuses.length] ?? 'active'
  
      arr.push({
        id: 200 + i,
        name,
        email,
        phone: `+52 55 ${String(1000 + i).padStart(4, '0')} ${String(2000 + (i * 7) % 9000).padStart(4, '0')}`,
        role,
        status,
        plan: (i % 9 === 0 ? 'League+' : i % 3 === 0 ? 'Pro' : 'Free') as any,
        createdAt: isoDaysAgo(5 + (i * 9) % 260),
        notes:
          role === 'Capitán'
            ? 'Capitán: administra roster y galería (maqueta).'
            : role === 'Staff'
              ? 'Staff: soporte y operación (maqueta).'
              : 'Usuario estándar (maqueta).',
        flags: {
          verified: status !== 'pending',
          twoFA: i % 6 === 0,
          forcePasswordReset: status === 'suspended',
        },
      })
    }
    return arr
  }
  </script>
  
  <style scoped>
  /* ✅ Esto es lo que termina de quitar el “tirón” al iniciar scroll:
     - 1 sola capa de background (sin blur/filter)
     - promote a compositor (translateZ)
     - contain paint para aislar repaints */
  .perf-layer {
    transform: translateZ(0);
    will-change: transform;
    contain: paint;
  }
  
  /* Background ultra-ligero (sin blur). */
  .bg-lite {
    background:
      radial-gradient(circle at 12% 10%, rgba(34, 211, 238, 0.14), transparent 46%),
      radial-gradient(circle at 88% 92%, rgba(99, 102, 241, 0.14), transparent 48%),
      radial-gradient(ellipse at top, rgba(56, 189, 248, 0.06), transparent 56%),
      radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.06), transparent 56%);
  }
  
  /* Vignette muy barata para profundidad */
  .vignette {
    background: radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%);
  }
  
  /* Transiciones */
  .fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  
  .slide-enter-active, .slide-leave-active { transition: transform .22s ease, opacity .22s ease; }
  .slide-enter-from, .slide-leave-to { transform: translateY(8px); opacity: 0; }
  
  .pop-enter-active, .pop-leave-active { transition: transform .18s ease, opacity .18s ease; }
  .pop-enter-from, .pop-leave-to { transform: scale(.98); opacity: 0; }
  
  .lift-enter-active, .lift-leave-active { transition: transform .18s ease, opacity .18s ease; }
  .lift-enter-from, .lift-leave-to { transform: translateY(10px); opacity: 0; }
  
  .toast-enter-active, .toast-leave-active { transition: transform .18s ease, opacity .18s ease; }
  .toast-enter-from, .toast-leave-to { transform: translateY(10px); opacity: 0; }
  
  ::-webkit-scrollbar { height: 10px; width: 10px; }
  ::-webkit-scrollbar-thumb { background: rgba(148,163,184,.22); border-radius: 999px; }
  ::-webkit-scrollbar-track { background: rgba(15,23,42,.2); }
  </style>
  