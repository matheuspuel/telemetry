import { absurd } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'
import { HttpStatus } from '../infra/http/utils'
import { Failure, failure } from './Result'

/**
 * Union of all errors returned from the endpoints
 */
export type EndpointError = RequestValidationError | ResourceNotFoundError

export class RequestValidationError extends Error {
  public type = 'RequestValidationError' as const
  constructor(public error: D.DecodeError) {
    super()
  }
}

export class ResourceNotFoundError extends Error {
  public type = 'ResourceNotFoundError' as const
  constructor() {
    super()
  }
}

/**
 * Transforms any possible error into an http response
 */
export const handleError = (
  error: EndpointError,
): Failure<{ status: HttpStatus; message?: string }> => {
  switch (error.type) {
    case 'RequestValidationError': {
      const message = D.draw(error.error)
      console.warn('Request validation error:', message)
      return failure({ status: HttpStatus.INTERNAL_SERVER_ERROR, message })
    }
    case 'ResourceNotFoundError': {
      return failure({ status: HttpStatus.NOT_FOUND })
    }
    default: {
      // Exhaustiveness checking (ensures every possible case has been handled)
      return absurd<never>(error)
    }
  }
}
