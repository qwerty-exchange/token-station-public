import Buffer from 'buffer/';

export default defineNuxtPlugin(() => {
  window.Buffer = window.Buffer || Buffer.Buffer
  globalThis.Buffer = window.Buffer || Buffer.Buffer
})
