import { LocalStorage } from '@injectivelabs/utils'

// Singletons
export const localStorage: LocalStorage = new LocalStorage(`state`)
