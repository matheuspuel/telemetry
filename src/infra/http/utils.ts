import { Request, Response } from 'express'
import * as D from 'io-ts/Decoder'
import {
  EndpointError,
  handleError,
  RequestValidationError,
} from 'src/utils/Error'
import { Result } from 'src/utils/Result'

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Helper to transform procedure results into http responses
 */
const respond =
  (res: Response) =>
  (
    result: Result<
      {
        status: HttpStatus
        message?: string | undefined
      },
      unknown
    >,
  ) => {
    if (result.success) {
      res.json(result.value)
    } else if (result.error.message) {
      res.status(result.error.status).send(result.error.message)
    } else {
      res.sendStatus(result.error.status)
    }
  }

type RequestHandler = (req: Request, res: Response) => void | Promise<void>

/**
 * Helper to transform procedures into http request handlers
 *
 * @param decoder Request data validator
 */
export const route =
  <A>(decoder: D.Decoder<unknown, A>) =>
  (
    workflow: (args: A) => Promise<Result<EndpointError, unknown>>,
  ): RequestHandler =>
  async (req, res) => {
    const data = decoder.decode(req)
    if (data._tag === 'Left') {
      respond(res)(handleError(new RequestValidationError(data.left)))
    } else {
      const result = await workflow(data.right)
      if (result.success) {
        respond(res)(result)
      } else {
        respond(res)(handleError(result.error))
      }
    }
  }
