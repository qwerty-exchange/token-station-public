import { defineStore } from 'pinia'
import { TokenFactoryModuleParams } from '@injectivelabs/sdk-ts/dist/cjs/client/chain/types/tokenfactory'
import { FactoryToken, Token, TokenType } from '@injectivelabs/token-metadata'
import {
  burnToken,
  changeTokenAdmin,
  createNewToken,
  mintToken,
  transferToken,
  transferMultiToken,
  updateTokenMetadata
} from './message'
import { fetchParams, fetchToken, fetchTokens } from './fetch'

type TokenStoreState = {
  params: TokenFactoryModuleParams
  userTokens: (FactoryToken & { admin: string; suply: string })[]
  chainTokens: Token[]
}

const initialStateFactory = (): TokenStoreState => ({
  params: { denomCreationFee: [] },
  userTokens: [],
  chainTokens: []
})

export const useTokenStore = defineStore('token', {
  state: (): TokenStoreState => initialStateFactory(),
  getters: {
    tokens: (state) => {
      return [...state.userTokens, ...state.chainTokens] as {
        denom: string
        symbol: string
        tokenType: TokenType
        decimals: number | undefined
      }[]
    }
  },
  actions: {
    createNewToken,
    updateTokenMetadata,
    mintToken,
    burnToken,
    transferToken,
    transferMultiToken,
    changeTokenAdmin,

    fetchParams,

    fetchTokens,
    fetchToken,

    reset() {
      useTokenStore().$reset()
    }
  }
})
