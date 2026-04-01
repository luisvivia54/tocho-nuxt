<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Mi equipo</p>
            <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">Mi equipo</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Aquí verás tus equipos como capitán o admin, podrás registrar equipos y abrir accesos separados para editar equipo o roster.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink
              to="/jueves"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              ← Volver al inicio
            </NuxtLink>

            <button
              v-if="canCreate && panelMode === 'list'"
              type="button"
              class="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110"
              @click="openRegisterPanel"
            >
              Registrar equipo
            </button>

            <button
              v-if="showFormPanel"
              type="button"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              @click="openListPanel"
            >
              Volver a mis equipos
            </button>
          </div>
        </header>

        <div
          v-if="statusMsg"
          class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          {{ statusMsg }}
        </div>

        <div
          v-if="errorMsg"
          class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 whitespace-pre-line"
        >
          {{ errorMsg }}
        </div>

        <div v-if="!kcReady" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Inicializando sesión…</p>
          <p class="mt-1 text-sm text-slate-400">Espera a que Keycloak esté listo.</p>
        </div>

        <div v-else-if="!authOk" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Necesitas iniciar sesión</p>
          <p class="mt-1 text-sm text-slate-400">Debes autenticarte para ver tus equipos.</p>

          <button
            type="button"
            class="mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white"
            @click="login"
          >
            Iniciar sesión
          </button>
        </div>

        <div v-else class="mt-6 space-y-6">
          <!-- RESUMEN SOLO EN MODO LISTA -->
          <section
            v-if="panelMode === 'list'"
            class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Rol</p>
                <p class="mt-2 text-2xl font-extrabold text-white">{{ roleLabel }}</p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Equipos como capitán</p>
                <p class="mt-2 text-2xl font-extrabold text-white">{{ totalTeamsCount }} / {{ effectiveMaxTeams }}</p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">¿Puede crear equipo?</p>
                <p class="mt-2 text-2xl font-extrabold" :class="canCreate ? 'text-emerald-300' : 'text-rose-300'">
                  {{ canCreate ? "Sí" : "No" }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-slate-900"
                >
                  Mis equipos
                </button>

                <button
                  v-if="canCreate"
                  type="button"
                  class="rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 hover:bg-orange-500/15"
                  @click="openRegisterPanel"
                >
                  + Registrar equipo
                </button>
              </div>

              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                :disabled="loadingList"
                @click="loadTeams"
              >
                {{ loadingList ? "Actualizando…" : "Actualizar" }}
              </button>
            </div>
          </section>

          <!-- BARRA COMPACTA EN REGISTRO / EDICIÓN -->
          <section
            v-else
            class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  @click="openListPanel"
                >
                  Mis equipos
                </button>

                <button
                  v-if="canCreate"
                  type="button"
                  class="rounded-xl px-4 py-2 text-sm font-semibold transition"
                  :class="
                    panelMode === 'register'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
                      : 'border border-orange-400/20 bg-orange-500/10 text-orange-100 hover:bg-orange-500/15'
                  "
                  @click="openRegisterPanel"
                >
                  Registrar equipo
                </button>

                <span
                  v-if="panelMode === 'edit' && editingTeamCard"
                  class="rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100"
                >
                  Redirigiendo edición: {{ editingTeamCard.name }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Rol: <span class="font-extrabold text-white">{{ roleLabel }}</span></span>
                <span class="hidden md:inline text-slate-600">•</span>
                <span>Equipos: <span class="font-extrabold text-white">{{ totalTeamsCount }} / {{ effectiveMaxTeams }}</span></span>
              </div>
            </div>
          </section>

          <!-- LISTADO -->
          <section
            v-if="panelMode === 'list'"
            class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div v-if="loadingList" class="text-sm text-slate-400">Cargando tus equipos…</div>

            <div v-else-if="visibleTeams.length === 0" class="rounded-2xl border border-white/10 bg-[#0B1020]/60 p-5">
              <p class="text-lg font-bold text-white">Aún no tienes equipos de jueves</p>
              <p class="mt-2 text-sm text-slate-400">
                Puedes registrar uno nuevo desde esta misma pestaña.
              </p>

              <button
                v-if="canCreate"
                type="button"
                class="mt-4 inline-flex rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white"
                @click="openRegisterPanel"
              >
                Registrar equipo
              </button>
            </div>

            <div v-else class="grid gap-4 md:grid-cols-2">
              <article
                v-for="teamCard in visibleTeams"
                :key="teamCard.id"
                class="rounded-3xl border p-5 transition"
                :class="highlightId === teamCard.id
                  ? 'border-orange-400/40 bg-orange-500/10 shadow-[0_10px_28px_rgba(249,115,22,0.12)]'
                  : 'border-white/10 bg-[#0B1020]/70 hover:bg-[#0D1325]'"
              >
                <div class="flex items-start gap-4">
                  <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08101E]">
                    <img
                      v-if="teamCard.logoUrl"
                      :src="teamCard.logoUrl"
                      :alt="teamCard.name"
                      class="max-h-12 max-w-12 object-contain"
                    />
                    <span v-else class="text-sm font-extrabold text-orange-300">
                      {{ initials(teamCard.name) }}
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-2xl font-extrabold text-white">{{ teamCard.name }}</p>
                    <p class="mt-1 text-sm text-slate-400">
                      ID: {{ teamCard.id }}
                      <span class="text-slate-600">·</span>
                      Liga: {{ teamCard.leagueId ?? "—" }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-if="teamCard.shortName"
                        class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                      >
                        {{ teamCard.shortName }}
                      </span>

                      <span
                        v-if="teamCard.categoryName"
                        class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200"
                      >
                        {{ teamCard.categoryName }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <NuxtLink
                    :to="`/jueves/equipos?highlight=${teamCard.id}`"
                    class="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-orange-100"
                  >
                    Ver equipo
                  </NuxtLink>

                  <NuxtLink
                    :to="buildEditLink(teamCard, 'equipo')"
                    class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Editar equipo
                  </NuxtLink>

                  <NuxtLink
                    :to="buildEditLink(teamCard, 'roster')"
                    class="rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 hover:bg-orange-500/15"
                  >
                    Editar roster
                  </NuxtLink>
                </div>
              </article>
            </div>
          </section>

          <!-- FORM -->
          <div v-else class="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
            <!-- FORM -->
            <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div class="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">
                    Liga de Jueves · {{ panelMode === 'edit' ? 'Editar equipo' : 'Registro' }}
                  </p>
                  <h2 class="mt-2 text-xl font-extrabold text-white">
                    {{ panelMode === "edit" ? "Editar equipo" : "Registro de equipo" }}
                  </h2>
                  <p class="mt-1 text-sm text-slate-400">
                    {{ panelMode === "edit"
                      ? "Actualiza los datos del equipo dentro de esta misma pestaña."
                      : "Registra un equipo nuevo sin salir de Mi equipo." }}
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    :disabled="submitting || uploading || deletingTeam"
                    @click="clearProgress"
                  >
                    {{ panelMode === 'edit' ? 'Restaurar cambios' : 'Borrar progreso' }}
                  </button>

                  <button
                    v-if="panelMode === 'edit' && activeEditTeamId"
                    type="button"
                    class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/15 disabled:opacity-50"
                    :disabled="submitting || uploading || deletingTeam"
                    @click="openDeleteConfirmFromEdit"
                  >
                    {{ deletingTeam ? "Desactivando…" : "Borrar equipo" }}
                  </button>
                </div>
              </div>

              <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
                <div class="md:col-span-8">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre del equipo</label>
                  <input
                    v-model.trim="team.name"
                    type="text"
                    placeholder="Ej. Tigres del Norte"
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div class="md:col-span-4">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre corto</label>
                  <input
                    v-model.trim="team.shortName"
                    type="text"
                    placeholder="Ej. TIG"
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Liga</label>
                  <input
                    :value="LEAGUE_LABEL"
                    disabled
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Temporada</label>
                  <input
                    :value="SEASON_LABEL"
                    disabled
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Categoría</label>
                  <select
                    v-model.number="team.categoryId"
                    :disabled="categoriesLoading"
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60 disabled:opacity-50"
                  >
                    <option :value="0">{{ categoriesLoading ? "Cargando…" : "Selecciona categoría" }}</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      {{ c.name }} · {{ niceGender(c.gender) }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-3">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Rama</label>
                  <input
                    :value="selectedCategory?.code?.toUpperCase() || '—'"
                    disabled
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                  />
                </div>

                <div class="md:col-span-6">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color primario</label>
                  <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                    <input v-model="team.primaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent" />
                    <input v-model.trim="team.primaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#F97316" />
                  </div>
                </div>

                <div class="md:col-span-6">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color secundario</label>
                  <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                    <input v-model="team.secondaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent" />
                    <input v-model.trim="team.secondaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#FFFFFF" />
                  </div>
                </div>

                <div class="md:col-span-8">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Logo del equipo</label>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <input
                      v-model.trim="team.logoUrl"
                      type="text"
                      placeholder="https://... o /img/..."
                      class="flex-1 rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                    />
                    <button
                      type="button"
                      class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
                      :disabled="uploading || deletingTeam"
                      @click="pickLogo"
                    >
                      {{ uploading ? "Subiendo…" : "Elegir archivo" }}
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-slate-500">Sube el logo a R2 y se guarda en el equipo.</p>
                </div>

                <div class="md:col-span-4">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista rápida</label>
                  <div class="flex h-[116px] items-center justify-center rounded-3xl border border-white/10 bg-[#0B1020]">
                    <img v-if="team.logoUrl" :src="team.logoUrl" :alt="team.name || 'Logo'" class="max-h-24 max-w-[120px] object-contain" />
                    <span v-else class="text-sm text-slate-500">Sin logo</span>
                  </div>
                </div>
              </div>

              <!-- PLAYERS -->
              <div class="mt-8 border-t border-white/10 pt-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Integrantes</p>
                    <h3 class="mt-2 text-xl font-extrabold text-white">Jugadores del equipo</h3>
                    <p class="mt-1 text-sm text-slate-400">
                      Solo se envían los que tengan <strong class="text-slate-200">Nombre + CURP + Foto</strong>. Jersey opcional.
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                      Se enviarán: <span class="font-extrabold text-white">{{ validPlayers.length }}</span> / {{ team.players.length }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                    @click="addPlayer"
                  >
                    + Agregar integrante
                  </button>
                </div>

                <div v-if="team.players.length === 0" class="mt-4 rounded-2xl border border-white/10 bg-[#0B1020]/50 px-4 py-4 text-sm text-slate-400">
                  No has agregado integrantes todavía.
                </div>

                <div v-else class="mt-4 space-y-3">
                  <div v-for="(player, index) in team.players" :key="player.id" class="rounded-3xl border border-white/10 bg-[#0B1020]/70 p-4">
                    <div class="mb-3 flex items-center justify-between gap-3">
                      <p class="text-sm font-bold text-white">Jugador {{ index + 1 }}</p>
                      <button
                        type="button"
                        class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/15"
                        @click="removePlayer(index)"
                      >
                        Quitar
                      </button>
                    </div>

                    <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
                      <div class="md:col-span-5">
                        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre completo</label>
                        <input v-model.trim="player.fullName" type="text" placeholder="Nombre del jugador" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60" />
                      </div>

                      <div class="md:col-span-4">
                        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">CURP</label>
                        <input v-model.trim="player.curp" type="text" placeholder="CURP" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 uppercase outline-none transition focus:border-orange-400/60" />
                      </div>

                      <div class="md:col-span-3">
                        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Jersey</label>
                        <input v-model.trim="player.jerseyNumber" type="text" placeholder="Opcional" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60" />
                      </div>

                      <div class="md:col-span-8">
                        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Foto del jugador</label>
                        <p class="mb-2 text-xs text-slate-500">Sin foto, este integrante no se enviará.</p>
                        <input
                          type="file"
                          accept="image/*"
                          class="block w-full text-xs text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-white/15"
                          @change="onPlayerPhotoChange(index, $event)"
                        />
                      </div>

                      <div class="md:col-span-4">
                        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista previa</label>
                        <div class="flex h-[72px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08101E]">
                          <img
                            v-if="player.photoPreview"
                            :src="player.photoPreview"
                            alt="Foto"
                            class="h-full w-full object-cover"
                          />
                          <span v-else class="text-xs text-slate-500">Sin foto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Se enviarán <span class="font-extrabold text-white">{{ validPlayers.length }}</span> integrante(s) completos.
                </div>
              </div>

              <div class="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  :disabled="submitting || uploading || deletingTeam"
                  @click="clearProgress"
                >
                  {{ panelMode === 'edit' ? 'Restaurar cambios' : 'Borrar progreso' }}
                </button>

                <button
                  v-if="panelMode === 'edit' && activeEditTeamId"
                  type="button"
                  class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 hover:bg-rose-500/15 disabled:opacity-50"
                  :disabled="submitting || uploading || deletingTeam"
                  @click="openDeleteConfirmFromEdit"
                >
                  {{ deletingTeam ? "Desactivando…" : "Borrar equipo" }}
                </button>

                <button
                  type="button"
                  class="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110 disabled:opacity-50"
                  :disabled="submitting || uploading || deletingTeam"
                  @click="submitTeam"
                >
                  {{ submitting ? "Guardando…" : submitLabel }}
                </button>
              </div>
            </section>

            <!-- PREVIEW -->
            <aside class="space-y-5">
              <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Vista previa</p>
                <h3 class="mt-2 text-xl font-extrabold text-white">Resumen del equipo</h3>

                <div class="mt-5 rounded-3xl border border-white/10 bg-[#081122] p-5">
                  <div class="flex items-start gap-4">
                    <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]">
                      <img v-if="team.logoUrl" :src="team.logoUrl" :alt="team.name || 'Logo'" class="max-h-16 max-w-16 object-contain" />
                      <span v-else class="text-xs text-slate-500">Logo</span>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-2xl font-extrabold text-white">{{ team.name || "Nombre del equipo" }}</p>
                      <p class="mt-1 text-sm text-slate-400">{{ team.shortName || "Sin nombre corto" }}</p>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <span class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200">
                          {{ selectedCategory?.name || "Sin categoría" }}
                        </span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                          {{ selectedCategory?.code?.toUpperCase() || "—" }}
                        </span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                          {{ selectedCategory ? niceGender(selectedCategory.gender) : "—" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-5 grid grid-cols-2 gap-3">
                    <div class="rounded-2xl border border-white/10 bg-[#0B1020] p-3">
                      <p class="text-[11px] uppercase tracking-wide text-slate-500">Color primario</p>
                      <div class="mt-2 flex items-center gap-3">
                        <span class="h-5 w-5 rounded-full border border-white/10" :style="{ backgroundColor: team.primaryColor || '#F97316' }" />
                        <span class="text-sm text-slate-200">{{ team.primaryColor || "—" }}</span>
                      </div>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-[#0B1020] p-3">
                      <p class="text-[11px] uppercase tracking-wide text-slate-500">Color secundario</p>
                      <div class="mt-2 flex items-center gap-3">
                        <span class="h-5 w-5 rounded-full border border-white/10" :style="{ backgroundColor: team.secondaryColor || '#FFFFFF' }" />
                        <span class="text-sm text-slate-200">{{ team.secondaryColor || "—" }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-5">
                    <p class="text-[11px] uppercase tracking-wide text-slate-500">Integrantes completos</p>
                    <div class="mt-2 space-y-2">
                      <div v-for="player in validPlayers.slice(0, 6)" :key="player.id" class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                        <span class="truncate text-sm text-slate-200">{{ player.fullName }}</span>
                        <span class="text-xs text-slate-500">{{ player.jerseyNumber || "—" }}</span>
                      </div>
                      <div v-if="validPlayers.length === 0" class="rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-3 text-sm text-slate-500">
                        Sin integrantes completos todavía.
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL BORRAR EQUIPO -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/60" @click="closeDeleteConfirm" />

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-lg overflow-hidden rounded-3xl border border-rose-400/20 bg-[#0B1020] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div class="border-b border-white/10 px-5 py-4">
            <p class="text-[11px] uppercase tracking-[0.22em] text-rose-300/80">Confirmación</p>
            <h3 class="mt-2 text-2xl font-extrabold text-white">Borrar equipo</h3>
            <p class="mt-3 text-sm text-slate-300">
              Estás a punto de desactivar el equipo
              <span class="font-extrabold text-white">{{ teamPendingDelete?.name || "actual" }}</span>.
            </p>
          </div>

          <div class="p-5">
            <div class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              Esta acción hará un <span class="font-extrabold">soft delete</span> del equipo.
            </div>

            <label class="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                v-model="deleteAgreement"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-white/20 bg-[#08101E] text-orange-500 focus:ring-orange-400"
              />
              <span class="text-sm text-slate-200">
                Confirmo que estoy de acuerdo en desactivar este equipo.
              </span>
            </label>

            <div class="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                :disabled="deletingTeam"
                @click="closeDeleteConfirm"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-extrabold text-rose-100 hover:bg-rose-500/15 disabled:opacity-50"
                :disabled="!deleteAgreement || deletingTeam"
                @click="deleteTeam"
              >
                {{ deletingTeam ? "Desactivando…" : "Sí, borrar equipo" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="onLogoChange" />
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useNuxtApp, useRoute, useRouter, useRuntimeConfig, useState } from "#imports"
import { $fetch } from "ofetch"
import { useAuthz } from "~/composables/useAuthz"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

type HeadersMap = Record<string, string>

type TeamCard = {
  id: number
  name: string
  shortName: string
  logoUrl: string
  leagueId: number | null
  seasonId: number | null
  categoryName: string
}

type Category = {
  id: number
  name: string
  code: string
  gender: string
}

type PlayerDraft = {
  id: string
  fullName: string
  curp: string
  jerseyNumber: string
  photoFile: File | null
  photoPreview: string | null
}

type TeamDraft = {
  id: number | null
  name: string
  shortName: string
  categoryId: number
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  players: PlayerDraft[]
}

const JUEVES_LEAGUE_ID = 2
const LEAGUE_ID = 2
const SEASON_ID = 3
const LEAGUE_LABEL = "Liga de Jueves"
const SEASON_LABEL = "Nocturna"

function normalizeApiBase(v: string) {
  const s = String(v || "").trim().replace(/\/+$/, "")
  if (!s) return "https://tocho5-api.tochero5.mx/api"
  return s.endsWith("/api") ? s : `${s}/api`
}

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  if (x && Array.isArray(x.data)) return x.data
  if (x && Array.isArray(x.teams)) return x.teams
  return []
}

function initials(text: string) {
  const s = String(text || "").trim()
  if (!s) return "T5"
  return s
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("")
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

function niceGender(g: string) {
  const x = String(g || "").toUpperCase()
  if (x === "VARONIL") return "Varonil"
  if (x === "FEMENIL") return "Femenil"
  if (x === "MIXTO") return "Mixto"
  return g || "—"
}

function createEmptyPlayer(): PlayerDraft {
  return {
    id: uid("pl"),
    fullName: "",
    curp: "",
    jerseyNumber: "",
    photoFile: null,
    photoPreview: null,
  }
}

function createEmptyTeam(): TeamDraft {
  return {
    id: null,
    name: "",
    shortName: "",
    categoryId: 0,
    primaryColor: "#F97316",
    secondaryColor: "#FFFFFF",
    logoUrl: "",
    players: [],
  }
}

function toNullablePositiveNumber(value: any): number | null {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

const nuxtApp = useNuxtApp()
const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()
const kcReady = useState<boolean>("kcReady", () => false)
const authz: any = useAuthz()

const API_BASE = normalizeApiBase(((runtime.public as any)?.apiBase as string) || "https://tocho5-api.tochero5.mx")
const ASSET_UPLOAD_ENDPOINT = `${API_BASE}/assets/upload`
const TEAM_CREATE_URL = `${API_BASE}/teams/mine`
const runtimeMaxTeams = Number((runtime.public as any)?.maxTeamsPerCaptain ?? 20)

function TEAM_UPDATE_URL(id: number) {
  return `${API_BASE}/teams/${id}`
}

function TEAM_FETCH_URL(id: number) {
  return `${API_BASE}/teams/${id}`
}

const isAuthenticated = computed<boolean>(() => {
  const raw = authz?.isAuthenticated
  if (typeof raw === "boolean") return raw
  if (raw && typeof raw === "object" && "value" in raw) return !!raw.value
  const kc = (nuxtApp as any).$kc
  return !!kc?.authenticated
})

function login() {
  const kc = (nuxtApp as any).$kc
  if (!kc?.login) return
  kc.login({ redirectUri: window.location.href })
}

const authOk = computed(() => isAuthenticated.value)

const statusMsg = ref("")
const errorMsg = ref("")
const loadingList = ref(false)
const teams = ref<TeamCard[]>([])

const backendTotalTeams = ref<number | null>(null)
const backendMaxTeams = ref<number | null>(null)
const backendCanCreate = ref<boolean | null>(null)
const backendRole = ref<string>("")

const highlightId = computed<number | null>(() => {
  const n = Number(route.query.highlight ?? 0)
  return Number.isFinite(n) && n > 0 ? n : null
})

const visibleTeams = computed<TeamCard[]>(() => {
  return teams.value.filter((teamCard) => teamCard.leagueId === JUEVES_LEAGUE_ID)
})

const totalTeamsCount = computed(() => backendTotalTeams.value ?? teams.value.length)
const effectiveMaxTeams = computed(() => backendMaxTeams.value ?? runtimeMaxTeams)

const roleLabel = computed(() => {
  if (backendRole.value) return backendRole.value

  const kc = (nuxtApp as any).$kc
  const roles: string[] =
    kc?.tokenParsed?.realm_access?.roles ||
    kc?.tokenParsed?.resource_access?.["nuxt-app"]?.roles ||
    []

  if (roles.map((r) => String(r).toLowerCase()).includes("admin")) return "ADMIN"
  if (roles.map((r) => String(r).toLowerCase()).includes("captain")) return "CAPITÁN"
  return "USUARIO"
})

const canCreate = computed(() => {
  if (backendCanCreate.value !== null) return backendCanCreate.value
  return totalTeamsCount.value < effectiveMaxTeams.value
})

async function getAccessToken(): Promise<string | null> {
  const app: any = nuxtApp as any
  const kc: any = app.$kc

  try {
    await kc?.updateToken?.(30)
  } catch {}

  if (typeof kc?.token === "string" && kc.token.length > 20) return kc.token

  if (typeof app.$kcGetToken === "function") {
    try {
      const t = await app.$kcGetToken()
      if (typeof t === "string" && t.length > 20) return t
    } catch {}
  }

  if (typeof app.$getToken === "function") {
    try {
      const t = await app.$getToken()
      if (typeof t === "string" && t.length > 20) return t
    } catch {}
  }

  return null
}

async function authHeaders(json = false): Promise<HeadersMap> {
  const token = await getAccessToken()
  const h: HeadersMap = {}
  if (json) h["Content-Type"] = "application/json"
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

function normalizeTeams(payload: any): TeamCard[] {
  const arr = unwrapList<any>(payload)

  return arr
    .map((t) => ({
      id: Number(t?.id ?? t?.teamId ?? t?.team_id ?? 0),
      name: String(t?.name ?? t?.teamName ?? t?.team_name ?? "Equipo"),
      shortName: String(t?.shortName ?? t?.short_name ?? ""),
      logoUrl: String(t?.logoUrl ?? t?.logo_url ?? t?.photoUrl ?? t?.photo_url ?? ""),
      leagueId: Number(
        t?.leagueId ??
          t?.league_id ??
          t?.league?.league_id ??
          t?.league?.leagueId ??
          t?.league?.id ??
          0
      ) || null,
      seasonId: Number(t?.seasonId ?? t?.season_id ?? t?.season?.id ?? 0) || null,
      categoryName: String(
        t?.category?.name ??
          t?.categoryName ??
          t?.category_name ??
          ""
      ),
    }))
    .filter((t) => Number.isFinite(t.id) && t.id > 0)
}

function hydrateSummary(payload: any) {
  backendTotalTeams.value = toNullablePositiveNumber(
    payload?.currentTeams ??
      payload?.current_teams ??
      payload?.totalTeams ??
      payload?.total_teams
  )

  backendMaxTeams.value = toNullablePositiveNumber(
    payload?.maxTeamsAllowed ??
      payload?.max_teams_allowed ??
      payload?.maxTeams ??
      payload?.max_teams
  )

  backendCanCreate.value =
    typeof payload?.canCreateTeam === "boolean"
      ? payload.canCreateTeam
      : typeof payload?.can_create_team === "boolean"
        ? payload.can_create_team
        : null

  const rawRole = String(payload?.role ?? "").trim().toLowerCase()
  if (rawRole === "admin") backendRole.value = "ADMIN"
  else if (rawRole === "captain") backendRole.value = "CAPITÁN"
  else if (rawRole) backendRole.value = rawRole.toUpperCase()
  else backendRole.value = ""
}

function resetSummaryState() {
  backendTotalTeams.value = null
  backendMaxTeams.value = null
  backendCanCreate.value = null
  backendRole.value = ""
}

async function loadTeams() {
  loadingList.value = true
  errorMsg.value = ""
  statusMsg.value = ""

  try {
    const headers = await authHeaders()
    if (!headers.Authorization) throw new Error("No hay sesión activa.")

    resetSummaryState()

    const candidates = [
      { url: `${API_BASE}/teams/mine` },
      { url: `${API_BASE}/teams/me` },
      { url: `${API_BASE}/users/me/teams` },
      { url: `${API_BASE}/captain/teams` },
    ]

    let loaded = false
    let lastError: any = null

    for (const candidate of candidates) {
      try {
        const raw = await $fetch<any>(candidate.url, {
          method: "GET",
          headers,
        })

        hydrateSummary(raw)
        teams.value = normalizeTeams(raw)
        loaded = true
        break
      } catch (e: any) {
        lastError = e
        const st = e?.status || e?.statusCode
        if (st === 404) continue
        break
      }
    }

    if (!loaded && lastError) {
      throw lastError
    }

    statusMsg.value = loaded
      ? "Equipos cargados correctamente. Abajo se muestran solo los de la liga de jueves."
      : "No se encontraron equipos registrados."
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || "No se pudieron cargar tus equipos."
  } finally {
    loadingList.value = false
  }
}

const panelMode = ref<"list" | "register" | "edit">("list")
const activeEditTeamId = ref<number | null>(null)

const categories = ref<Category[]>([])
const categoriesLoading = ref(false)

const team = ref<TeamDraft>(createEmptyTeam())
const serverSnapshot = ref<TeamDraft>(createEmptyTeam())

const submitting = ref(false)
const uploading = ref(false)
const deletingTeam = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

const editingTeamCard = computed<TeamCard | null>(() => {
  if (!activeEditTeamId.value) return null
  return visibleTeams.value.find((x) => x.id === activeEditTeamId.value) || null
})

const showFormPanel = computed(() => panelMode.value === "register" || panelMode.value === "edit")

const selectedCategory = computed<Category | null>(() =>
  categories.value.find((c) => c.id === team.value.categoryId) || null
)

const validPlayers = computed(() =>
  team.value.players.filter((p) => p.fullName.trim() && p.curp.trim() && p.photoFile)
)

const submitLabel = computed(() => (panelMode.value === "edit" ? "Guardar cambios" : "Registrar equipo"))

function replaceRouteQuery(query: Record<string, string>) {
  router.replace({ path: "/jueves/mi-equipo", query }).catch(() => {})
}

function buildEditLink(teamCard: TeamCard, section: "equipo" | "roster") {
  return `/jueves/equipos/${teamCard.id}/editar/${section}`
}

function revokeAllPlayerPreviews() {
  for (const p of team.value.players) {
    if (p.photoPreview) {
      URL.revokeObjectURL(p.photoPreview)
      p.photoPreview = null
    }
  }
}

function resetForm() {
  revokeAllPlayerPreviews()
  team.value = createEmptyTeam()
  serverSnapshot.value = createEmptyTeam()
}

function clearProgress() {
  if (panelMode.value === "edit" && activeEditTeamId.value) {
    revokeAllPlayerPreviews()
    team.value = clone(serverSnapshot.value)
    statusMsg.value = "Se restauró la última versión cargada del equipo."
    errorMsg.value = ""
    return
  }

  resetForm()
  statusMsg.value = "Progreso borrado."
  errorMsg.value = ""
}

function openListPanel() {
  panelMode.value = "list"
  activeEditTeamId.value = null
  replaceRouteQuery({})
}

function openRegisterPanel() {
  panelMode.value = "register"
  activeEditTeamId.value = null
  resetForm()
  replaceRouteQuery({ view: "register" })
}

async function openEditPanel(teamCard: TeamCard) {
  panelMode.value = "list"
  activeEditTeamId.value = null
  await router.push(`/jueves/equipos/${teamCard.id}/editar`)
}

function addPlayer() {
  team.value.players.push(createEmptyPlayer())
}

function removePlayer(index: number) {
  const p = team.value.players[index]
  if (p?.photoPreview) URL.revokeObjectURL(p.photoPreview)
  team.value.players.splice(index, 1)
}

function pickLogo() {
  logoInput.value?.click()
}

function onPlayerPhotoChange(index: number, event: Event) {
  const player = team.value.players[index]
  if (!player) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
  player.photoFile = file
  player.photoPreview = file ? URL.createObjectURL(file) : null
}

async function uploadAsset(folder: string, file: File) {
  const token = await getAccessToken()
  if (!token) throw new Error("No hay sesión activa.")

  const fd = new FormData()
  fd.append("folder", folder)
  fd.append("file", file)

  const res = await fetch(ASSET_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })

  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {}

  if (!res.ok) throw new Error((json?.message || json?.error) || `${res.status} ${res.statusText}`)
  return json
}

async function onLogoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return

  uploading.value = true
  errorMsg.value = ""
  statusMsg.value = "Subiendo logo…"

  try {
    const res = await uploadAsset("site/jueves/teams/logos", file)
    const publicUrl = String(res?.publicUrl || "")
    if (!publicUrl) throw new Error("La API no regresó publicUrl.")
    team.value.logoUrl = publicUrl
    statusMsg.value = "Logo subido correctamente."
  } catch (e: any) {
    errorMsg.value = e?.message || "No se pudo subir el logo."
  } finally {
    uploading.value = false
  }
}

function normalizeTeamFromApi(raw: any): TeamDraft {
  const rosterRaw =
    Array.isArray(raw?.players) ? raw.players :
    Array.isArray(raw?.members) ? raw.members :
    Array.isArray(raw?.roster) ? raw.roster : []

  return {
    id: Number(raw?.id ?? raw?.teamId ?? raw?.team_id ?? 0) || null,
    name: String(raw?.name ?? raw?.teamName ?? ""),
    shortName: String(raw?.shortName ?? raw?.short_name ?? raw?.abbr ?? ""),
    categoryId: Number(raw?.categoryId ?? raw?.category_id ?? raw?.category?.id ?? 0) || 0,
    primaryColor: String(raw?.primaryColor ?? raw?.primary_color ?? "#F97316"),
    secondaryColor: String(raw?.secondaryColor ?? raw?.secondary_color ?? "#FFFFFF"),
    logoUrl: String(raw?.logoUrl ?? raw?.logo_url ?? raw?.photoUrl ?? raw?.photo_url ?? ""),
    players: rosterRaw.map((p: any) => ({
      id: uid("pl"),
      fullName: String(p?.fullName ?? p?.full_name ?? p?.name ?? ""),
      curp: String(p?.curp ?? p?.CURP ?? ""),
      jerseyNumber: String(p?.jerseyNumber ?? p?.jersey_number ?? p?.number ?? ""),
      photoFile: null,
      photoPreview: null,
    })),
  }
}

async function fetchExistingTeam(id: number) {
  const headers = await authHeaders(false)
  try {
    const raw = await fetch(TEAM_FETCH_URL(id), {
      headers: headers.Authorization ? { Authorization: headers.Authorization } : {},
    })
    if (!raw.ok) throw new Error(`HTTP ${raw.status}`)
    const data = await raw.json()
    const normalized = normalizeTeamFromApi(data)
    team.value = clone(normalized)
    serverSnapshot.value = clone(normalized)
    statusMsg.value = "Equipo cargado para edición."
    errorMsg.value = ""
  } catch (e: any) {
    errorMsg.value = e?.message || "No se pudo cargar el equipo."
  }
}

function buildTeamPayload() {
  return {
    id: team.value.id,
    teamId: team.value.id,
    name: team.value.name.trim(),
    teamName: team.value.name.trim(),
    shortName: team.value.shortName.trim(),
    short_name: team.value.shortName.trim(),
    categoryId: team.value.categoryId,
    category_id: team.value.categoryId,
    seasonId: SEASON_ID,
    season_id: SEASON_ID,
    leagueId: LEAGUE_ID,
    league_id: LEAGUE_ID,
    primaryColor: team.value.primaryColor.trim(),
    primary_color: team.value.primaryColor.trim(),
    secondaryColor: team.value.secondaryColor.trim(),
    secondary_color: team.value.secondaryColor.trim(),
    logoUrl: team.value.logoUrl.trim(),
    logo_url: team.value.logoUrl.trim(),
  }
}

function validateTeam() {
  if (!team.value.name.trim()) return "Escribe el nombre del equipo."
  if (!team.value.shortName.trim()) return "Escribe el nombre corto."
  if (!team.value.categoryId) return "Selecciona una categoría."
  return ""
}

async function submitTeam() {
  errorMsg.value = ""
  statusMsg.value = ""

  const validation = validateTeam()
  if (validation) {
    errorMsg.value = validation
    return
  }

  submitting.value = true
  try {
    const headers = await authHeaders(true)
    if (!headers.Authorization) throw new Error("No hay sesión activa.")

    const token = headers.Authorization.replace("Bearer ", "")
    let res: any = null

    if (panelMode.value === "edit" && activeEditTeamId.value) {
      const url = TEAM_UPDATE_URL(activeEditTeamId.value)

      try {
        const r = await fetch(url, { method: "PUT", headers, body: JSON.stringify(buildTeamPayload()) })
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err?.message || `Error ${r.status}`)
        }
        res = await r.json().catch(() => ({}))
      } catch {
        const r = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(buildTeamPayload()) })
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err?.message || `Error ${r.status}`)
        }
        res = await r.json().catch(() => ({}))
      }
    } else {
      const r = await fetch(TEAM_CREATE_URL, { method: "POST", headers, body: JSON.stringify(buildTeamPayload()) })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        throw new Error(err?.message || `Error ${r.status}`)
      }
      res = await r.json()
    }

    const newId = Number(res?.id ?? res?.teamId ?? res?.team_id ?? activeEditTeamId.value ?? 0) || null
    if (newId) team.value.id = newId

    if (newId && validPlayers.value.length > 0) {
      for (const p of validPlayers.value) {
        try {
          const fd = new FormData()
          fd.append("fullName", p.fullName.trim())
          fd.append("curp", p.curp.trim().toUpperCase())
          if (p.jerseyNumber) fd.append("jerseyNumber", p.jerseyNumber)
          fd.append("photo", p.photoFile as File)

          await fetch(`${API_BASE}/teams/${newId}/players`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          })
        } catch (errPlayer) {
          console.error("Error subiendo jugador:", errPlayer)
        }
      }
    }

    serverSnapshot.value = clone(team.value)

    await loadTeams()

    statusMsg.value =
      panelMode.value === "edit"
        ? "Equipo actualizado correctamente."
        : "Equipo registrado correctamente."

    panelMode.value = "list"
    activeEditTeamId.value = null
    replaceRouteQuery(newId ? { highlight: String(newId) } : {})
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || "No se pudo guardar el equipo."
  } finally {
    submitting.value = false
  }
}

const showDeleteConfirm = ref(false)
const deleteAgreement = ref(false)
const teamPendingDelete = ref<TeamCard | null>(null)

function openDeleteConfirm(teamCard: TeamCard) {
  teamPendingDelete.value = teamCard
  deleteAgreement.value = false
  showDeleteConfirm.value = true
}

function openDeleteConfirmFromEdit() {
  if (!editingTeamCard.value) return
  openDeleteConfirm(editingTeamCard.value)
}

function closeDeleteConfirm() {
  if (deletingTeam.value) return
  showDeleteConfirm.value = false
  deleteAgreement.value = false
}

function getStatusCode(err: any): number | undefined {
  return err?.statusCode ?? err?.status ?? err?.response?.status ?? err?.response?._data?.status
}

async function readResponseMessage(res: Response) {
  const text = await res.text().catch(() => "")
  if (!text) return `${res.status} ${res.statusText}`
  try {
    const json = JSON.parse(text)
    return json?.message || json?.error || text
  } catch {
    return text
  }
}

async function patchSoftDelete(url: string, token: string) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ isActive: false }),
  })

  if (!res.ok) {
    const message = await readResponseMessage(res)
    const err: any = new Error(message)
    err.status = res.status
    throw err
  }

  return true
}

function buildSoftDeleteUrls(id: number | string) {
  const safeId = encodeURIComponent(String(id))
  return [
    `${API_BASE}/teams/${safeId}/active`,
    `${API_BASE}/teams/${safeId}`,
  ]
}

async function deleteTeam() {
  if (!teamPendingDelete.value || deletingTeam.value) return
  if (!deleteAgreement.value) {
    errorMsg.value = "Debes confirmar que estás de acuerdo en borrar el equipo."
    return
  }

  deletingTeam.value = true
  errorMsg.value = ""
  statusMsg.value = ""

  try {
    const token = await getAccessToken()
    if (!token) throw new Error("No hay sesión activa. Vuelve a iniciar sesión.")

    const urls = buildSoftDeleteUrls(teamPendingDelete.value.id)
    let lastError: any = null
    let ok = false

    for (const url of urls) {
      try {
        await patchSoftDelete(url, token)
        ok = true
        break
      } catch (e: any) {
        lastError = e
        const status = getStatusCode(e)
        if (status !== 404) throw e
      }
    }

    if (!ok && lastError) throw lastError

    revokeAllPlayerPreviews()
    team.value = createEmptyTeam()
    serverSnapshot.value = createEmptyTeam()

    const deletedName = teamPendingDelete.value.name
    showDeleteConfirm.value = false
    deleteAgreement.value = false
    teamPendingDelete.value = null

    await loadTeams()
    openListPanel()
    statusMsg.value = `Equipo "${deletedName}" desactivado correctamente.`
  } catch (e: any) {
    const status = getStatusCode(e)
    const msg = e?.message || "No se pudo borrar el equipo."

    showDeleteConfirm.value = false
    deleteAgreement.value = false

    if (status === 404) {
      errorMsg.value = "No se encontró ni /teams/{id}/active ni /teams/{id} para hacer el soft delete."
    } else if (status === 401) {
      errorMsg.value = "Tu sesión expiró. Vuelve a iniciar sesión."
    } else if (status === 403) {
      errorMsg.value = "No autorizado para desactivar este equipo."
    } else if (status === 409) {
      errorMsg.value = "No se pudo desactivar el equipo porque tiene relaciones activas."
    } else {
      errorMsg.value = msg
    }
  } finally {
    deletingTeam.value = false
  }
}

async function fetchCategories() {
  categoriesLoading.value = true
  try {
    const url = `${API_BASE}/categories?leagueId=${LEAGUE_ID}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw = await res.json()
    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.content)
        ? raw.content
        : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.data)
            ? raw.data
            : []

    categories.value = arr
      .map((c: any) => ({
        id: Number(c?.id ?? c?.categoryId ?? 0) || 0,
        name: String(c?.name ?? "").trim(),
        code: String(c?.code ?? "").trim(),
        gender: String(c?.gender ?? "").trim(),
      }))
      .filter((c: Category) => c.id > 0 && !!c.name)
  } catch (e) {
    console.error("Error cargando categorías:", e)
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

async function syncPanelFromRoute() {
  const view = String(route.query.view ?? "")
  const teamId = Number(route.query.teamId ?? 0)

  if (view === "register") {
    if (canCreate.value) {
      panelMode.value = "register"
      activeEditTeamId.value = null
      if (!team.value.id) {
        resetForm()
      }
    } else {
      panelMode.value = "list"
      activeEditTeamId.value = null
    }
    return
  }

  if (view === "edit" && teamId > 0) {
    if (visibleTeams.value.some((t) => t.id === teamId)) {
      await router.replace(`/jueves/equipos/${teamId}/editar`)
      return
    }
  }

  if (view !== "register" && view !== "edit") {
    panelMode.value = "list"
    activeEditTeamId.value = null
  }
}

watch(
  () => [kcReady.value, authOk.value],
  async ([ready, auth]) => {
    if (ready && auth) {
      await loadTeams()
      await syncPanelFromRoute()
    }
  },
  { immediate: true }
)

watch(
  () => route.fullPath,
  async () => {
    if (kcReady.value && authOk.value) {
      await syncPanelFromRoute()
    }
  }
)

onMounted(async () => {
  await fetchCategories()

  if (kcReady.value && authOk.value) {
    await loadTeams()
    await syncPanelFromRoute()
  }
})

onBeforeUnmount(() => {
  revokeAllPlayerPreviews()
})
</script>
