import * as S from '@effect/schema/Schema'
import { LogLevel } from 'effect'

export interface LogInput extends S.Schema.Type<typeof LogInput_> {}
const LogInput_ = S.Struct({
  timestamp: S.Number,
  event: S.String,
  data: S.Unknown,
})
export const LogInput: S.Schema<
  LogInput,
  S.Schema.Encoded<typeof LogInput_>
> = LogInput_

export interface LogInput2 extends S.Schema.Type<typeof LogInput2_> {}
const LogInput2_ = S.Struct({
  timestamp: S.Number,
  message: S.Unknown,
  annotations: S.Array(S.Tuple(S.String, S.Unknown)),
  logLevel: S.Literal(...LogLevel.allLevels.map(_ => _._tag)),
  spans: S.Array(S.Struct({ label: S.String, startTime: S.Number })),
  cause: S.NullishOr(S.String),
})
export const LogInput2: S.Schema<
  LogInput2,
  S.Schema.Encoded<typeof LogInput2_>
> = LogInput2_
