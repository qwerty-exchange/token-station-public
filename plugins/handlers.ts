/* eslint-disable no-console */
import {
  ErrorType,
  ThrownException,
  isThrownException,
  ChainCosmosErrorCode,
  TransactionException,
  formatNotificationDescription
} from '@injectivelabs/exceptions'
import { StatusCodes } from 'http-status-codes'
import { defineNuxtPlugin } from '#imports'
import { Modal } from '@/types/enums'
import { IS_PRODUCTION } from '~/app/utils/constants'

/**
 * As we conditionally include the nuxt-bugsnag module
 * the type of it can be undefined
 **/
declare let useBugsnag: () => any

const reportToUser = (error: ThrownException) => {
  const { error: errorToast } = useNotifications()

  // Timedout requests happening in the background should not be reported to the user
  if (
    error.type === ErrorType.HttpRequest &&
    error.code === StatusCodes.REQUEST_TOO_LONG
  ) {
    return
  }

  if (!(error instanceof TransactionException)) {
    return errorToast({
      title: error.message || 'Something happened'
    })
  }

  const { tooltip, description } = formatNotificationDescription(
    error.originalMessage
  )

  errorToast({ title: error.message, description })
}

const reportUnknownErrorToBugsnag = (error: Error) => {
  const newError = new Error(
    `The ${error.message} is not handled as an Exception - ${error.stack}`
  )

  console.warn(newError.message, newError.stack)
}

const handleInsufficientGas = (error: ThrownException) => {
  const accountStore = useAccountStore()
  const modalStore = useModalStore()

  if (accountStore.hasEnoughInjForGas) {
    return
  }

  if (error.contextCode !== ChainCosmosErrorCode.ErrInsufficientFee) {
    return
  }

  //modalStore.openModal({ type: Modal.InsufficientInjForGas })
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.warn(error, context, (error as any).stack)
  }

  window.onunhandledrejection = function (event: PromiseRejectionEvent) {
    const error = event.reason

    if (!IS_PRODUCTION) {
      return
    }

    if (!isThrownException(error)) {
      reportUnknownErrorToBugsnag(error)
    }
  }

  const errorHandler = (error: ThrownException) => {
    if (!isThrownException(error)) {
      return reportUnknownErrorToBugsnag(error)
    }

    reportToUser(error)

    console.warn(error.toObject())

    handleInsufficientGas(error)
  }

  return {
    provide: {
      onError: errorHandler
    }
  }
})
