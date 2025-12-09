<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'

const { $kc, $kcReady, $kcGetToken } = useNuxtApp()

const isReady = computed(() => $kcReady?.value === true)
const isAuth  = computed(() => $kc?.authenticated === true)

const myTeam = ref<any | null>(null)
const myTeamError = ref<string | null>(null)
const loadingTeam = ref(false)

const selectedFile = ref<File | null>(null)
const uploadLoading = ref(false)
const uploadError = ref<string | null>(null)
const uploadResult = ref<string | null>(null)

// Login / logout
const login  = () => $kc.login()
const logout = () => $kc.logout({ redirectUri: window.location.origin })

// 1) Cargar el equipo del capitán desde /api/teams/mine
const loadMyTeam = async () => {
  myTeam.value = null
  myTeamError.value = null
  loadingTeam.value = true

  try {
    const token = await $kcGetToken()
    if (!token) {
      myTeamError.value = 'No hay token, inicia sesión primero.'
      return
    }

    const res = await $fetch('http://tocho5-api.tochero5.mx/api/teams/mine', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    myTeam.value = res
  } catch (err: any) {
    console.error('Error /api/teams/mine:', err)
    myTeamError.value = err?.statusMessage || 'Error cargando /api/teams/mine'
  } finally {
    loadingTeam.value = false
  }
}

// 2) Cuando el usuario selecciona un archivo
const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null
  selectedFile.value = file
  uploadResult.value = null
  uploadError.value = null
}

// 3) Subir logo a /api/teams/{teamId}/logo
const uploadLogo = async () => {
  uploadResult.value = null
  uploadError.value = null

  if (!isAuth.value) {
    uploadError.value = 'Debes iniciar sesión.'
    return
  }

  if (!myTeam.value || !myTeam.value.teams || myTeam.value.teams.length === 0) {
    uploadError.value = 'No se encontró equipo asociado a este usuario (teams vacío).'
    return
  }

  if (!selectedFile.value) {
    uploadError.value = 'Selecciona un archivo primero.'
    return
  }

  // Tomamos el primer equipo donde es capitán
  const teamId = myTeam.value.teams[0].teamId

  uploadLoading.value = true
  try {
    const token = await $kcGetToken()
    if (!token) {
      uploadError.value = 'No hay token, inicia sesión primero.'
      return
    }

    const form = new FormData()
    form.append('logo', selectedFile.value)

    const res = await $fetch('http://tocho5-api.tochero5.mx/api/teams/' + teamId + '/logo', {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${token}`
        // ❗ NO pongas Content-Type aquí, el browser lo arma solo para multipart
      }
    })

    uploadResult.value = JSON.stringify(res, null, 2)
    // Podrías también actualizar myTeam para ver el nuevo logoUrl si el back lo devuelve
  } catch (err: any) {
    console.error('Error subiendo logo:', err)
    uploadError.value = err?.statusMessage || 'Error subiendo logo'
  } finally {
    uploadLoading.value = false
  }
}
</script>

<template>
  <main style="padding:24px;font-family:system-ui, sans-serif">
    <h1>Test subir logo equipo (R2)</h1>

    <p v-if="!isReady">Inicializando sesión con Keycloak…</p>

    <div v-else>
      <p>Auth: <strong>{{ isAuth ? 'Sí' : 'No' }}</strong></p>

      <div v-if="!isAuth">
        <button @click="login">Entrar con Keycloak</button>
      </div>

      <div v-else>
        <p>Usuario: <strong>{{ $kc?.tokenParsed?.preferred_username }}</strong></p>
        <button @click="logout">Salir</button>
      </div>

      <hr style="margin:16px 0;" />

      <!-- Sección: cargar mi equipo -->
      <section v-if="isAuth">
        <h2>1) Cargar mi equipo (/api/teams/mine)</h2>
        <button @click="loadMyTeam" :disabled="loadingTeam">
          {{ loadingTeam ? 'Cargando equipo…' : 'Cargar /api/teams/mine' }}
        </button>

        <p v-if="myTeamError" style="color:red;margin-top:8px;">
          {{ myTeamError }}
        </p>

        <pre v-if="myTeam" style="margin-top:8px; background:#f1f5f9; padding:8px; max-height:200px; overflow:auto;">
{{ myTeam }}
        </pre>

        <div v-if="myTeam && myTeam.teams && myTeam.teams.length > 0" style="margin-top:16px;">
          <p>
            Equipo detectado:
            <strong>{{ myTeam.teams[0].name }}</strong>
            (id: {{ myTeam.teams[0].teamId }})
          </p>
          <p v-if="myTeam.teams[0].logoUrl">
            Logo actual:
            <img :src="myTeam.teams[0].logoUrl" alt="Logo actual"
                 style="max-height:80px;display:block;margin-top:4px;">
          </p>
        </div>
      </section>

      <hr style="margin:16px 0;" />

      <!-- Sección: subir logo -->
      <section v-if="isAuth && myTeam && myTeam.teams && myTeam.teams.length > 0">
        <h2>2) Subir nuevo logo</h2>
        <input type="file" accept="image/*" @change="onFileChange" />

        <div style="margin-top:12px;">
          <button @click="uploadLogo" :disabled="uploadLoading || !selectedFile">
            {{ uploadLoading ? 'Subiendo logo…' : 'Subir logo' }}
          </button>
        </div>

        <p v-if="uploadError" style="color:red;margin-top:8px;">
          {{ uploadError }}
        </p>

        <pre v-if="uploadResult" style="margin-top:8px; background:#dcfce7; padding:8px;">
{{ uploadResult }}
        </pre>
      </section>
    </div>
  </main>
</template>
