import Hotjar from 'vue-hotjar'
import { defineNuxtPlugin } from '#imports'
import posthog from 'posthog-js'


export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.env.VITE_HOTJAR_KEY) {
    nuxtApp.vueApp.use(Hotjar, {
      id: import.meta.env.VITE_HOTJAR_KEY
    })

    posthog.init('phc_YdXA7ceK04FIlu11Vwr03FMxSt9yrbotQT9r13uFhtL', { api_host: 'https://app.posthog.com' })
  }
})
