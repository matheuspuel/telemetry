import { LogLevel, S } from '../../utils/fp'

export interface LogInput extends S.Schema.To<typeof LogInput_> {}
const LogInput_ = S.struct({
  timestamp: S.number,
  event: S.string,
  data: S.unknown,
})
export const LogInput: S.Schema<
  S.Schema.From<typeof LogInput_>,
  LogInput
> = LogInput_

export interface LogInput2 extends S.Schema.To<typeof LogInput2_> {}
const LogInput2_ = S.struct({
  timestamp: S.number,
  message: S.unknown,
  annotations: S.array(S.tuple(S.string, S.unknown)),
  logLevel: S.literal(...LogLevel.allLevels.map(_ => _._tag)),
  spans: S.array(S.struct({ label: S.string, startTime: S.number })),
  cause: S.nullable(S.string),
})
export const LogInput2: S.Schema<
  S.Schema.From<typeof LogInput2_>,
  LogInput2
> = LogInput2_
