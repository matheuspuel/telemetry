import { Router } from 'express'
import * as D from 'io-ts/Decoder'
import { LogInputDecoder } from 'src/domain/models/Log'
import { route } from 'src/infra/http/utils'
import { success } from 'src/utils/Result'

const pad = (digits: number) => (value: number) =>
  value.toString().padStart(digits, '0')

const pad2 = pad(2)

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const y = pad(4)(date.getFullYear())
  const mo = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  const h = pad2(date.getHours())
  const m = pad2(date.getMinutes())
  const s = pad2(date.getSeconds())
  const ms = pad(3)(date.getMilliseconds())
  return `${y}-${mo}-${d} ${h}:${m}:${s}.${ms}`
}

export const LogController = Router().post(
  '/',
  route(
    D.struct({
      body: LogInputDecoder,
    }),
  )(async ({ body }) => {
    console.log(
      formatTimestamp(body.timestamp),
      body.event,
      JSON.stringify(body.data),
    )
    return success(undefined)
  }),
)
