<!-- app/layouts/default.vue -->
<template>
  <div
    class="min-h-screen text-foreground font-body"
    :class="[
      isLightPage ? 'bg-[#F3F4FF]' : 'bg-background',
      isDomingoSite ? 'domingo-ui' : '',
      { 'pb-24 sm:pb-0': isAdmin }
    ]"
  >
    <!-- HEADER GLOBAL -->
    <header
      class="relative z-[80] overflow-visible border-b border-white/8 bg-[linear-gradient(90deg,#0B1220_0%,#18243A_45%,#2A3448_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
    >
      <div class="mx-auto max-w-7xl px-6">
        <nav class="relative flex items-center justify-between py-5">
          <!-- LOGO -->
          <NuxtLink to="/" class="flex shrink-0 items-center gap-3" @click="closeMobile">
            <span
              class="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black/20 ring-1 ring-white/10 shadow-sm"
              aria-hidden="true"
            >
              <img
                src="/img/sponsors/Tochero5.JPG"
                alt="Tochero5"
                class="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </span>

            <span class="font-display whitespace-nowrap text-[1.8rem] font-extrabold tracking-tight text-white sm:text-[2.1rem]">
              tochero<span class="text-[#60A5FA]">5</span>liga
            </span>
          </NuxtLink>

          <!-- NAV DESKTOP -->
          <div class="hidden items-center gap-5 text-[15px] sm:flex">
            <NuxtLink to="/domingo" :class="publicLinkClass('/domingo')">
              Inicio
            </NuxtLink>

            <NuxtLink to="/partidos" :class="publicLinkClass('/partidos')">
              Partidos
            </NuxtLink>

            <NuxtLink to="/equipos" :class="publicLinkClass('/equipos')">
              Equipos
            </NuxtLink>

            <NuxtLink to="/estadisticas" :class="publicLinkClass('/estadisticas')">
              Estadísticas
            </NuxtLink>

            <NuxtLink
              v-if="showMiEquipo"
              to="/mi-equipo"
              :class="publicLinkClass('/mi-equipo')"
            >
              Registro
            </NuxtLink>

            <!-- Admin dropdown -->
            <div v-if="isAdmin" ref="adminWrap" class="relative z-[90]">
              <button
                type="button"
                class="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#111A2D] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:bg-[#16213A]"
                :aria-expanded="adminOpen ? 'true' : 'false'"
                aria-haspopup="menu"
                @click="toggleAdmin"
              >
                <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.5 12.5l1.7 1.7 3.8-4.2"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Admin
                <svg class="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-120 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
              >
                <div
                  v-if="adminOpen"
                  class="absolute right-0 top-full z-[120] mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#07101F] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                  role="menu"
                >
                  <div class="border-b border-white/10 bg-[#0A1428] px-4 py-4">
                    <p class="text-[11px] uppercase tracking-[0.24em] text-slate-400">Panel Admin</p>
                    <p class="mt-1 text-sm font-semibold text-white">Accesos rápidos</p>
                  </div>

                  <div class="grid gap-1.5 p-2">
                    <NuxtLink
                      to="/admin/inicio"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/admin/inicio') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.8 12.8 19 8.6l1.4 1.4-4.2 4.2-2.2.8.8-2.2Z"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Inicio</p>
                        <p class="text-[11px] text-slate-400">Editar Home</p>
                      </div>
                    </NuxtLink>

                    <NuxtLink
                      to="/domingo/admin/temporadas"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/domingo/admin/temporadas') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M8 2v4M16 2v4M4 9h16"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                          <path
                            d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 13v5M9.5 15.5h5"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Temporadas</p>
                        <p class="text-[11px] text-slate-400">Crear temporada</p>
                      </div>
                    </NuxtLink>

                    <NuxtLink
                      to="/admin/partidos"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/admin/partidos') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M8 3h8v3H8V3z" stroke="currentColor" stroke-width="1.6" />
                          <path d="M6 6h12v15H6V6z" stroke="currentColor" stroke-width="1.6" />
                          <path
                            d="M9 10h6M9 14h6M9 18h6"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Partidos</p>
                        <p class="text-[11px] text-slate-400">Administración</p>
                      </div>
                    </NuxtLink>

                    <NuxtLink
                      to="/admin/usuarios"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/admin/usuarios') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6" />
                          <path
                            d="M22 21v-2a4 4 0 0 0-3-3.87"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                          <path
                            d="M16 3.13a4 4 0 0 1 0 7.75"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Usuarios</p>
                        <p class="text-[11px] text-slate-400">Roles / acceso</p>
                      </div>
                    </NuxtLink>

                    <NuxtLink
                      to="/admin/jugadores"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/admin/jugadores') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6" />
                          <path
                            d="M3 21a9 9 0 0 1 18 0"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Jugadores</p>
                        <p class="text-[11px] text-slate-400">Gestión</p>
                      </div>
                    </NuxtLink>

                    <NuxtLink
                      to="/admin/equipos"
                      class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                      :class="isActive('/admin/equipos') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                      @click="adminOpen = false"
                    >
                      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#0D1930]">
                        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-white">Equipos</p>
                        <p class="text-[11px] text-slate-400">Borrar / limpiar</p>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>

            <a
              href="https://www.instagram.com/tochero5liga"
              target="_blank"
              rel="noopener"
              class="text-white/75 transition hover:text-white"
              aria-label="Instagram"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
              </svg>
            </a>

            <NuxtLink
              to="/"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-blue-300/40 hover:bg-blue-500/10 hover:text-white"
              aria-label="Ir al home"
              title="Ir al home"
            >
              <Home class="h-5 w-5" />
            </NuxtLink>

            <button
              v-if="kcReady"
              class="whitespace-nowrap rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
              @click="onAuthClick"
            >
              {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
            </button>

            <span v-else class="text-xs text-white/60">Inicializando…</span>
          </div>

          <!-- NAV MOBILE -->
          <div class="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              class="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 active:scale-[0.99]"
              :aria-expanded="mobileOpen ? 'true' : 'false'"
              aria-controls="mobile-menu"
              @click="toggleMobile"
            >
              <span class="inline-flex items-center gap-2">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                Menú
              </span>
            </button>
          </div>
        </nav>

        <!-- PANEL MOBILE -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div v-if="mobileOpen" class="sm:hidden">
            <div class="fixed inset-0 z-40 bg-black/60" @click="closeMobile" />

            <div id="mobile-menu" class="absolute inset-x-0 top-full z-50">
              <div class="mx-4 mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#07101F] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div class="grid gap-1 p-3 text-sm">
                  <NuxtLink to="/domingo" class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8" @click="closeMobile">
                    Inicio
                  </NuxtLink>

                  <NuxtLink to="/partidos" class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8" @click="closeMobile">
                    Partidos
                  </NuxtLink>

                  <NuxtLink to="/equipos" class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8" @click="closeMobile">
                    Equipos
                  </NuxtLink>

                  <NuxtLink to="/estadisticas" class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8" @click="closeMobile">
                    Estadísticas
                  </NuxtLink>

                  <NuxtLink
                    v-if="showMiEquipo"
                    to="/mi-equipo"
                    class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8"
                    @click="closeMobile"
                  >
                    Registro
                  </NuxtLink>

                  <NuxtLink
                    v-if="isAdmin"
                    to="/domingo/admin/temporadas"
                    class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8"
                    @click="closeMobile"
                  >
                    Temporadas
                  </NuxtLink>

                  <NuxtLink
                    to="/"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/8"
                    @click="closeMobile"
                  >
                    <Home class="h-4 w-4" />
                    Home
                  </NuxtLink>
                </div>

                <div class="flex items-center justify-between gap-3 border-t border-white/10 px-4 pb-4 pt-3">
                  <a
                    href="https://www.instagram.com/tochero5liga"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                    @click="closeMobile"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                      <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                    </svg>
                    Instagram
                  </a>

                  <button
                    v-if="kcReady"
                    class="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
                    @click="onAuthClick(); closeMobile()"
                  >
                    {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
                  </button>

                  <span v-else class="text-xs text-slate-400">Inicializando…</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>

    <slot />

    <!-- Dock admin móvil -->
    <div v-if="isAdmin" class="fixed bottom-0 inset-x-0 z-30 sm:hidden" aria-label="Admin dock">
      <div class="mx-auto max-w-6xl px-4 pb-3">
        <div class="rounded-2xl border border-white/10 bg-[#07101F] px-2 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div class="grid grid-cols-6 gap-1">
            <NuxtLink
              to="/admin/inicio"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/admin/inicio') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.8 12.8 19 8.6l1.4 1.4-4.2 4.2-2.2.8.8-2.2Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              Inicio
            </NuxtLink>

            <NuxtLink
              to="/domingo/admin/temporadas"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/domingo/admin/temporadas') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M8 2v4M16 2v4M4 9h16"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <path
                  d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 13v5M9.5 15.5h5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              Temp.
            </NuxtLink>

            <NuxtLink
              to="/admin/partidos"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/admin/partidos') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 3h8v3H8V3z" stroke="currentColor" stroke-width="1.6" />
                <path d="M6 6h12v15H6V6z" stroke="currentColor" stroke-width="1.6" />
                <path d="M9 10h6M9 14h6M9 18h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              Partidos
            </NuxtLink>

            <NuxtLink
              to="/admin/usuarios"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/admin/usuarios') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M22 21v-2a4 4 0 0 0-3-3.87"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              Usuarios
            </NuxtLink>

            <NuxtLink
              to="/admin/jugadores"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/admin/jugadores') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6" />
                <path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              Jug.
            </NuxtLink>

            <NuxtLink
              to="/admin/equipos"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition"
              :class="isActive('/admin/equipos') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="h-5 w-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Equipos
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Home } from 'lucide-vue-next'
import { useNuxtApp, useRoute, useState } from '#imports'
import { useAuthz } from '~/composables/useAuthz'
import { useBackendUser } from '~/composables/useBackendUser'

const mobileOpen = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}

const route = useRoute()

const isLightPage = computed(() => {
  return route.path === '/mi-equipo' || route.path === '/domingo' || route.path === '/'
})

const isDomingoSite = computed(() => {
  return (
    route.path === '/' ||
    route.path === '/domingo' ||
    route.path.startsWith('/partidos') ||
    route.path.startsWith('/equipos') ||
    route.path.startsWith('/estadisticas') ||
    route.path.startsWith('/registro') ||
    route.path.startsWith('/mi-equipo') ||
    route.path.startsWith('/domingo/admin')
  )
})

function isPublicActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function publicLinkClass(path: string) {
  return isPublicActive(path)
    ? 'whitespace-nowrap font-semibold text-white transition'
    : 'whitespace-nowrap text-white/75 hover:text-white transition'
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    adminOpen.value = false
  }
)

watch(mobileOpen, (open) => {
  if (typeof window === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  document.documentElement.style.overflow = ''
})

const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz() as any

const showMiEquipo = computed(() => kcReady.value && !!isAuthenticated.value)

const isAdmin = computed<boolean>(() => {
  if (!kcReady.value || !isAuthenticated.value) return false

  const kc = (nuxtApp as any).$kc
  const tp = kc?.tokenParsed as any
  if (!tp) return false

  const realmRoles: string[] = tp?.realm_access?.roles ?? []
  const azp = tp?.azp
  const clientKey = azp || 'nuxt-app'
  const clientRoles: string[] =
    tp?.resource_access?.[clientKey]?.roles ??
    tp?.resource_access?.['nuxt-app']?.roles ??
    []

  const roles = [...realmRoles, ...clientRoles].map((r) => String(r).toLowerCase())
  return roles.includes('admin')
})

const onAuthClick = () => {
  const kc = (nuxtApp as any).$kc
  if (typeof window === 'undefined' || !kc) return

  if (isAuthenticated.value) {
    kc.logout({ redirectUri: window.location.origin })
  } else {
    kc.login({ redirectUri: window.location.href })
  }
}

const { backendUserSynced: meSynced, syncBackendUser: syncMe } = useBackendUser()

watch(
  () => ({ ready: kcReady.value, auth: isAuthenticated.value }),
  async ({ ready, auth }) => {
    if (ready && auth && !meSynced.value) {
      await syncMe()
    }
  },
  { immediate: true }
)

const adminOpen = ref(false)
const adminWrap = ref<HTMLElement | null>(null)

const toggleAdmin = () => {
  adminOpen.value = !adminOpen.value
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function onDocClick(e: MouseEvent) {
  if (!adminOpen.value) return
  const el = adminWrap.value
  const target = e.target as Node | null
  if (el && target && !el.contains(target)) {
    adminOpen.value = false
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  document.addEventListener('click', onDocClick, { capture: true })
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  document.removeEventListener('click', onDocClick, { capture: true } as any)
})
</script>