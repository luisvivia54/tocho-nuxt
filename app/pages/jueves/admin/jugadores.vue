<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        <!-- Header -->
        <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">
              Consola Admin · Liga de Jueves
            </p>

            <div class="mt-1 flex flex-wrap items-center gap-2">
              <h1 class="text-3xl font-extrabold text-white">
                Jugadores (Admin)
              </h1>

              <span
                class="inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold"
                :class="
                  authOk
                    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                    : 'border-red-400/25 bg-red-400/10 text-red-200'
                "
              >
                {{ authOk ? 'Sesión activa' : 'Sin sesión' }}
              </span>
            </div>

            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Información personal, asignación de equipo y edición rápida. (No estadísticas)
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400 px-4 py-2 text-xs font-semibold text-[#1a1207] transition hover:bg-orange-300"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-40"
              :disabled="pendingAny || filteredCurps.length === 0"
              @click="downloadCurpPdf"
              title="Descarga las CURP y nombres que aparecen con los filtros actuales"
            >
              ⬇ CURP (PDF)
              <span class="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">
                {{ filteredCurps.length }}
              </span>
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-40"
              :disabled="pendingAny || filteredCurps.length === 0"
              @click="downloadCurpExcel"
              title="Descarga las CURP en CSV listo para abrir en Excel (UTF-8 + separador ;)"
            >
              ⬇ CURP (Excel)
              <span class="ml-2 inline-flex items-center rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] font-bold text-emerald-50">
                {{ filteredCurps.length }}
              </span>
            </button>
          </div>
        </header>

        <!-- Notice -->
        <div
          v-if="notice.text"
          class="mt-4 rounded-2xl border px-4 py-3 text-sm"
          :class="noticeClass"
        >
          {{ notice.text }}
        </div>

        <!-- Filtros -->
        <section class="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
            <!-- Equipo -->
            <div class="md:col-span-4">
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Equipo
              </label>

              <div class="relative">
                <select
                  v-model="teamPick"
                  class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  :disabled="teamsPending"
                >
                  <option value="ALL">Todos</option>
                  <option
                    v-for="t in teamsVm"
                    :key="t.teamId"
                    :value="String(t.teamId)"
                  >
                    {{ t.name }}
                  </option>
                </select>

                <button
                  v-if="teamPick !== 'ALL'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-slate-300 hover:bg-white/10"
                  @click="clearTeam"
                  aria-label="Quitar filtro de equipo"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Rama -->
            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rama (code)
              </label>

              <div class="relative">
                <select
                  v-model="selectedRama"
                  class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  :disabled="categoriesPending"
                >
                  <option value="all">Todas</option>
                  <option
                    v-for="code in ramaOptions"
                    :key="code"
                    :value="code"
                  >
                    {{ code }}
                  </option>
                </select>

                <button
                  v-if="selectedRama !== 'all'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-slate-300 hover:bg-white/10"
                  @click="clearRama"
                  aria-label="Quitar filtro de rama"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Categoría -->
            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Categoría (gender)
              </label>

              <div class="relative">
                <select
                  v-model="selectedCategoria"
                  class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  :disabled="categoriesPending"
                >
                  <option value="all">Todas</option>
                  <option
                    v-for="g in categoriaOptions"
                    :key="g"
                    :value="g"
                  >
                    {{ niceGender(g) }}
                  </option>
                </select>

                <button
                  v-if="selectedCategoria !== 'all'"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-slate-300 hover:bg-white/10"
                  @click="clearCategoria"
                  aria-label="Quitar filtro de categoría"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Buscar -->
            <div class="md:col-span-4">
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Buscar (nombre / curp / correo / tel / equipo)
              </label>

              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-500">
                  🔍
                </span>

                <input
                  v-model.trim="q"
                  placeholder="Ej. Paolo, CAAJ..., @gmail, 55..., Halcones..."
                  class="w-full rounded-xl border border-white/10 bg-[#0B1020] py-2 pl-8 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400/60"
                />

                <button
                  v-if="q.trim()"
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-slate-300 hover:bg-white/10"
                  @click="clearSearch"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="md:col-span-12 flex items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-400">
                Mostrando
                <span class="font-semibold text-white">{{ filteredPlayers.length }}</span>
                jugador(es)
              </p>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                @click="clearFilters"
              >
                Limpiar filtros
              </button>
            </div>

            <!-- Chips -->
            <div class="md:col-span-12 flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span class="text-slate-500">Estado:</span>

              <span
                v-if="teamPick !== 'ALL'"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Equipo:
                <strong class="text-white">{{ teamPickLabel }}</strong>
                <button type="button" class="text-slate-400 hover:text-white" @click="clearTeam">✕</button>
              </span>

              <span
                v-if="selectedRama !== 'all'"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Rama:
                <strong class="text-white">{{ selectedRama }}</strong>
                <button type="button" class="text-slate-400 hover:text-white" @click="clearRama">✕</button>
              </span>

              <span
                v-if="selectedCategoria !== 'all'"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Categoría:
                <strong class="text-white">{{ niceGender(selectedCategoria) }}</strong>
                <button type="button" class="text-slate-400 hover:text-white" @click="clearCategoria">✕</button>
              </span>

              <span
                v-if="q.trim()"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Búsqueda:
                <strong class="text-white">“{{ q.trim() }}”</strong>
                <button type="button" class="text-slate-400 hover:text-white" @click="clearSearch">✕</button>
              </span>

              <span v-if="categoriesErr" class="text-amber-300">
                No se pudo cargar el catálogo de categorías. El listado de jugadores sigue funcionando.
              </span>
            </div>
          </div>
        </section>

        <!-- Estados -->
        <div
          v-if="pendingAny"
          class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
        >
          Cargando jugadores...
        </div>

        <div
          v-else-if="errorAny"
          class="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <p class="font-semibold">Error cargando jugadores/equipos.</p>
          <p class="mt-1 whitespace-pre-wrap break-words text-xs text-red-100">
            {{ safeErrSummary }}
          </p>
        </div>

        <!-- Contenido -->
        <div v-else class="mt-4">
          <!-- MOBILE -->
          <div class="space-y-3 md:hidden">
            <article
              v-for="p in pagedPlayers"
              :key="p.id"
              class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.30)]"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex items-start gap-3">
                  <div class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      v-if="p.photoUrl"
                      :src="p.photoUrl"
                      :alt="p.fullName"
                      class="h-full w-full object-cover"
                    />
                    <span v-else class="text-[12px] font-extrabold text-orange-300">
                      {{ initials(p.fullName) }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <p class="truncate font-semibold text-white">
                      {{ p.fullName }}
                    </p>

                    <p class="mt-0.5 truncate text-xs text-slate-400">
                      {{ p.teamName || '—' }}
                      <span v-if="p.number != null" class="text-slate-500"> · #{{ p.number }}</span>
                    </p>

                    <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span class="inline-flex items-center rounded-full bg-orange-400/10 px-2 py-1 font-semibold text-orange-200 ring-1 ring-orange-400/20">
                        {{ p.code || '—' }}
                      </span>
                      <span class="inline-flex items-center rounded-full bg-white/5 px-2 py-1 font-semibold text-slate-200 ring-1 ring-white/10">
                        {{ niceGender(p.gender || '—') }}
                      </span>
                    </div>

                    <p class="mt-2 truncate text-[11px] text-slate-500">
                      CURP:
                      <span class="font-semibold text-slate-300">{{ p.curp || '—' }}</span>
                    </p>

                    <p class="truncate text-[11px] text-slate-500">
                      Tel:
                      <span class="font-semibold text-slate-300">{{ p.phone || '—' }}</span>
                      <span class="text-slate-600"> · </span>
                      Email:
                      <span class="font-semibold text-slate-300">{{ p.email || '—' }}</span>
                    </p>
                  </div>
                </div>

                <button
                  class="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  @click="openDrawer(p)"
                >
                  Editar
                </button>
              </div>

              <div class="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span class="inline-flex items-center rounded-full bg-white/5 px-2 py-1 font-semibold text-slate-300 ring-1 ring-white/10">
                  Nac: {{ p.birthDate || '—' }}
                </span>
              </div>
            </article>
          </div>

          <!-- DESKTOP -->
          <div class="hidden overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:block">
            <table class="min-w-[1280px] w-full text-sm">
              <thead>
                <tr class="border-b border-white/10 text-left text-slate-400">
                  <th class="px-3 py-3">Jugador</th>
                  <th class="px-3 py-3">Equipo</th>
                  <th class="px-3 py-3">#</th>
                  <th class="px-3 py-3">Rama (code)</th>
                  <th class="px-3 py-3">Categoría (gender)</th>
                  <th class="px-3 py-3">CURP</th>
                  <th class="px-3 py-3">Teléfono</th>
                  <th class="px-3 py-3">Email</th>
                  <th class="px-3 py-3">Nac.</th>
                  <th class="px-3 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="p in pagedPlayers"
                  :key="p.id"
                  class="border-b border-white/5 transition hover:bg-white/[0.04]"
                >
                  <td class="px-3 py-3">
                    <div class="flex min-w-0 items-center gap-3">
                      <div class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <img
                          v-if="p.photoUrl"
                          :src="p.photoUrl"
                          :alt="p.fullName"
                          class="h-full w-full object-cover"
                        />
                        <span v-else class="text-[12px] font-extrabold text-orange-300">
                          {{ initials(p.fullName) }}
                        </span>
                      </div>

                      <div class="min-w-0">
                        <p class="max-w-[340px] truncate font-semibold text-white">
                          {{ p.fullName }}
                        </p>
                        <p class="max-w-[340px] truncate text-[11px] text-slate-500">
                          ID: {{ p.id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-3 text-slate-200">{{ p.teamName || '—' }}</td>
                  <td class="px-3 py-3 text-slate-200">{{ p.number ?? '—' }}</td>

                  <td class="px-3 py-3">
                    <span class="inline-flex items-center rounded-full bg-orange-400/10 px-2 py-0.5 text-xs font-semibold text-orange-200 ring-1 ring-orange-400/20">
                      {{ p.code || '—' }}
                    </span>
                  </td>

                  <td class="px-3 py-3">
                    <span class="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                      {{ niceGender(p.gender || '—') }}
                    </span>
                  </td>

                  <td class="px-3 py-3 text-slate-300">{{ p.curp || '—' }}</td>
                  <td class="px-3 py-3 text-slate-300">{{ p.phone || '—' }}</td>
                  <td class="px-3 py-3 text-slate-300">{{ p.email || '—' }}</td>
                  <td class="px-3 py-3 text-slate-300">{{ p.birthDate || '—' }}</td>

                  <td class="px-3 py-3 text-right">
                    <button
                      class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                      @click="openDrawer(p)"
                    >
                      Editar
                    </button>
                  </td>
                </tr>

                <tr v-if="pagedPlayers.length === 0">
                  <td colspan="10" class="px-3 py-4 text-sm text-slate-400">
                    No hay jugadores que coincidan con los filtros.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="text-[11px] text-slate-400">
              Mostrando
              <span class="font-semibold text-white">{{ rangeLabel }}</span>
              de
              <span class="font-semibold text-white">{{ filteredPlayers.length }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                :disabled="page <= 1"
                @click="page = Math.max(1, page - 1)"
              >
                ←
              </button>

              <span class="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-200 ring-1 ring-white/10">
                Página {{ page }} / {{ totalPages }}
              </span>

              <button
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
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
        <div class="absolute inset-0 bg-black/60" @click="closeDrawer" />

        <aside class="absolute right-0 top-0 h-full w-full border-l border-white/10 bg-[#0A0F1E] shadow-2xl sm:w-[520px]">
          <div class="flex h-full flex-col">
            <div class="flex items-start justify-between gap-3 border-b border-white/10 p-5">
              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">
                  Editar jugador
                </p>
                <h2 class="mt-1 truncate text-2xl font-extrabold text-white">
                  {{ draft.fullName || 'Jugador' }}
                </h2>
                <p class="mt-1 truncate text-sm text-slate-400">
                  {{ draft.teamName || 'Sin equipo' }}
                  <span v-if="draft.number != null" class="text-slate-600"> · #{{ draft.number }}</span>
                </p>
              </div>

              <button
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                @click="closeDrawer"
              >
                Cerrar
              </button>
            </div>

            <div class="flex-1 overflow-auto p-5">
              <div class="grid grid-cols-1 gap-4">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Nombre completo
                    </label>
                    <input
                      v-model.trim="draft.fullName"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Número
                    </label>
                    <input
                      v-model.number="draft.number"
                      inputmode="numeric"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                      placeholder="Ej. 10"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      CURP
                    </label>
                    <input
                      v-model.trim="draft.curp"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fecha de nacimiento
                    </label>
                    <input
                      v-model.trim="draft.birthDate"
                      type="date"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Teléfono
                    </label>
                    <input
                      v-model.trim="draft.phone"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </label>
                    <input
                      v-model.trim="draft.email"
                      type="email"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Categoría (gender)
                    </label>
                    <select
                      v-model="draft.gender"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    >
                      <option value="">—</option>
                      <option value="VARONIL">Varonil</option>
                      <option value="FEMENIL">Femenil</option>
                      <option value="MIXTO">Mixto</option>
                    </select>
                  </div>

                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Equipo
                    </label>
                    <select
                      v-model="draft.teamId"
                      class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    >
                      <option :value="null">—</option>
                      <option
                        v-for="t in teamsVm"
                        :key="t.teamId"
                        :value="t.teamId"
                      >
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Foto URL
                  </label>
                  <input
                    v-model.trim="draft.photoUrl"
                    class="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    placeholder="https://..."
                  />
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
                  <p class="font-semibold text-slate-200">Qué se guarda:</p>
                  <p class="mt-1">
                    Nombre, número, CURP, fecha nac., tel, email, categoría (gender), teamId y fotoUrl.
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-white/10 p-5">
              <button
                class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                :disabled="saving"
                @click="closeDrawer"
              >
                Cancelar
              </button>

              <button
                class="rounded-xl border border-orange-400/30 bg-orange-400 px-4 py-2 text-xs font-semibold text-[#1a1207] transition hover:bg-orange-300 disabled:opacity-50"
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
import JuevesHeader from '~/components/jueves/JuevesHeader.vue'

type HeadersMap = Record<string, string>

type TeamVM = {
  teamId: number
  name: string
  code: string | null
  gender: string | null
  leagueId: number | null
  seasonId: number | null
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

const JUEVES_LEAGUE_ID = 2
const JUEVES_SEASON_ID = 3

const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()

function normalizeApiBase(v: string) {
  const s = String(v || '').trim().replace(/\/+$/, '')
  if (!s) return 'https://tocho5-api.tochero5.mx/api'
  return s.endsWith('/api') ? s : `${s}/api`
}

const API_BASE = normalizeApiBase(
  ((config.public as Record<string, unknown>)?.apiBase as string) || 'https://tocho5-api.tochero5.mx'
)
const API_TEAMS = `${API_BASE}/teams`
const API_TEAMS_LIST = `${API_BASE}/teams/list`
const API_CATEGORIES = `${API_BASE}/categories`

/* =========================
   AUTH
========================= */
const authOk = ref(false)

function getKeycloakClient(): { source: string; client: unknown } | null {
  const app = nuxtApp as unknown as Record<string, unknown>

  const candidates: Array<{ source: string; client: unknown }> = [
    { source: '$kc', client: app['$kc'] },
    { source: '$keycloak', client: app['$keycloak'] },
    { source: '$keycloakClient', client: app['$keycloakClient'] }
  ]

  for (const c of candidates) {
    if (c.client) return c
  }

  return null
}

async function getAccessToken(): Promise<string | null> {
  const app = nuxtApp as unknown as Record<string, unknown>
  const kcWrap = getKeycloakClient()

  if (kcWrap?.client) {
    const kc = kcWrap.client as Record<string, unknown>

    try {
      const updateToken = kc['updateToken']
      if (typeof updateToken === 'function') {
        await updateToken(30)
      }
    } catch {}

    const t = kc['token']
    if (typeof t === 'string' && t.length > 20) return t
  }

  const kcGetToken = app['$kcGetToken']
  if (typeof kcGetToken === 'function') {
    try {
      const t = await kcGetToken()
      if (typeof t === 'string' && t.length > 20) return t
    } catch {}
  }

  const getToken = app['$getToken']
  if (typeof getToken === 'function') {
    try {
      const t = await getToken()
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

    await new Promise((resolve) => setTimeout(resolve, 120))
  }

  return null
}

async function authHeaders(json = false): Promise<HeadersMap> {
  const token = await waitForToken()
  const h: HeadersMap = {}

  if (json) h['Content-Type'] = 'application/json'
  if (token) h.Authorization = `Bearer ${token}`

  return h
}

/* =========================
   Helpers
========================= */
function unwrapList<T>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[]

  if (x && typeof x === 'object') {
    const obj = x as Record<string, unknown>
    if (Array.isArray(obj.content)) return obj.content as T[]
    if (Array.isArray(obj.items)) return obj.items as T[]
    if (Array.isArray(obj.data)) return obj.data as T[]
  }

  return []
}

function toNum(v: unknown) {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  return Number(v) || 0
}

function toNumOrNull(v: unknown): number | null {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() || '').join('')
}

function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}

function safeErr(e: unknown) {
  if (!e) return ''

  const err = e as Record<string, unknown>
  const status = err['status'] || err['statusCode']
  const message = err['message'] || String(e)

  return [
    status ? `status: ${String(status)}` : '',
    message ? `message: ${String(message)}` : ''
  ]
    .filter(Boolean)
    .join('\n')
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

/* =========================
   Categories
========================= */
const {
  data: categoriesData,
  pending: categoriesPending,
  error: categoriesErr,
  refresh: refreshCategories
} = useAsyncData(
  'admin-jueves-players-categories',
  async () => {
    const h = await authHeaders(false)

    try {
      const raw = await $fetch<unknown>(API_CATEGORIES, {
        query: { leagueId: JUEVES_LEAGUE_ID },
        headers: Object.keys(h).length ? h : undefined
      })
      return unwrapList<CategoryDto>(raw)
    } catch {
      const raw = await $fetch<unknown>(API_CATEGORIES, {
        query: { leagueId: JUEVES_LEAGUE_ID }
      })
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

/* =========================
   Teams
========================= */
const {
  data: teamsData,
  pending: teamsPending,
  error: teamsErr,
  refresh: refreshTeams
} = useAsyncData(
  'admin-jueves-players-teams',
  async () => {
    const h = await authHeaders(false)

    try {
      const raw = await $fetch<unknown>(API_TEAMS_LIST, {
        query: { leagueId: JUEVES_LEAGUE_ID },
        headers: Object.keys(h).length ? h : undefined
      })
      return unwrapList<Record<string, unknown>>(raw)
    } catch {
      try {
        const raw2 = await $fetch<unknown>(API_TEAMS_LIST, {
          query: { leagueId: JUEVES_LEAGUE_ID }
        })
        return unwrapList<Record<string, unknown>>(raw2)
      } catch {
        const raw3 = await $fetch<unknown>(API_TEAMS, {
          query: { leagueId: JUEVES_LEAGUE_ID },
          headers: Object.keys(h).length ? h : undefined
        })
        return unwrapList<Record<string, unknown>>(raw3)
      }
    }
  },
  { default: () => [], server: false }
)

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<Record<string, unknown>>(teamsData.value)
  const out = new Map<number, TeamVM>()

  for (const x of list) {
    const category = (x['category'] as Record<string, unknown> | undefined) || undefined

    const codeVal =
      category?.['code'] ??
      x['categoryCode'] ??
      x['code'] ??
      x['category_code'] ??
      null

    const genderVal =
      category?.['gender'] ??
      x['gender'] ??
      x['categoryGender'] ??
      x['category_gender'] ??
      null

    const teamId = Number(x['teamId'] ?? x['team_id'] ?? x['id'])
    if (!Number.isFinite(teamId)) continue

    const leagueId = toNumOrNull(
      x['leagueId'] ??
      x['league_id'] ??
      (x['league'] as Record<string, unknown> | undefined)?.['league_id'] ??
      (x['league'] as Record<string, unknown> | undefined)?.['leagueId'] ??
      (x['league'] as Record<string, unknown> | undefined)?.['id']
    )

    const seasonId = toNumOrNull(
      x['seasonId'] ??
      x['season_id'] ??
      (x['season'] as Record<string, unknown> | undefined)?.['id']
    )

    // Filtro solo por leagueId. Si el backend no devuelve liga, lo dejamos pasar.
    const leagueOk = leagueId === null || leagueId === JUEVES_LEAGUE_ID
    if (!leagueOk) continue

    // Solo equipos activos: respeta soft-delete (isActive:false) hecho en /admin/equipos
    const activeRaw = x['isActive'] ?? x['is_active'] ?? x['active'] ?? x['enabled']
    const statusStr = String(x['status'] ?? '').toUpperCase()

    let isActive = true
    if (typeof activeRaw === 'boolean') {
      isActive = activeRaw
    } else if (typeof activeRaw === 'string') {
      const a = activeRaw.toUpperCase()
      if (a === 'FALSE' || a === '0' || a === 'NO' || a === 'INACTIVE' || a === 'DISABLED') isActive = false
      else if (a === 'TRUE' || a === '1' || a === 'YES' || a === 'ACTIVE' || a === 'ENABLED') isActive = true
    } else if (typeof activeRaw === 'number') {
      isActive = activeRaw !== 0
    } else if (statusStr) {
      if (statusStr === 'INACTIVE' || statusStr === 'DISABLED' || statusStr === 'DELETED') isActive = false
      else if (statusStr === 'ACTIVE' || statusStr === 'ENABLED') isActive = true
    }

    if (!isActive) continue

    out.set(teamId, {
      teamId,
      name: String(x['name'] ?? x['teamName'] ?? 'Equipo'),
      code: codeVal ? String(codeVal).toUpperCase() : null,
      gender: genderVal ? String(genderVal).toUpperCase() : null,
      leagueId,
      seasonId
    })
  }

  return Array.from(out.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const teamById = computed(() => {
  const map = new Map<number, TeamVM>()
  for (const t of teamsVm.value) map.set(t.teamId, t)
  return map
})

const validTeamIds = computed(() => new Set(teamsVm.value.map((t) => t.teamId)))

/* =========================
   Players
========================= */
async function fetchPlayersByTeams(): Promise<Record<string, unknown>[]> {
  const h = await authHeaders(false)

  if (!h.Authorization) {
    throw new Error('No se pudo obtener sesión')
  }

  const teamIds = teamsVm.value
    .map((t) => t.teamId)
    .filter((n) => Number.isFinite(n))

  if (!teamIds.length) return []

  const out: Record<string, unknown>[] = []
  const batchSize = 6

  for (let i = 0; i < teamIds.length; i += batchSize) {
    const batch = teamIds.slice(i, i + batchSize)

    const rows = await Promise.all(
      batch.map(async (tid) => {
        try {
          const raw = await $fetch<unknown>(`${API_TEAMS}/${tid}/players`, {
            headers: h
          })

          return unwrapList<Record<string, unknown>>(raw).map((p) => ({
            ...p,
            __teamId: tid
          }))
        } catch {
          return [] as Record<string, unknown>[]
        }
      })
    )

    out.push(...rows.flat())
  }

  return out
}

const {
  data: playersData,
  pending: playersPending,
  error: playersErr,
  refresh: refreshPlayers
} = useAsyncData(
  'admin-jueves-players-all',
  async () => {
    return await fetchPlayersByTeams()
  },
  {
    default: () => [],
    server: false
  }
)

watch(
  () => teamsVm.value.map((t) => t.teamId).join(','),
  async (ids, oldIds) => {
    if (ids !== oldIds) {
      await refreshPlayers()
    }
  }
)

const playersVm = computed<PlayerVM[]>(() => {
  const list = unwrapList<Record<string, unknown>>(playersData.value)

  return list
    .map((x) => {
      const team = (x['team'] as Record<string, unknown> | undefined) || undefined
      const category = (x['category'] as Record<string, unknown> | undefined) || undefined
      const teamCategory = (team?.['category'] as Record<string, unknown> | undefined) || undefined

      const id = Number(x['playerId'] ?? x['player_id'] ?? x['id'])

      const firstName = x['firstName'] ?? x['first_name']
      const lastName = x['lastName'] ?? x['last_name']

      const fullName =
        String(
          x['fullName'] ??
            x['full_name'] ??
            x['name'] ??
            [firstName, lastName].filter(Boolean).join(' ')
        ).trim() || 'Jugador'

      const numberRaw = x['number'] ?? x['jerseyNumber'] ?? x['jersey_number'] ?? x['num'] ?? null
      const number = numberRaw == null ? null : toNum(numberRaw)

      const teamIdRaw =
        x['teamId'] ??
        x['team_id'] ??
        team?.['teamId'] ??
        team?.['id'] ??
        x['__teamId'] ??
        null

      const teamId = teamIdRaw == null ? null : Number(teamIdRaw) || null
      const t = teamId != null ? teamById.value.get(teamId) : undefined

      const teamNameFromApi = String(x['teamName'] ?? x['team_name'] ?? team?.['name'] ?? '').trim()
      const teamName = teamNameFromApi || t?.name || null

      const codeVal =
        category?.['code'] ??
        x['categoryCode'] ??
        x['code'] ??
        teamCategory?.['code'] ??
        team?.['categoryCode'] ??
        team?.['code'] ??
        null

      const genderVal =
        category?.['gender'] ??
        x['gender'] ??
        x['categoryGender'] ??
        teamCategory?.['gender'] ??
        team?.['gender'] ??
        team?.['categoryGender'] ??
        null

      const curp = x['curp'] ?? x['CURP'] ?? null
      const phone = x['phone'] ?? x['telefono'] ?? x['tel'] ?? null
      const email = x['email'] ?? x['correo'] ?? null

      const bd =
        x['birthDate'] ??
        x['birth_date'] ??
        x['birthdate'] ??
        x['fechaNacimiento'] ??
        x['fecha_nacimiento'] ??
        null

      const birthDate = bd ? String(bd).slice(0, 10) : null
      const photoUrl = x['photoUrl'] ?? x['photo_url'] ?? x['photo'] ?? x['avatarUrl'] ?? null

      return {
        id,
        fullName,
        number,
        photoUrl: photoUrl ? String(photoUrl) : null,
        teamId,
        teamName,
        code: codeVal ? String(codeVal).toUpperCase() : (t?.code ?? null),
        gender: genderVal ? String(genderVal).toUpperCase() : (t?.gender ?? null),
        curp: curp ? String(curp) : null,
        phone: phone ? String(phone) : null,
        email: email ? String(email) : null,
        birthDate
      }
    })
    .filter((p) => Number.isFinite(p.id))
    .filter((p) => p.teamId != null && validTeamIds.value.has(p.teamId))
})

/* =========================
   Filters
========================= */
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

/* =========================
   Pagination
========================= */
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

/* =========================
   PDF CURP
========================= */
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
    const autoTableMod = await import('jspdf-autotable')
    const autoTable = (autoTableMod as any).default || autoTableMod

    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const dateStr = ymdLocal(new Date())

    doc.setFontSize(16)
    doc.text('Listado de CURP (Jugadores · Jueves Admin · Liga 2 / Temp 3)', 40, 48)

    doc.setFontSize(10)
    const filtros = [
      teamPick.value !== 'ALL' ? `Equipo: ${teamPickLabel.value}` : 'Equipo: Todos',
      selectedRama.value !== 'all' ? `Rama: ${selectedRama.value}` : 'Rama: Todas',
      selectedCategoria.value !== 'all' ? `Categoría: ${niceGender(selectedCategoria.value)}` : 'Categoría: Todas',
      q.value.trim() ? `Búsqueda: "${q.value.trim()}"` : null,
      `Liga: ${JUEVES_LEAGUE_ID}`,
      `Temporada: ${JUEVES_SEASON_ID}`,
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
        const currentPageInfo = (doc as any).getCurrentPageInfo?.()
        const pageNum = currentPageInfo?.pageNumber || 1

        doc.setFontSize(9)
        doc.text(
          `Página ${pageNum} / ${pageCount}`,
          doc.internal.pageSize.getWidth() - 110,
          doc.internal.pageSize.getHeight() - 18
        )
      }
    })

    const namePart = sanitizeFileName(teamPick.value !== 'ALL' ? teamPickLabel.value : 'Todos')
    doc.save(`CURP_Jueves_L${JUEVES_LEAGUE_ID}_S${JUEVES_SEASON_ID}_${namePart}_${dateStr}.pdf`)
    setNotice('ok', `PDF generado: ${rows.length} CURP`)
  } catch (e) {
    console.error(e)
    setNotice('err', 'No se pudo generar el PDF. Revisa consola.')
  }
}

/* =========================
   CSV CURP (importable a Excel)
========================= */
function csvEscape(v: unknown) {
  const s = v == null ? '' : String(v)
  // Excel: si el valor contiene ; , " salto de línea, lo entrecomillamos
  // y duplicamos comillas internas.
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

    // Encabezados
    const header = ['#', 'Nombre', 'CURP', 'Equipo'].map(csvEscape).join(sep)

    // Filas
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
    const fileName = `CURP_Jueves_L${JUEVES_LEAGUE_ID}_S${JUEVES_SEASON_ID}_${namePart}_${dateStr}.csv`

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Liberar memoria del blob
    window.setTimeout(() => URL.revokeObjectURL(url), 1500)

    setNotice('ok', `CSV generado: ${rows.length} CURP (listo para Excel)`)
  } catch (e) {
    console.error(e)
    setNotice('err', 'No se pudo generar el CSV. Revisa consola.')
  }
}

/* =========================
   Drawer + Save
========================= */
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
  if (notice.value.type === 'ok') {
    return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
  }

  if (notice.value.type === 'err') {
    return 'border-red-400/20 bg-red-500/10 text-red-200'
  }

  return 'border-white/10 bg-white/5 text-slate-200'
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

    const payload = {
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
        await $fetch(url, {
          method: 'PUT',
          headers: h,
          body: payload
        })
        ok = true
        break
      } catch (ePut) {
        const errPut = ePut as Record<string, unknown>
        const st = errPut['status'] || errPut['statusCode']

        if (st === 404) continue

        try {
          await $fetch(url, {
            method: 'PATCH',
            headers: h,
            body: payload
          })
          ok = true
          break
        } catch (ePatch) {
          const errPatch = ePatch as Record<string, unknown>
          const st2 = errPatch['status'] || errPatch['statusCode']

          if (st2 === 404) continue
          throw ePatch
        }
      }
    }

    if (!ok) {
      setNotice('err', 'No se pudo actualizar el jugador.')
      return
    }

    await refreshPlayers()

    if (draft.value.teamId != null) {
      const t = teamById.value.get(draft.value.teamId)
      draft.value.teamName = t?.name || null
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

/* =========================
   Status / refresh
========================= */
const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

const safeErrSummary = computed(() => {
  const a = safeErr(teamsErr.value)
  const b = safeErr(playersErr.value)
  return [a, b].filter(Boolean).join('\n\n')
})

async function refreshAll() {
  setNotice('info', 'Refrescando...')
  await refreshCategories()
  await refreshTeams()
  await refreshPlayers()
  setNotice('ok', 'Listo.')
}

onMounted(async () => {
  const token = await getAccessToken()
  authOk.value = !!token
})
</script>