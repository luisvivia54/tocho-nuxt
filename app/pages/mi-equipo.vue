<!-- app/pages/mi-equipo.vue -->
<template>
  <section class="pt-12 md:pt-14 lg:pt-16">
    <div class="mx-auto max-w-5xl container-pad px-6">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-slate-900 md:text-4xl">
            Mi equipo
          </h1>
          <p class="mt-2 text-base text-slate-600">
            Aquí verás tus equipos como capitán, tus permisos en la liga, el registro y los accesos rápidos para editar cada equipo.
          </p>
        </div>

        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>

      <div v-if="!kcReady" class="mb-4 text-sm text-slate-500">
        Inicializando sesión…
      </div>

      <div
        v-else-if="!authOk"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        Debes iniciar sesión para ver tu equipo.
      </div>

      <div
        v-if="kcReady && authOk"
        class="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-7"
      >
        <div v-if="loading" class="text-sm text-slate-500">
          Cargando información de tu equipo…
        </div>

        <div v-else-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <div v-else-if="summary">
          <div class="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div class="min-w-[140px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rol
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.role }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Equipos como capitán
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.currentTeams }} / {{ summary.maxTeamsAllowed }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                ¿Puede crear equipo?
              </p>
              <p
                class="mt-1 text-[14px] font-semibold"
                :class="summary.canCreateTeam ? 'text-green-600' : 'text-red-600'"
              >
                {{ summary.canCreateTeam ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {{ successMessage }}
          </div>

          <div
            v-if="errorMessage"
            class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div v-if="!summary.hasCaptainPrivileges" class="text-sm text-slate-600">
            No tienes rol de capitán. Si crees que esto es un error, contacta al administrador de la liga.
          </div>

          <template v-else>
            <div class="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                  :class="
                    panelMode === 'list'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  "
                  @click="openListPanel"
                >
                  Mis equipos
                </button>

                <button
                  v-if="summary.canCreateTeam"
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                  :class="
                    panelMode === 'register'
                      ? 'bg-blue-600 text-white'
                      : 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  "
                  @click="openRegisterPanel"
                >
                  {{ normalizedTeams.length > 0 ? '+ Registrar equipo' : 'Registrar equipo' }}
                </button>

              </div>

              <p class="text-xs text-slate-500">
                El registro sigue aquí. La edición del equipo y del roster ahora se abre en pantallas separadas.
              </p>
            </div>

            <section
              v-if="showFormPanel"
              class="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
            >
              <div class="flex items-center justify-between gap-4 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] px-6 py-4">
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-100">
                    {{ panelMode === 'edit' ? 'edición de capitán' : 'registro de capitán' }}
                  </p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white sm:text-2xl">
                    {{
                      panelMode === 'edit' && editingTeam
                        ? `Editar equipo: ${editingTeam.name}`
                        : 'Datos del equipo e integrantes'
                    }}
                  </h2>
                </div>

                <div class="flex flex-wrap items-center justify-end gap-2">
                  <button
                    v-if="panelMode === 'edit' && editingTeam"
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                    @click="openDeleteDialog(editingTeam)"
                  >
                    Borrar equipo
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    @click="openListPanel"
                  >
                    Volver a mis equipos
                  </button>
                </div>
              </div>

              <form
                class="space-y-8 px-6 py-8"
                @submit.prevent="panelMode === 'edit' ? onEditPreviewSubmit() : onSubmit()"
              >
                <div
                  v-if="panelMode === 'edit'"
                  class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                >
                </div>

                <div class="space-y-4">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">Datos del equipo</h3>
                      <p class="text-xs text-slate-500">
                        {{
                          panelMode === 'edit'
                            ? 'Revisa cómo se acomoda aquí la edición del equipo.'
                            : 'Completa la información del equipo. Puedes registrarlo aunque aún no cargues integrantes.'
                        }}
                      </p>
                    </div>

                    <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                      Temporada fija: <span class="font-semibold">{{ currentSeasonLabel }}</span>
                    </div>
                  </div>

                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="md:col-span-2">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        Nombre del equipo
                      </label>
                      <input
                        v-model="teamName"
                        type="text"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                        placeholder="Ej. Tigres del Norte"
                      />
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        Nombre corto
                      </label>
                      <input
                        v-model="teamShortName"
                        type="text"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                        placeholder="Ej. TIG"
                      />
                    </div>
                  </div>

                  <div class="mt-2 grid gap-4 md:grid-cols-4">
                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Liga</label>
                      <select
                        v-model.number="selectedLeagueId"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                      >
                        <option :value="0" disabled>Selecciona liga</option>
                        <option v-for="league in leagues" :key="league.id" :value="league.id">
                          {{ league.name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Temporada (actual)</label>
                      <select
                        v-model.number="selectedSeasonId"
                        disabled
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                      >
                        <option v-for="season in availableSeasons" :key="season.id" :value="season.id">
                          {{ season.name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Categoría</label>
                      <select
                        v-model="selectedGender"
                        :disabled="categoriesLoading || !selectedLeagueId"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="" disabled>
                          {{ categoriesLoading ? 'Cargando…' : 'Selecciona categoría' }}
                        </option>
                        <option v-for="g in genderOptions" :key="g.value" :value="g.value">
                          {{ g.label }}
                        </option>
                      </select>

                      <p v-if="categoriesError" class="mt-1 text-[11px] text-red-600">
                        {{ categoriesError }}
                      </p>
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Rama</label>
                      <select
                        v-model="selectedRama"
                        :disabled="!selectedGender"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="" disabled>
                          {{ selectedGender ? 'Selecciona rama' : 'Primero elige categoría' }}
                        </option>
                        <option v-for="r in ramaOptions" :key="r.value" :value="r.value">
                          {{ r.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div v-if="selectedCategory" class="mt-2 text-[11px] text-slate-500">
                    Seleccionaste: <span class="font-semibold">{{ selectedCategory.name }}</span>
                  </div>

                  <div class="mt-2 grid gap-4 md:grid-cols-2">
                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Color primario</label>
                      <div class="flex items-center gap-3">
                        <input
                          v-model="colorPrimary"
                          type="color"
                          class="h-9 w-9 cursor-pointer rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          v-model="colorPrimary"
                          type="text"
                          class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                          placeholder="#1D4ED8"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Color secundario</label>
                      <div class="flex items-center gap-3">
                        <input
                          v-model="colorSecondary"
                          type="color"
                          class="h-9 w-9 cursor-pointer rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          v-model="colorSecondary"
                          type="text"
                          class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="mt-2 grid items-start gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-700">Logo del equipo</label>
                      <p class="mb-2 text-[11px] text-slate-500">
                        Sube el logo oficial (JPG o PNG).
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        @change="onLogoChange"
                      />
                    </div>

                    <div class="flex justify-center md:justify-end">
                      <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                        <img
                          v-if="logoPreview"
                          :src="logoPreview"
                          alt="Logo del equipo"
                          class="h-full w-full object-contain"
                        />
                        <span v-else class="px-2 text-center text-[11px] text-slate-400">
                          Previsualización
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-8 space-y-4">
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">Integrantes del equipo</h3>
                      <p class="text-xs text-slate-500">
                        Solo se registrarán los integrantes que tengan <strong>Nombre + CURP + Foto</strong>.
                        Los incompletos <strong>se ignoran</strong>. El jersey es opcional.
                      </p>
                      <p class="mt-1 text-[11px] text-slate-500">
                        Se enviarán: <strong>{{ sendablePlayers.length }}</strong> / {{ players.length }}
                      </p>
                    </div>

                    <button
                      type="button"
                      class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                      @click="addPlayer"
                    >
                      + Agregar integrante
                    </button>
                  </div>

                  <div
                    v-if="players.length === 0"
                    class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
                  >
                    No has agregado integrantes. Puedes continuar así y luego cargar más desde “Mi equipo”.
                  </div>

                  <div v-else class="space-y-3">
                    <div
                      v-for="(player, index) in players"
                      :key="player.id"
                      class="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5"
                    >
                      <div class="mb-3 flex items-start justify-between gap-3">
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                            {{ index + 1 }}
                          </span>
                          <span>Integrante</span>
                        </div>

                        <button
                          type="button"
                          class="text-[11px] text-slate-500 hover:text-red-500"
                          @click="removePlayer(index)"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div class="grid items-start gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                        <div class="space-y-3">
                          <div>
                            <label class="mb-1 block text-[11px] font-semibold text-slate-700">
                              Nombre completo
                            </label>
                            <input
                              v-model="player.fullName"
                              type="text"
                              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                              placeholder="Ej. María López"
                            />
                          </div>

                          <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
                            <div>
                              <label class="mb-1 block text-[11px] font-semibold text-slate-700">
                                CURP
                              </label>
                              <input
                                v-model="player.curp"
                                type="text"
                                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs uppercase tracking-[0.08em] text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                                placeholder="CURP"
                              />
                            </div>

                            <div>
                              <label class="mb-1 block text-[11px] font-semibold text-slate-700">
                                # Jersey (opcional)
                              </label>
                              <input
                                v-model.number="player.jerseyNumber"
                                type="number"
                                min="0"
                                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                                placeholder="Ej. 10"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="space-y-2">
                          <label class="mb-1 block text-[11px] font-semibold text-slate-700">
                            Foto
                          </label>
                          <p class="text-[11px] text-slate-500">
                            Si no hay foto, este integrante no se enviará.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            class="block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            @change="onPlayerPhotoChange(index, $event)"
                          />

                          <div class="mt-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
                            <img
                              v-if="player.photoPreview"
                              :src="player.photoPreview"
                              alt="Foto del jugador"
                              class="h-full w-full object-cover"
                            />
                            <span v-else class="px-2 text-center text-[11px] text-slate-400">
                              Previsualización de la foto
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p class="text-[11px] text-slate-500">
                    Puedes agregar más integrantes después desde <strong>“Mi equipo”</strong>.
                  </p>
                </div>

                <div class="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    @click="saveDraft"
                  >
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                    @click="clearProgress"
                  >
                    Borrar progreso
                  </button>

                  <button
                    type="submit"
                    class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="submitting || (panelMode === 'register' && !summary.canCreateTeam)"
                  >
                    <span v-if="submitting && panelMode === 'register'">Subiendo información…</span>
                    <span v-else>Registrar equipo</span>
                  </button>
                </div>
              </form>
            </section>

            <div v-else class="space-y-4">
              <div
                v-if="summary.currentTeams === 0 && summary.canCreateTeam"
                class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p class="text-sm text-slate-600">
                  Aún no has registrado un equipo. Puedes crear uno nuevo desde esta misma pestaña.
                </p>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  @click="openRegisterPanel"
                >
                  Crear equipo
                </button>
              </div>

              <div v-else-if="normalizedTeams.length > 0" class="space-y-4">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p class="text-sm text-slate-600">
                    Ya tienes {{ normalizedTeams.length }} equipo(s) registrado(s) como capitán.
                  </p>

                  <button
                    v-if="summary.canCreateTeam"
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    @click="openRegisterPanel"
                  >
                    + Registrar otro equipo
                  </button>
                </div>

                <div class="grid gap-3 md:grid-cols-2">
                  <article
                    v-for="team in normalizedTeams"
                    :key="team.teamId"
                    class="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div class="flex min-h-[140px] flex-col justify-between">
                      <div>
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <h2 class="truncate font-display text-lg font-extrabold text-slate-900 md:text-xl">
                              {{ team.name }}
                            </h2>

                            <p class="mt-2 text-xs text-slate-500">
                              ID: {{ team.teamId }} · Liga: {{ team.leagueId ?? DEFAULT_LEAGUE_ID }}
                            </p>
                          </div>

                          <span
                            class="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            Capitán
                          </span>
                        </div>
                      </div>

                      <div class="mt-4 flex flex-wrap items-center gap-2">
                        <NuxtLink
                          :to="buildViewLink(team)"
                          class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                        >
                          Ver equipo
                        </NuxtLink>

                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                          @click="toggleEditMenu(team.teamId)"
                        >
                          {{ editMenuTeamId === team.teamId ? 'Cerrar opciones' : 'Editar' }}
                        </button>

                        <p class="text-xs text-slate-500">
                          ID: {{ team.teamId }} · Liga: {{ team.leagueId ?? DEFAULT_LEAGUE_ID }}
                        </p>
                      </div>
                    </div>

                    <transition
                      enter-active-class="transition duration-150 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition duration-100 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <div
                        v-if="editMenuTeamId === team.teamId"
                        class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div class="flex flex-col gap-3">
                          <div>
                            <p class="text-sm font-semibold text-slate-900">
                              Elegir edición: {{ team.name }}
                            </p>
                            <p class="mt-1 text-xs text-slate-500">
                              Selecciona una sola tarea por pantalla para mantener la edición simple.
                            </p>
                          </div>

                          <div class="grid gap-2 sm:grid-cols-2">
                            <NuxtLink
                              :to="buildTeamEditLink(team, 'equipo')"
                              class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                              Editar equipo
                            </NuxtLink>

                            <NuxtLink
                              :to="buildTeamEditLink(team, 'roster')"
                              class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Editar roster
                            </NuxtLink>
                          </div>

                          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            Si necesitas dar de baja el equipo, esa acción vive dentro de la pantalla “Editar equipo”.
                          </div>
                        </div>
                      </div>
                    </transition>
                  </article>
                </div>

                <p
                  v-if="!summary.canCreateTeam && summary.currentTeams >= summary.maxTeamsAllowed"
                  class="mt-2 text-xs text-slate-500"
                >
                  Ya alcanzaste tu límite de equipos. Si necesitas registrar otro, contacta al admin.
                </p>
              </div>

              <div v-else class="text-sm text-slate-500">
                No se encontraron equipos válidos en tu resumen.
              </div>
            </div>
          </template>
        </div>

        <div v-else class="text-sm text-slate-500">
          No se encontró información de tu equipo por ahora.
        </div>
      </div>
    </div>

    <!-- Modal soft delete -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteDialogOpen"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-4"
      >
        <div class="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
                Soft delete
              </p>
              <h3 class="mt-2 font-display text-2xl font-extrabold text-slate-900">
                Borrar equipo
              </h3>
              <p class="mt-2 text-sm text-slate-600">
                Esta acción hará un <span class="font-semibold">borrado suave</span> del equipo
                <span class="font-semibold">{{ teamPendingDelete?.name }}</span>.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              @click="closeDeleteDialog"
            >
              ✕
            </button>
          </div>

          <div class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Antes de borrar, confirma que estás de acuerdo. Esto está pensado para usar la misma lógica
            de soft delete que ya tienes en la liga de jueves.
          </div>

          <label class="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <input
              v-model="deleteConfirmChecked"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span class="text-sm text-slate-700">
              Estoy de acuerdo en borrar este equipo.
            </span>
          </label>

          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="closeDeleteDialog"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="deleteSubmitting || !deleteConfirmChecked"
              @click="confirmSoftDeleteTeam"
            >
              <span v-if="deleteSubmitting">Borrando…</span>
              <span v-else>Confirmar borrado</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNuxtApp, useRoute, useRouter, useRuntimeConfig, useState } from '#imports'
import { $fetch } from 'ofetch'
import { useAuthz } from '@/composables/useAuthz'
import { useMyTeam } from '@/composables/useMyTeam'

const DEFAULT_LEAGUE_ID = 1
const CURRENT_SEASON_TAG = 'WT'
const FALLBACK_SEASON_ID = 2
const DRAFT_KEY = 'miEquipoRegistroDraft'

interface CategoryDto {
  id: number
  leagueId?: number
  name: string
  code: string
  gender: string
}

interface LeagueOption {
  id: number
  name: string
}

interface SeasonOption {
  id: number
  name: string
  leagueId: number
}

interface PlayerForm {
  id: number
  fullName: string
  curp: string
  jerseyNumber: number | null
  photoFile: File | null
  photoPreview: string | null
}

interface DraftPlayer {
  id: number
  fullName?: string
  curp?: string
  jerseyNumber?: number
}

interface DraftData {
  teamName?: string
  teamShortName?: string
  colorPrimary?: string
  colorSecondary?: string
  leagueId?: number
  seasonId?: number
  categoryId?: number
  gender?: string
  rama?: string
  players?: DraftPlayer[]
}

interface CreatedTeam {
  teamId: number
  name: string
  shortName: string | null
  logoUrl?: string | null
}

interface TeamCard {
  teamId: number
  id: number
  leagueId: number
  name: string
}

function normalizeApiBase(raw?: string | null) {
  const fallback = 'https://tocho5-api.tochero5.mx/api'
  const s = String(raw || '').trim()
  if (!s) return fallback
  const clean = s.replace(/\/+$/, '')
  return clean.endsWith('/api') ? clean : `${clean}/api`
}

function seasonKey(name: string) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

function norm(v?: string | null) {
  return (v ?? '').trim().toUpperCase()
}

function prettyGender(g: string) {
  const key = norm(g)
  if (key === 'FEMENIL') return 'Femenil'
  if (key === 'VARONIL') return 'Varonil'
  if (key === 'MIXTO') return 'Mixto'
  return g
}

function pickCurrentWT(list: SeasonOption[]): SeasonOption | null {
  const tag = seasonKey(CURRENT_SEASON_TAG)
  const matches = list.filter((s) => seasonKey(s.name).includes(tag))

  if (matches.length > 0) {
    return matches.slice().sort((a, b) => b.id - a.id)[0] ?? null
  }

  const byFallback = list.find((s) => s.id === FALLBACK_SEASON_ID)
  if (byFallback) return byFallback

  return list.slice().sort((a, b) => b.id - a.id)[0] ?? null
}

function getStatusCode(err: any): number | undefined {
  return err?.statusCode ?? err?.response?.status ?? err?.response?._data?.status
}

function normalizeCategories(raw: any): CategoryDto[] {
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.data)
          ? raw.data
          : []

  return arr
    .map((c: any) => ({
      id: Number(c?.id ?? c?.categoryId ?? c?.category_id ?? 0) || 0,
      leagueId: Number(c?.leagueId ?? c?.league_id ?? c?.league?.id ?? 0) || undefined,
      name: String(c?.name ?? c?.categoryName ?? '').trim(),
      code: String(c?.code ?? '').trim(),
      gender: String(c?.gender ?? '').trim(),
    }))
    .filter((c: CategoryDto) => c.id > 0 && !!c.name)
}

function createEmptyPlayer(id: number): PlayerForm {
  return {
    id,
    fullName: '',
    curp: '',
    jerseyNumber: null,
    photoFile: null,
    photoPreview: null,
  }
}

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const config = useRuntimeConfig()

const API_BASE = normalizeApiBase(
  ((config.public as any)?.apiBase as string) || 'https://tocho5-api.tochero5.mx'
)

const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz()
const { summary, loading, error, loadMyTeam } = useMyTeam()

const authOk = computed(() => {
  const raw = isAuthenticated as any
  if (typeof raw === 'boolean') return raw
  if (raw && typeof raw === 'object' && 'value' in raw) return !!raw.value
  return false
})

const panelMode = ref<'list' | 'register' | 'edit'>('list')
const editMenuTeamId = ref<number | null>(null)
const editingTeamId = ref<number | null>(null)

const deleteDialogOpen = ref(false)
const deleteConfirmChecked = ref(false)
const deleteSubmitting = ref(false)
const teamPendingDelete = ref<TeamCard | null>(null)

const normalizedTeams = computed<TeamCard[]>(() => {
  const teams = Array.isArray(summary.value?.teams) ? summary.value.teams : []

  const mapped = teams
    .map((team: any) => {
      const teamId = Number(team?.teamId ?? team?.id ?? 0)
      const id = Number(team?.id ?? team?.teamId ?? 0)
      const leagueId = Number(team?.leagueId ?? team?.league_id ?? DEFAULT_LEAGUE_ID) || DEFAULT_LEAGUE_ID
      const name = String(team?.name ?? team?.teamName ?? 'Equipo').trim() || 'Equipo'

      return {
        teamId,
        id,
        leagueId,
        name,
      }
    })
    .filter((team) => Number.isFinite(team.teamId) && team.teamId > 0)

  const unique = new Map<number, TeamCard>()

  for (const team of mapped) {
    if (!unique.has(team.teamId)) {
      unique.set(team.teamId, team)
    }
  }

  return Array.from(unique.values())
})

const editingTeam = computed(() => {
  if (!editingTeamId.value) return null
  return normalizedTeams.value.find((team) => team.teamId === editingTeamId.value) ?? null
})

const showFormPanel = computed(() => {
  if (panelMode.value === 'register') return !!summary.value?.canCreateTeam
  if (panelMode.value === 'edit') return !!editingTeam.value
  return false
})

function buildViewLink(team: { teamId: number }) {
  return `/teams/${team.teamId}`
}

function buildTeamEditLink(team: { teamId: number }, section: 'equipo' | 'roster') {
  return `/teams/${team.teamId}/editar/${section}`
}

function replaceRouteQuery(query: Record<string, string>) {
  router.replace({ path: '/mi-equipo', query }).catch(() => {})
}

function resetFormFields() {
  teamName.value = ''
  teamShortName.value = ''
  colorPrimary.value = '#1D4ED8'
  colorSecondary.value = '#FFFFFF'

  logoFile.value = null
  if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  logoPreview.value = null

  selectedLeagueId.value = leagues.value[0]?.id ?? DEFAULT_LEAGUE_ID
  selectedSeasonId.value = currentSeason.value?.id ?? FALLBACK_SEASON_ID
  selectedGender.value = ''
  selectedRama.value = ''
  selectedCategoryId.value = 0

  for (const p of players.value) {
    if (p.photoPreview) URL.revokeObjectURL(p.photoPreview)
  }
  players.value = []
}

function openListPanel() {
  panelMode.value = 'list'
  editingTeamId.value = null
  editMenuTeamId.value = null
  replaceRouteQuery({})
}

function openRegisterPanel() {
  panelMode.value = 'register'
  editingTeamId.value = null
  editMenuTeamId.value = null
  replaceRouteQuery({ view: 'register' })
}

function toggleEditMenu(teamId: number) {
  editMenuTeamId.value = editMenuTeamId.value === teamId ? null : teamId
}

function openDeleteDialog(team: TeamCard) {
  teamPendingDelete.value = team
  deleteConfirmChecked.value = false
  deleteDialogOpen.value = true
  editMenuTeamId.value = null
}

function closeDeleteDialog() {
  deleteDialogOpen.value = false
  deleteConfirmChecked.value = false
  teamPendingDelete.value = null
}

async function confirmSoftDeleteTeam() {
  if (!teamPendingDelete.value) return

  if (!deleteConfirmChecked.value) {
    errorMessage.value = 'Debes marcar que estás de acuerdo para borrar el equipo.'
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  try {
    deleteSubmitting.value = true

    const { $kcGetToken } = nuxtApp as any
    const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
    const token = tokenFn ? ((await tokenFn()) ?? '') : ''

    if (!token) {
      errorMessage.value = 'No se encontró un token de sesión. Vuelve a iniciar sesión.'
      return
    }

    /*
      ==========================================================
      PEGA AQUÍ LA MISMA LLAMADA DE SOFT DELETE QUE USA JUEVES
      ==========================================================

      Ejemplo:
      await $fetch(`/teams/${teamPendingDelete.value.teamId}/soft-delete`, {
        baseURL: API_BASE,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: { ... }
      })

      No te inventé el endpoint porque aquí no me pasaste el de jueves.
    */
    throw new Error('SOFT_DELETE_ENDPOINT_PENDING')
  } catch (err: any) {
    if (String(err?.message || '') === 'SOFT_DELETE_ENDPOINT_PENDING') {
      errorMessage.value =
        'La confirmación del soft delete ya quedó lista en pantalla. Solo falta pegar aquí la misma llamada al backend que ya usa la liga de jueves.'
      closeDeleteDialog()
      return
    }

    console.error('Error en soft delete del equipo:', err)
    errorMessage.value = 'No se pudo borrar el equipo. Revisa la llamada del soft delete.'
  } finally {
    deleteSubmitting.value = false
  }
}

/* =========================
   CATÁLOGOS / FORMULARIO
========================= */
const leagues = ref<LeagueOption[]>([{ id: 1, name: 'Liga Tochero5' }])

const seasons = ref<SeasonOption[]>([])
const currentSeason = ref<SeasonOption | null>(null)

const selectedLeagueId = ref<number>(DEFAULT_LEAGUE_ID)
const selectedSeasonId = ref<number>(0)

const categories = ref<CategoryDto[]>([])
const categoriesLoading = ref(false)
const categoriesError = ref<string | null>(null)

const selectedCategoryId = ref<number>(0)
const selectedGender = ref<string>('')
const selectedRama = ref<string>('')

const teamName = ref('')
const teamShortName = ref('')
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const colorPrimary = ref('#1D4ED8')
const colorSecondary = ref('#FFFFFF')
const players = ref<PlayerForm[]>([])

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const availableSeasons = computed(() =>
  seasons.value.filter((s) => !selectedLeagueId.value || s.leagueId === selectedLeagueId.value)
)

const genderOptions = computed(() => {
  const set = new Map<string, string>()

  for (const c of categories.value) {
    const g = norm(c.gender)
    if (g) set.set(g, prettyGender(g))
  }

  return Array.from(set.entries()).map(([value, label]) => ({ value, label }))
})

const ramaOptions = computed(() => {
  if (!selectedGender.value) return []

  const set = new Map<string, string>()

  for (const c of categories.value) {
    if (norm(c.gender) !== selectedGender.value) continue
    const codeKey = norm(c.code)
    if (codeKey) set.set(codeKey, c.code)
  }

  return Array.from(set.entries()).map(([value, label]) => ({ value, label }))
})

const selectedCategory = computed<CategoryDto | null>(() => {
  if (!selectedGender.value || !selectedRama.value) return null

  return (
    categories.value.find(
      (c) => norm(c.gender) === selectedGender.value && norm(c.code) === selectedRama.value
    ) ?? null
  )
})

const sendablePlayers = computed(() =>
  players.value.filter((p) => !!p.fullName.trim() && !!p.curp.trim() && !!p.photoFile)
)

const currentSeasonLabel = computed(() => currentSeason.value?.name || 'WT')

watch(selectedCategory, (c) => {
  selectedCategoryId.value = c?.id ?? 0
})

watch(
  () => selectedLeagueId.value,
  async () => {
    selectedSeasonId.value = currentSeason.value?.id ?? FALLBACK_SEASON_ID
    selectedGender.value = ''
    selectedRama.value = ''
    selectedCategoryId.value = 0
    await fetchCategories()
  }
)

watch(
  () => selectedSeasonId.value,
  () => {
    const must = currentSeason.value?.id ?? FALLBACK_SEASON_ID
    if (selectedSeasonId.value !== must) {
      selectedSeasonId.value = must
    }

    selectedGender.value = ''
    selectedRama.value = ''
    selectedCategoryId.value = 0
  }
)

watch(
  () => selectedGender.value,
  () => {
    selectedRama.value = ''
    selectedCategoryId.value = 0
  }
)

async function fetchSeasons() {
  try {
    const try1 = await $fetch<any>('/seasons/list', { baseURL: API_BASE }).catch(() => null)
    const raw = Array.isArray(try1)
      ? try1
      : await $fetch<any>('/seasons', { baseURL: API_BASE }).catch(() => [])

    const list = Array.isArray(raw) ? raw : []

    const mapped: SeasonOption[] = list
      .map((s: any) => {
        const id = Number(s?.id ?? s?.seasonId ?? s?.season_id ?? 0) || 0
        const name = String(s?.name ?? s?.seasonName ?? s?.title ?? `Temporada #${id}`).trim()
        const leagueId = Number(s?.leagueId ?? s?.league_id ?? s?.league?.id ?? 1) || 1
        return { id, name, leagueId }
      })
      .filter((s) => s.id > 0 && !!s.name)

    const wt = pickCurrentWT(mapped)

    if (wt) {
      currentSeason.value = wt
      seasons.value = [wt]
      selectedSeasonId.value = wt.id
      return
    }

    currentSeason.value = { id: FALLBACK_SEASON_ID, name: 'WT', leagueId: 1 }
    seasons.value = [currentSeason.value]
    selectedSeasonId.value = FALLBACK_SEASON_ID
  } catch (e) {
    console.error('Error cargando seasons', e)
    currentSeason.value = { id: FALLBACK_SEASON_ID, name: 'WT', leagueId: 1 }
    seasons.value = [currentSeason.value]
    selectedSeasonId.value = FALLBACK_SEASON_ID
  }
}

async function fetchCategories() {
  categoriesError.value = null

  try {
    categoriesLoading.value = true

    const leagueIdToUse = selectedLeagueId.value || DEFAULT_LEAGUE_ID

    const withLeague = await $fetch<any>('/categories', {
      baseURL: API_BASE,
      query: { leagueId: leagueIdToUse },
    }).catch(() => null)

    let normalized = normalizeCategories(withLeague)

    if (!normalized.length) {
      const fallback = await $fetch<any>('/categories', {
        baseURL: API_BASE,
      }).catch(() => [])

      normalized = normalizeCategories(fallback)
    }

    categories.value = normalized
  } catch (e) {
    console.error('Error cargando /categories', e)
    categoriesError.value = 'No se pudieron cargar las categorías.'
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

function nextPlayerId() {
  const maxId = players.value.reduce((mx, p) => Math.max(mx, p.id), 0)
  return maxId + 1
}

function addPlayer() {
  players.value.push(createEmptyPlayer(nextPlayerId()))
}

function removePlayer(index: number) {
  if (index < 0 || index >= players.value.length) return

  const p = players.value[index]
  if (p?.photoPreview) URL.revokeObjectURL(p.photoPreview)
  players.value.splice(index, 1)
}

function onLogoChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null

  if (!file) {
    logoFile.value = null
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = null
    return
  }

  logoFile.value = file
  if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  logoPreview.value = URL.createObjectURL(file)
}

function onPlayerPhotoChange(index: number, event: Event) {
  const player = players.value[index]
  if (!player) return

  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null

  if (!file) {
    player.photoFile = null
    if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
    player.photoPreview = null
    return
  }

  player.photoFile = file
  if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
  player.photoPreview = URL.createObjectURL(file)
}

function saveDraft() {
  try {
    const forcedSeasonId = currentSeason.value?.id ?? FALLBACK_SEASON_ID

    const draft: DraftData = {
      teamName: teamName.value,
      teamShortName: teamShortName.value,
      colorPrimary: colorPrimary.value,
      colorSecondary: colorSecondary.value,
      leagueId: selectedLeagueId.value,
      seasonId: forcedSeasonId,
      categoryId: selectedCategoryId.value,
      gender: selectedGender.value,
      rama: selectedRama.value,
      players: players.value.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        curp: p.curp,
        jerseyNumber: p.jerseyNumber === null ? undefined : p.jerseyNumber,
      })),
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      successMessage.value = 'Cambios guardados localmente. No se ha enviado aún a la liga.'
      errorMessage.value = ''
    }
  } catch (e) {
    console.error('Error guardando borrador:', e)
    errorMessage.value = 'No se pudo guardar el borrador local.'
  }
}

function loadDraft() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return

    const draft = JSON.parse(raw) as DraftData

    teamName.value = draft.teamName ?? ''
    teamShortName.value = draft.teamShortName ?? ''

    if (draft.colorPrimary) colorPrimary.value = draft.colorPrimary
    if (draft.colorSecondary) colorSecondary.value = draft.colorSecondary

    selectedLeagueId.value = draft.leagueId ?? DEFAULT_LEAGUE_ID
    selectedSeasonId.value = currentSeason.value?.id ?? FALLBACK_SEASON_ID
    selectedGender.value = draft.gender ?? ''
    selectedRama.value = draft.rama ?? ''
    selectedCategoryId.value = draft.categoryId ?? 0

    const playersDraft = draft.players ?? []
    players.value = playersDraft.map((p, idx) => ({
      id: p.id ?? idx + 1,
      fullName: p.fullName ?? '',
      curp: p.curp ?? '',
      jerseyNumber: typeof p.jerseyNumber === 'number' ? p.jerseyNumber : null,
      photoFile: null,
      photoPreview: null,
    }))
  } catch (e) {
    console.error('Error cargando borrador:', e)
  }
}

function clearProgress() {
  resetFormFields()

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(DRAFT_KEY)
  }

  successMessage.value = ''
  errorMessage.value = ''
}

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!summary.value?.hasCaptainPrivileges) {
    errorMessage.value = 'Tu usuario no tiene rol de capitán.'
    return
  }

  if (!summary.value?.canCreateTeam) {
    errorMessage.value = 'Actualmente no puedes registrar más equipos.'
    return
  }

  if (!teamName.value.trim()) {
    errorMessage.value = 'Ingresa el nombre del equipo antes de subir la información.'
    return
  }

  const forcedSeasonId = currentSeason.value?.id ?? FALLBACK_SEASON_ID
  selectedSeasonId.value = forcedSeasonId

  if (!selectedLeagueId.value || !selectedSeasonId.value || !selectedCategoryId.value) {
    errorMessage.value = 'Selecciona liga, temporada, categoría y rama antes de registrar el equipo.'
    return
  }

  let createdTeamId: number | null = null
  let createdTeamName = ''

  try {
    submitting.value = true

    const { $kcGetToken } = nuxtApp as any
    const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
    const token = tokenFn ? ((await tokenFn()) ?? '') : ''

    if (!token) {
      errorMessage.value = 'No se encontró un token de sesión. Vuelve a iniciar sesión.'
      return
    }

    const createdTeam = await $fetch<CreatedTeam>('/teams/mine', {
      baseURL: API_BASE,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        name: teamName.value.trim(),
        shortName: teamShortName.value.trim() || null,
        leagueId: selectedLeagueId.value,
        seasonId: forcedSeasonId,
        categoryId: selectedCategoryId.value,
        colorPrimary: colorPrimary.value,
        colorSecondary: colorSecondary.value,
      },
    })

    createdTeamId = createdTeam.teamId
    createdTeamName = createdTeam.name

    if (logoFile.value && createdTeamId) {
      const formLogo = new FormData()
      formLogo.append('logo', logoFile.value)

      await $fetch(`/teams/${createdTeamId}/logo`, {
        baseURL: API_BASE,
        method: 'POST',
        body: formLogo,
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    if (createdTeamId && sendablePlayers.value.length > 0) {
      for (const p of sendablePlayers.value) {
        const formPlayer = new FormData()
        formPlayer.append('fullName', p.fullName.trim())
        formPlayer.append('curp', p.curp.trim().toUpperCase())

        if (typeof p.jerseyNumber === 'number' && Number.isFinite(p.jerseyNumber)) {
          formPlayer.append('jerseyNumber', String(p.jerseyNumber))
        }

        formPlayer.append('photo', p.photoFile as File)

        try {
          await $fetch(`/teams/${createdTeamId}/players`, {
            baseURL: API_BASE,
            method: 'POST',
            body: formPlayer,
            headers: { Authorization: `Bearer ${token}` },
          })
        } catch (errPlayer: any) {
          const status = getStatusCode(errPlayer)

          if (status === 413) {
            successMessage.value =
              'El equipo se creó correctamente, pero una o más fotos pesan demasiado y no se pudieron subir. Usa fotos más ligeras y súbelas después desde "Mi equipo".'
            errorMessage.value = ''
            break
          } else {
            console.error('Error creando jugador', errPlayer)
          }
        }
      }
    }

    await loadMyTeam()
    clearProgress()
    panelMode.value = 'list'
    successMessage.value = `Equipo "${createdTeamName}" registrado correctamente.`
    errorMessage.value = ''
    editMenuTeamId.value = createdTeamId
    replaceRouteQuery({})
  } catch (err: any) {
    console.error('Error al enviar registro:', err)
    const status = getStatusCode(err)

    const rawMessage: string | undefined =
      err?.data?.message ?? err?.response?._data?.message ?? err?.message

    if (rawMessage && rawMessage.includes('uq_team_league_name')) {
      errorMessage.value =
        'Ya existe un equipo con ese nombre en esta liga. Elige otro nombre o contacta al administrador.'
    } else if (status === 413) {
      errorMessage.value =
        'La información enviada (logo o fotos) supera el tamaño máximo permitido. Intenta con archivos más ligeros.'
    } else {
      errorMessage.value =
        'Ocurrió un error al subir la información. Si ves 500, revisa los logs del back/BD.'
    }
  } finally {
    submitting.value = false
  }
}

function onEditPreviewSubmit() {
  if (!editingTeam.value) {
    errorMessage.value = 'No se encontró el equipo que quieres editar.'
    return
  }

  successMessage.value =
    `Ya abriste la edición de "${editingTeam.value.name}" dentro de Mi equipo. ` +
    'La parte visual ya está lista; solo falta conectar el guardado real de edición si lo quieres activo aquí.'
  errorMessage.value = ''
}

function syncPanelFromRoute() {
  const view = String(route.query.view || '')
  const teamId = Number(route.query.teamId ?? route.query.editTeamId ?? 0) || 0

  if (view === 'register') {
    if (summary.value?.canCreateTeam) {
      panelMode.value = 'register'
      editingTeamId.value = null
    } else {
      panelMode.value = 'list'
      editingTeamId.value = null
    }
    return
  }

  if (view === 'edit') {
    if (teamId > 0) {
      router.replace(`/teams/${teamId}/editar`).catch(() => {})
    } else if (!loading.value) {
      errorMessage.value = 'No se encontró el equipo para editar.'
    }

    panelMode.value = 'list'
    editingTeamId.value = null
    return
  }

  panelMode.value = 'list'
  editingTeamId.value = null
}

watch(
  () => ({ ready: kcReady.value, auth: authOk.value }),
  ({ ready, auth }) => {
    if (ready && auth) {
      loadMyTeam()
    }
  },
  { immediate: true }
)

watch(
  normalizedTeams,
  (teams) => {
    if (editMenuTeamId.value && !teams.some((team) => team.teamId === editMenuTeamId.value)) {
      editMenuTeamId.value = null
    }

    if (editingTeamId.value && !teams.some((team) => team.teamId === editingTeamId.value)) {
      editingTeamId.value = null
      if (panelMode.value === 'edit') {
        panelMode.value = 'list'
      }
    }

    if (teamPendingDelete.value && !teams.some((team) => team.teamId === teamPendingDelete.value?.teamId)) {
      closeDeleteDialog()
    }
  },
  { immediate: true }
)

watch(
  [() => route.fullPath, normalizedTeams, () => summary.value?.canCreateTeam, () => loading.value],
  () => {
    syncPanelFromRoute()
  },
  { immediate: true }
)

onMounted(async () => {
  await fetchSeasons()
  loadDraft()
  selectedSeasonId.value = currentSeason.value?.id ?? FALLBACK_SEASON_ID
  await fetchCategories()
  syncPanelFromRoute()
})

onBeforeUnmount(() => {
  if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  for (const p of players.value) {
    if (p.photoPreview) URL.revokeObjectURL(p.photoPreview)
  }
})
</script>
