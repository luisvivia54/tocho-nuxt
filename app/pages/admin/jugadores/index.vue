<!-- app/pages/admin/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#F3F4FF] text-slate-900">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6 pb-10">
        <!-- Header -->
        <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Consola Admin</p>

            <div class="mt-1 flex flex-wrap items-center gap-2">
              <h1 class="font-display text-3xl font-extrabold text-slate-900">
                Jugadores (Admin)
              </h1>

              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="authOk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
              >
                {{ authOk ? 'Sesión activa' : 'Sin sesión' }}
              </span>
            </div>

            <p class="mt-2 text-slate-600 max-w-2xl">
              Información personal, asignación de equipo y edición rápida. (No estadísticas)
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              :disabled="pendingAny || filteredCurps.length === 0"
              @click="downloadCurpPdf"
              title="Descarga las CURP y nombres que aparecen con los filtros actuales"
            >
              ⬇ CURP (PDF)
              <span class="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                {{ filteredCurps.length }}
              </span>
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40"
              :disabled="pendingAny || filteredCurps.length === 0"
              @click="downloadCurpExcel"
              title="Descarga las CURP en CSV listo para abrir en Excel (UTF-8 + separador ;)"
            >
              ⬇ CURP (Excel)
              <span class="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                {{ filteredCurps.length }}
              </span>
            </button>
          </div>
        </header>

        <!-- Notice -->
        <div v-if="notice.text" class="mt-4 rounded-2xl border px-4 py-3 text-sm" :class="noticeClass">
          {{ notice.text }}
        </div>

        <!-- Filtros -->
        <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="md:col-span-4">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Equipo
              </label>

              <div class="relative">
                <select
                  v-model="teamPick"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="teamsPending"
                >
                  <option value="ALL">Todos</option>
                  <option v-for="t in teamsVm" :key="t.teamId" :value="String(t.teamId)">
                    {{ t.name }}
                  </option>
                </select>

                <button
                  v-if="teamPick !== 'ALL'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs hover:bg-slate-50"
                  @click="clearTeam"
                  aria-label="Quitar filtro de equipo"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Rama (code)
              </label>

              <div class="relative">
                <select
                  v-model="selectedRama"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="categoriesPending"
                >
                  <option value="all">Todas</option>
                  <option v-for="code in ramaOptions" :key="code" :value="code">
                    {{ code }}
                  </option>
                </select>

                <button
                  v-if="selectedRama !== 'all'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs hover:bg-slate-50"
                  @click="clearRama"
                  aria-label="Quitar filtro de rama"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Categoría (gender)
              </label>

              <div class="relative">
                <select
                  v-model="selectedCategoria"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="categoriesPending"
                >
                  <option value="all">Todas</option>
                  <option v-for="g in categoriaOptions" :key="g" :value="g">
                    {{ niceGender(g) }}
                  </option>
                </select>

                <button
                  v-if="selectedCategoria !== 'all'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs hover:bg-slate-50"
                  @click="clearCategoria"
                  aria-label="Quitar filtro de categoría"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="md:col-span-4">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Buscar (nombre / curp / correo / tel / equipo)
              </label>

              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  🔍
                </span>
                <input
                  v-model.trim="q"
                  placeholder="Ej. Paolo, CAAJ..., @gmail, 55..., Halcones..."
                  class="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  v-if="q.trim()"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs hover:bg-slate-50"
                  @click="clearSearch"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="md:col-span-12 flex items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-500">
                Mostrando <span class="font-semibold text-slate-900">{{ filteredPlayers.length }}</span> jugador(es)
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <div class="md:col-span-12 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span class="text-slate-400">Estado:</span>

              <span
                v-if="teamPick !== 'ALL'"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
              >
                Equipo: <strong class="text-slate-900">{{ teamPickLabel }}</strong>
                <button type="button" class="text-slate-500 hover:text-slate-900" @click="clearTeam">✕</button>
              </span>

              <span
                v-if="selectedRama !== 'all'"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
              >
                Rama: <strong class="text-slate-900">{{ selectedRama }}</strong>
                <button type="button" class="text-slate-500 hover:text-slate-900" @click="clearRama">✕</button>
              </span>

              <span
                v-if="selectedCategoria !== 'all'"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
              >
                Categoría:
                <strong class="text-slate-900">{{ niceGender(selectedCategoria) }}</strong>
                <button type="button" class="text-slate-500 hover:text-slate-900" @click="clearCategoria">✕</button>
              </span>

              <span
                v-if="q.trim()"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
              >
                Búsqueda: <strong class="text-slate-900">“{{ q.trim() }}”</strong>
                <button type="button" class="text-slate-500 hover:text-slate-900" @click="clearSearch">✕</button>
              </span>

              <span v-if="categoriesErr" class="text-amber-700">
                No se pudo cargar el catálogo de categorías (opciones de filtro). El listado de jugadores sigue funcionando.
              </span>
            </div>
          </div>
        </section>

        <!-- Estados -->
        <div v-if="pendingAny" class="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Cargando jugadores...
        </div>

        <div
          v-else-if="errorAny"
          class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p class="font-semibold">Error cargando jugadores/equipos.</p>
          <p class="mt-1 text-xs text-red-800 whitespace-pre-wrap break-words">
            {{ safeErrSummary }}
          </p>
        </div>

        <!-- Contenido -->
        <div v-else class="mt-4">
          <!-- MOBILE cards -->
          <div class="md:hidden space-y-3">
            <article
              v-for="p in pagedPlayers"
              :key="p.id"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex items-center gap-3">
                  <div class="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                    <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.fullName" class="h-full w-full object-cover" />
                    <span v-else class="text-[12px] font-extrabold text-slate-700">{{ initials(p.fullName) }}</span>
                  </div>

                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 truncate">{{ p.fullName }}</p>
                    <p class="mt-0.5 text-xs text-slate-600 truncate">
                      {{ p.teamName || '—' }}
                      <span v-if="p.number != null" class="text-slate-400"> · #{{ p.number }}</span>
                    </p>

                    <div class="mt-1 flex flex-wrap gap-2 text-[11px]">
                      <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                        {{ p.code || '—' }}
                      </span>
                      <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                        {{ niceGender(p.gender || '—') }}
                      </span>
                    </div>

                    <p class="mt-2 text-[11px] text-slate-500 truncate">
                      CURP: <span class="font-semibold text-slate-700">{{ p.curp || '—' }}</span>
                    </p>
                    <p class="text-[11px] text-slate-500 truncate">
                      Tel: <span class="font-semibold text-slate-700">{{ p.phone || '—' }}</span>
                      <span class="text-slate-400"> · </span>
                      Email: <span class="font-semibold text-slate-700">{{ p.email || '—' }}</span>
                    </p>
                  </div>
                </div>

                <button
                  class="shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="openDrawer(p)"
                >
                  Editar
                </button>
              </div>

              <div class="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                  Nac: {{ p.birthDate || '—' }}
                </span>
              </div>
            </article>
          </div>

          <!-- DESKTOP table -->
          <div class="hidden md:block rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-x-auto">
            <table class="min-w-[1280px] w-full text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b border-slate-200/80">
                  <th class="px-3 py-2">Jugador</th>
                  <th class="px-3 py-2">Equipo</th>
                  <th class="px-3 py-2">#</th>
                  <th class="px-3 py-2">Rama (code)</th>
                  <th class="px-3 py-2">Categoría (gender)</th>
                  <th class="px-3 py-2">CURP</th>
                  <th class="px-3 py-2">Teléfono</th>
                  <th class="px-3 py-2">Email</th>
                  <th class="px-3 py-2">Nac.</th>
                  <th class="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="p in pagedPlayers"
                  :key="p.id"
                  class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td class="px-3 py-2">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                        <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.fullName" class="h-full w-full object-cover" />
                        <span v-else class="text-[12px] font-extrabold text-slate-700">{{ initials(p.fullName) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-900 truncate max-w-[340px]">
                          {{ p.fullName }}
                        </p>
                        <p class="text-[11px] text-slate-500 truncate max-w-[340px]">
                          ID: {{ p.id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-2 text-slate-800">{{ p.teamName || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.number ?? '—' }}</td>

                  <td class="px-3 py-2">
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {{ p.code || '—' }}
                    </span>
                  </td>

                  <td class="px-3 py-2">
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {{ niceGender(p.gender || '—') }}
                    </span>
                  </td>

                  <td class="px-3 py-2 text-slate-800">{{ p.curp || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.phone || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.email || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.birthDate || '—' }}</td>

                  <td class="px-3 py-2 text-right">
                    <button
                      class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      @click="openDrawer(p)"
                    >
                      Editar
                    </button>
                  </td>
                </tr>

                <tr v-if="pagedPlayers.length === 0">
                  <td colspan="10" class="px-3 py-3 text-sm text-slate-500">
                    No hay jugadores que coincidan con los filtros.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="text-[11px] text-slate-500">
              Mostrando <span class="font-semibold text-slate-900">{{ rangeLabel }}</span>
              de <span class="font-semibold text-slate-900">{{ filteredPlayers.length }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                :disabled="page <= 1"
                @click="page = Math.max(1, page - 1)"
              >
                ←
              </button>

              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                Página {{ page }} / {{ totalPages }}
              </span>

              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                :disabled="page >= totalPages"
                @click="page = Math.min(totalPages, page + 1)"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-2"
    >
      <div v-if="drawerOpen" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-black/40" @click="closeDrawer" />

        <aside class="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl border-l border-slate-200">
          <div class="h-full flex flex-col">
            <div class="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Editar jugador</p>
                <h2 class="mt-1 font-display text-2xl font-extrabold text-slate-900 truncate">
                  {{ draft.fullName || 'Jugador' }}
                </h2>
                <p class="mt-1 text-sm text-slate-600 truncate">
                  {{ draft.teamName || 'Sin equipo' }}
                  <span v-if="draft.number != null" class="text-slate-400"> · #{{ draft.number }}</span>
                </p>
              </div>

              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="closeDrawer"
              >
                Cerrar
              </button>
            </div>

            <div class="p-5 overflow-auto flex-1">
              <div class="grid grid-cols-1 gap-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Nombre completo</label>
                    <input
                      v-model.trim="draft.fullName"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Número</label>
                    <input
                      v-model.number="draft.number"
                      inputmode="numeric"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej. 10"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">CURP</label>
                    <input
                      v-model.trim="draft.curp"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Fecha de nacimiento</label>
                    <input
                      v-model.trim="draft.birthDate"
                      type="date"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Teléfono</label>
                    <input
                      v-model.trim="draft.phone"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Email</label>
                    <input
                      v-model.trim="draft.email"
                      type="email"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Categoría (gender)</label>
                    <select
                      v-model="draft.gender"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">—</option>
                      <option value="VARONIL">Varonil</option>
                      <option value="FEMENIL">Femenil</option>
                      <option value="MIXTO">Mixto</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Equipo</label>
                    <select
                      v-model="draft.teamId"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option :value="null">—</option>
                      <option v-for="t in teamsVm" :key="t.teamId" :value="t.teamId">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Foto URL</label>
                  <input
                    v-model.trim="draft.photoUrl"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                  <p class="font-semibold text-slate-700">Qué se guarda:</p>
                  <p class="mt-1">
                    Nombre, número, CURP, fecha nac., tel, email, categoría (gender), teamId y fotoUrl.
                  </p>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                :disabled="saving"
                @click="closeDrawer"
              >
                Cancelar
              </button>

              <button
                class="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                :disabled="saving || !draft.id"
                @click="savePlayer"
              >
                {{ saving ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRuntimeConfig, useAsyncData, useNuxtApp } from '#imports'

const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()

function normalizeApiBase(v: string) {
  const s = String(v || '').trim().replace(/\/+$/, '')
  if (!s) return 'https://tocho5-api.tochero5.mx/api'
  return s.endsWith('/api') ? s : `${s}/api`
}

const API_BASE = normalizeApiBase(((config.public as any)?.apiBase as string) || 'https://tocho5-api.tochero5.mx')
const API_TEAMS = `${API_BASE}/teams`
const API_TEAMS_LIST = `${API_BASE}/teams/list`
const API_CATEGORIES = `${API_BASE}/categories`

const authOk = ref(false)

function getKeycloakClient(): { source: string; client: any } | null {
  const app: any = nuxtApp as any
  const candidates = [
    { source: '$kc', client: app.$kc },
    { source: '$keycloak', client: app.$keycloak },
    { source: '$keycloakClient', client: app.$keycloakClient }
  ]
  for (const c of candidates) if (c.client) return c
  return null
}

async function getAccessToken(): Promise<string | null> {
  const app: any = nuxtApp as any

  const kcWrap = getKeycloakClient()
  if (kcWrap?.client) {
    const kc: any = kcWrap.client
    try {
      if (kc.updateToken) await kc.updateToken(30)
    } catch {}
    const t = kc.token
    if (typeof t === 'string' && t.length > 20) return t
  }

  if (typeof app.$kcGetToken === 'function') {
    try {
      const t = await app.$kcGetToken()
      if (typeof t === 'string' && t.length > 20) return t
    } catch {}
  }

  if (typeof app.$getToken === 'function') {
    try {
      const t = await app.$getToken()
      if (typeof t === 'string' && t.length > 20) return t
    } catch {}
  }

  return null
}

async function waitForToken(maxMs = 2500) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    const token = await getAccessToken()
    authOk.value = !!token
    if (token) return token
    await new Promise((r) => setTimeout(r, 120))
  }
  return null
}

type HeadersMap = Record<string, string>

async function authHeaders(json = false): Promise<HeadersMap> {
  const token = await waitForToken()
  const h: HeadersMap = {}
  if (json) h['Content-Type'] = 'application/json'
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  return []
}

const toNum = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}

function safeErr(e: any) {
  if (!e) return ''
  const status = e?.status || e?.statusCode
  const msg = e?.message || String(e)
  return [status ? `status: ${status}` : '', msg ? `message: ${msg}` : ''].filter(Boolean).join('\n')
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr.slice()]
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function ymdLocal(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function sanitizeFileName(s: string) {
  return String(s || '')
    .trim()
    .replace(/[^\w\-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80)
}

type TeamVM = {
  teamId: number
  name: string
  code: string | null
  gender: string | null
}

type PlayerVM = {
  id: number
  fullName: string
  number: number | null
  photoUrl: string | null
  teamId: number | null
  teamName: string | null
  code: string | null
  gender: string | null
  curp: string | null
  phone: string | null
  email: string | null
  birthDate: string | null
}

type CategoryDto = {
  id: number
  name: string
  code: string
  gender: string
}

const {
  data: categoriesData,
  pending: categoriesPending,
  error: categoriesErr
} = useAsyncData(
  'admin-players-categories',
  async () => {
    const h = await authHeaders(false)
    try {
      const raw = await $fetch<any>(API_CATEGORIES, { headers: Object.keys(h).length ? h : undefined })
      return unwrapList<CategoryDto>(raw)
    } catch {
      const raw = await $fetch<any>(API_CATEGORIES)
      return unwrapList<CategoryDto>(raw)
    }
  },
  { default: () => [], server: false }
)

const ramaOptions = computed(() => {
  const arr = unwrapList<CategoryDto>(categoriesData.value)
  const set = new Set<string>()
  for (const c of arr) {
    if (c?.code) set.add(String(c.code).toUpperCase())
  }
  return Array.from(set).sort()
})

const categoriaOptions = computed(() => {
  const arr = unwrapList<CategoryDto>(categoriesData.value)
  const set = new Set<string>()
  for (const c of arr) {
    if (c?.gender) set.add(String(c.gender).toUpperCase())
  }
  return Array.from(set).sort()
})

const { data: teamsData, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'admin-players-teams',
  async () => {
    const h = await authHeaders(false)

    try {
      const raw = await $fetch<any>(API_TEAMS_LIST, { headers: Object.keys(h).length ? h : undefined })
      return unwrapList<any>(raw)
    } catch {
      try {
        const raw2 = await $fetch<any>(API_TEAMS_LIST)
        return unwrapList<any>(raw2)
      } catch {
        const raw3 = await $fetch<any>(API_TEAMS, { headers: Object.keys(h).length ? h : undefined })
        return unwrapList<any>(raw3)
      }
    }
  },
  { default: () => [], server: false }
)

function isTeamActive(x: any): boolean {
  // Respeta soft-delete (isActive:false) hecho en /admin/equipos.
  const activeRaw = x?.isActive ?? x?.is_active ?? x?.active ?? x?.enabled
  const statusStr = String(x?.status ?? '').toUpperCase()

  if (typeof activeRaw === 'boolean') return activeRaw
  if (typeof activeRaw === 'string') {
    const a = activeRaw.toUpperCase()
    if (a === 'FALSE' || a === '0' || a === 'NO' || a === 'INACTIVE' || a === 'DISABLED') return false
    if (a === 'TRUE' || a === '1' || a === 'YES' || a === 'ACTIVE' || a === 'ENABLED') return true
  }
  if (typeof activeRaw === 'number') return activeRaw !== 0
  if (statusStr === 'INACTIVE' || statusStr === 'DISABLED' || statusStr === 'DELETED') return false
  if (statusStr === 'ACTIVE' || statusStr === 'ENABLED') return true

  // Default: si el backend no devuelve estado, asumimos activo.
  return true
}

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .filter((x) => isTeamActive(x))
    .map((x) => {
      const teamId = Number(x.teamId ?? x.team_id ?? x.id)
      const name = String(x.name ?? x.teamName ?? 'Equipo')

      const codeVal =
        x.category?.code ??
        x.categoryCode ??
        x.code ??
        x.category_code ??
        null

      const genderVal =
        x.category?.gender ??
        x.gender ??
        x.categoryGender ??
        x.category_gender ??
        null

      return {
        teamId,
        name,
        code: codeVal ? String(codeVal).toUpperCase() : null,
        gender: genderVal ? String(genderVal).toUpperCase() : null
      } satisfies TeamVM
    })
    .filter((t) => Number.isFinite(t.teamId))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Sólo equipos activos que existen — usado para descartar jugadores de equipos
// desactivados aunque el endpoint /teams/{id}/players siga devolviendo registros.
const validTeamIds = computed(() => new Set(teamsVm.value.map((t) => t.teamId)))

const teamById = computed(() => {
  const m = new Map<number, TeamVM>()
  for (const t of teamsVm.value) m.set(t.teamId, t)
  return m
})

async function fetchPlayersByTeams(): Promise<any[]> {
  const h = await authHeaders(false)
  if (!h.Authorization) throw new Error('No se pudo obtener sesión')

  const teamIds = teamsVm.value
    .map((t) => t.teamId)
    .filter((n) => Number.isFinite(n))

  if (!teamIds.length) return []

  const chunks = chunkArray(teamIds, 6)
  const out: any[] = []

  for (const group of chunks) {
    const results = await Promise.all(
      group.map(async (tid) => {
        try {
          const raw = await $fetch<any>(`${API_TEAMS}/${tid}/players`, { headers: h })
          const list = unwrapList<any>(raw)
          return list.map((p: any) => ({ ...p, __teamId: tid }))
        } catch {
          return [] as any[]
        }
      })
    )

    out.push(...results.flat())
  }

  return out
}

const { data: playersData, pending: playersPending, error: playersErr, refresh: refreshPlayers } = useAsyncData(
  'admin-players-all',
  async () => await fetchPlayersByTeams(),
  { default: () => [], server: false, watch: [teamsData] }
)

const playersVm = computed<PlayerVM[]>(() => {
  const list = unwrapList<any>(playersData.value)

  return list
    .map((x) => {
      const id = Number(x.playerId ?? x.player_id ?? x.id)

      const fullName =
        String(
          x.fullName ??
            x.full_name ??
            x.name ??
            [x.firstName ?? x.first_name, x.lastName ?? x.last_name].filter(Boolean).join(' ')
        ).trim() || 'Jugador'

      const numberRaw = x.number ?? x.jerseyNumber ?? x.jersey_number ?? x.num ?? null
      const number = numberRaw == null ? null : toNum(numberRaw)

      const teamIdRaw = x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? x.__teamId ?? null
      const teamId = teamIdRaw == null ? null : Number(teamIdRaw) || null

      const t = teamId ? teamById.value.get(teamId) : undefined
      const teamNameFromApi = String(x.teamName ?? x.team_name ?? x.team?.name ?? '').trim()
      const teamName = teamNameFromApi || t?.name || null

      const codeVal =
        x.category?.code ??
        x.categoryCode ??
        x.code ??
        x.team?.category?.code ??
        x.team?.categoryCode ??
        x.team?.code ??
        null

      const code = (codeVal ? String(codeVal).toUpperCase() : (t?.code || null)) ?? null

      const genderVal =
        x.category?.gender ??
        x.gender ??
        x.categoryGender ??
        x.team?.category?.gender ??
        x.team?.gender ??
        x.team?.categoryGender ??
        null

      const gender = (genderVal ? String(genderVal).toUpperCase() : (t?.gender || null)) ?? null

      const curp = x.curp ?? x.CURP ?? null
      const phone = x.phone ?? x.telefono ?? x.tel ?? null
      const email = x.email ?? x.correo ?? null

      const bd = x.birthDate ?? x.birth_date ?? x.birthdate ?? x.fechaNacimiento ?? x.fecha_nacimiento ?? null
      const birthDate = bd ? String(bd).slice(0, 10) : null

      const photoUrl = x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null

      return {
        id,
        fullName,
        number,
        photoUrl: photoUrl ? String(photoUrl) : null,
        teamId,
        teamName,
        code,
        gender,
        curp: curp ? String(curp) : null,
        phone: phone ? String(phone) : null,
        email: email ? String(email) : null,
        birthDate
      } satisfies PlayerVM
    })
    .filter((p) => Number.isFinite(p.id))
    .filter((p) => p.teamId == null || validTeamIds.value.has(p.teamId))
})

const q = ref('')
const teamPick = ref<'ALL' | string>('ALL')
const selectedRama = ref<string>('all')
const selectedCategoria = ref<string>('all')

const teamPickLabel = computed(() => {
  if (teamPick.value === 'ALL') return 'Todos'
  const tid = Number(teamPick.value)
  const t = Number.isFinite(tid) ? teamById.value.get(tid) : undefined
  return t?.name || `Equipo ${teamPick.value}`
})

const filteredPlayers = computed(() => {
  const qq = q.value.trim().toLowerCase()
  const rama = selectedRama.value
  const cat = selectedCategoria.value
  const tPick = teamPick.value

  return playersVm.value.filter((p) => {
    if (tPick !== 'ALL') {
      const tid = Number(tPick)
      if (Number.isFinite(tid) && p.teamId !== tid) return false
    }

    if (rama !== 'all') {
      if ((p.code || '').toUpperCase() !== rama.toUpperCase()) return false
    }

    if (cat !== 'all') {
      if ((p.gender || '').toUpperCase() !== cat.toUpperCase()) return false
    }

    if (qq) {
      const blob = [
        p.fullName,
        p.curp,
        p.phone,
        p.email,
        p.teamName,
        p.code,
        p.gender,
        p.birthDate,
        String(p.number ?? '')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!blob.includes(qq)) return false
    }

    return true
  })
})

const pageSize = 12
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlayers.value.length / pageSize)))

watch([q, selectedRama, selectedCategoria, teamPick], () => {
  page.value = 1
})

watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pageStart = computed(() => (page.value - 1) * pageSize)
const pageEnd = computed(() => Math.min(filteredPlayers.value.length, pageStart.value + pageSize))
const pagedPlayers = computed(() => filteredPlayers.value.slice(pageStart.value, pageEnd.value))

const rangeLabel = computed(() => {
  const total = filteredPlayers.value.length
  if (!total) return '0 - 0'
  return `${pageStart.value + 1} - ${pageEnd.value}`
})

function clearSearch() {
  q.value = ''
  page.value = 1
}

function clearTeam() {
  teamPick.value = 'ALL'
  page.value = 1
}

function clearRama() {
  selectedRama.value = 'all'
  page.value = 1
}

function clearCategoria() {
  selectedCategoria.value = 'all'
  page.value = 1
}

function clearFilters() {
  q.value = ''
  teamPick.value = 'ALL'
  selectedRama.value = 'all'
  selectedCategoria.value = 'all'
  page.value = 1
}

const filteredCurps = computed(() => {
  const base = filteredPlayers.value || []

  const normalized = base
    .map((p) => ({
      fullName: String(p.fullName || '').trim(),
      curp: String(p.curp || '').trim(),
      teamName: String(p.teamName || '').trim()
    }))
    .filter((x) => x.curp.length > 0)

  const seen = new Set<string>()
  const unique = normalized.filter((x) => {
    const k = x.curp.toUpperCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  unique.sort((a, b) => (a.teamName || '').localeCompare(b.teamName || '') || a.fullName.localeCompare(b.fullName))
  return unique
})

async function downloadCurpPdf() {
  try {
    if (typeof window === 'undefined') return

    const rows = filteredCurps.value
    if (!rows.length) {
      setNotice('err', 'No hay CURP en los resultados actuales.')
      return
    }

    const { jsPDF } = await import('jspdf')
    const autoTableMod: any = await import('jspdf-autotable')
    const autoTable = autoTableMod.default || autoTableMod

    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const dateStr = ymdLocal(new Date())

    doc.setFontSize(16)
    doc.text('Listado de CURP (Jugadores)', 40, 48)

    doc.setFontSize(10)
    const filtros = [
      teamPick.value !== 'ALL' ? `Equipo: ${teamPickLabel.value}` : 'Equipo: Todos',
      selectedRama.value !== 'all' ? `Rama: ${selectedRama.value}` : 'Rama: Todas',
      selectedCategoria.value !== 'all' ? `Categoría: ${niceGender(selectedCategoria.value)}` : 'Categoría: Todas',
      q.value.trim() ? `Búsqueda: "${q.value.trim()}"` : null,
      `Total CURP: ${rows.length}`
    ].filter(Boolean) as string[]

    doc.text(`Fecha: ${dateStr}`, 40, 66)
    doc.text(filtros.join(' · '), 40, 82)

    const body = rows.map((r, idx) => [String(idx + 1), r.fullName || '—', r.curp, r.teamName || '—'])

    autoTable(doc, {
      startY: 100,
      head: [['#', 'Nombre', 'CURP', 'Equipo']],
      body,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 220 },
        2: { cellWidth: 170 },
        3: { cellWidth: 140 }
      },
      didDrawPage: () => {
        const pageCount = doc.getNumberOfPages()
        const pageInfo = (doc as any).getCurrentPageInfo?.()
        const pageNum = pageInfo?.pageNumber || 1
        doc.setFontSize(9)
        doc.text(
          `Página ${pageNum} / ${pageCount}`,
          doc.internal.pageSize.getWidth() - 110,
          doc.internal.pageSize.getHeight() - 18
        )
      }
    })

    const namePart = sanitizeFileName(teamPick.value !== 'ALL' ? teamPickLabel.value : 'Todos')
    doc.save(`CURP_${namePart}_${dateStr}.pdf`)
    setNotice('ok', `PDF generado: ${rows.length} CURP`)
  } catch (e) {
    console.error(e)
    setNotice('err', 'No se pudo generar el PDF. Revisa consola.')
  }
}

/* =========================
   CSV CURP (importable a Excel)
========================= */
function csvEscape(v: any) {
  const s = v == null ? '' : String(v)
  // Excel: si el valor contiene ; , " o salto de línea, lo entrecomillamos.
  if (/[;,"\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function downloadCurpExcel() {
  try {
    if (typeof window === 'undefined') return

    const rows = filteredCurps.value
    if (!rows.length) {
      setNotice('err', 'No hay CURP en los resultados actuales.')
      return
    }

    const dateStr = ymdLocal(new Date())
    const sep = ';' // separador estándar para Excel en español

    const header = ['#', 'Nombre', 'CURP', 'Equipo'].map(csvEscape).join(sep)

    const body = rows.map((r, idx) =>
      [String(idx + 1), r.fullName || '', r.curp || '', r.teamName || '']
        .map(csvEscape)
        .join(sep)
    )

    // BOM UTF-8 para que Excel reconozca acentos al abrir directo
    const csv = '﻿' + [header, ...body].join('\r\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const namePart = sanitizeFileName(teamPick.value !== 'ALL' ? teamPickLabel.value : 'Todos')
    const fileName = `CURP_${namePart}_${dateStr}.csv`

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.setTimeout(() => URL.revokeObjectURL(url), 1500)

    setNotice('ok', `CSV generado: ${rows.length} CURP (listo para Excel)`)
  } catch (e) {
    console.error(e)
    setNotice('err', 'No se pudo generar el CSV. Revisa consola.')
  }
}

const drawerOpen = ref(false)
const saving = ref(false)

const draft = ref<PlayerVM>({
  id: 0,
  fullName: '',
  number: null,
  photoUrl: null,
  teamId: null,
  teamName: null,
  code: null,
  gender: null,
  curp: null,
  phone: null,
  email: null,
  birthDate: null
})

function openDrawer(p: PlayerVM) {
  draft.value = JSON.parse(JSON.stringify(p)) as PlayerVM
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

const notice = ref<{ type: 'ok' | 'err' | 'info'; text: string }>({ type: 'info', text: '' })

const noticeClass = computed(() => {
  if (notice.value.type === 'ok') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (notice.value.type === 'err') return 'border-red-200 bg-red-50 text-red-700'
  return 'border-slate-200 bg-white text-slate-700'
})

function setNotice(type: 'ok' | 'err' | 'info', text: string) {
  notice.value = { type, text }
  if (typeof window === 'undefined') return
  window.setTimeout(() => {
    if (notice.value.text === text) {
      notice.value = { type: 'info', text: '' }
    }
  }, 3500)
}

async function savePlayer() {
  if (!draft.value?.id) return
  saving.value = true

  try {
    const h = await authHeaders(true)
    if (!h.Authorization) {
      setNotice('err', 'No hay sesión activa. Vuelve a iniciar sesión.')
      return
    }

    const payload: any = {
      fullName: draft.value.fullName,
      number: draft.value.number,
      jerseyNumber: draft.value.number,
      curp: draft.value.curp,
      phone: draft.value.phone,
      email: draft.value.email,
      birthDate: draft.value.birthDate,
      birthdate: draft.value.birthDate,
      gender: draft.value.gender,
      teamId: draft.value.teamId,
      photoUrl: draft.value.photoUrl
    }

    const updateCandidates = [
      `${API_BASE}/players/${draft.value.id}`,
      `${API_BASE}/player/${draft.value.id}`
    ]

    let ok = false
    for (const url of updateCandidates) {
      try {
        await $fetch(url, { method: 'PUT', headers: h, body: payload })
        ok = true
        break
      } catch (ePut: any) {
        const st = ePut?.status || ePut?.statusCode
        if (st === 404) continue
        try {
          await $fetch(url, { method: 'PATCH', headers: h, body: payload })
          ok = true
          break
        } catch (ePatch: any) {
          const st2 = ePatch?.status || ePatch?.statusCode
          if (st2 === 404) continue
          throw ePatch
        }
      }
    }

    if (!ok) {
      setNotice('err', 'No se pudo actualizar el jugador (ruta de actualización no disponible).')
      return
    }

    await refreshPlayers()

    if (draft.value.teamId) {
      const t = teamById.value.get(draft.value.teamId)
      if (t) draft.value.teamName = t.name
    } else {
      draft.value.teamName = null
    }

    setNotice('ok', 'Jugador actualizado correctamente.')
    drawerOpen.value = false
  } catch {
    setNotice('err', 'No se pudo guardar. Revisa permisos del backend.')
  } finally {
    saving.value = false
  }
}

const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

const safeErrSummary = computed(() => {
  const a = safeErr((teamsErr as any).value)
  const b = safeErr((playersErr as any).value)
  return [a, b].filter(Boolean).join('\n\n')
})

async function refreshAll() {
  setNotice('info', 'Refrescando...')
  await refreshTeams()
  await refreshPlayers()
  setNotice('ok', 'Listo.')
}

onMounted(async () => {
  const token = await getAccessToken()
  authOk.value = !!token
})
</script>