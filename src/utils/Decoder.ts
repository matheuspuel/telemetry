import * as D from 'io-ts/Decoder'

// Decoders are used to validate data coming from http requests, database queries, etc...

export const optional = <T>(
  decoder: D.Decoder<unknown, T>,
): D.Decoder<unknown, T | undefined> => ({
  decode: v => (v === undefined ? D.success(v) : decoder.decode(v)),
})

export const nonEmptyString = D.refine(
  (v: string): v is string => v.length > 0,
  'nonEmptyString',
)(D.string)

export const numberFromStringDecoder: D.Decoder<unknown, number> = {
  decode: v => {
    if (typeof v !== 'string') return D.failure(v, 'numberFromString')
    const n = +v
    if (isNaN(n)) return D.failure(v, 'numberFromString')
    else return D.success(n)
  },
}
