export interface DOMEvent<T extends EventTarget> extends Event {
  target: T
  keyCode?: number
  key?: string
  view?: {
    getSelection: Function
  }
}

export interface Constructable<T> {
  new (...args: any): T
}

export type I18nMessageFunction = {
  type: string
  interpolate: Function
  named: Function
}

export * from './enums'
export * from './states'
