import * as D from 'io-ts/Decoder'

export type LogInput = {
  timestamp: number
  event: string
  data: unknown
}

export const LogInputDecoder: D.Decoder<unknown, LogInput> = D.struct({
  timestamp: D.number,
  event: D.string,
  data: D.id<unknown>(),
})
