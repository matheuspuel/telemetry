import * as S from '@effect/schema/Schema'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Client } from 'pg'
import { LogInput, LogInput2 } from 'src/domain/models/Log'

dotenv.config({ path: '.env' })

const pad = (digits: number) => (value: number) =>
  value.toString().padStart(digits, '0')

const pad2 = pad(2)

const formatTimestamp = (timestamp: number): string => {
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

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

const client = new Client({ connectionString: process.env.DATABASE_URL })

app.post('/api/v1/:app/logs', (req, res) => {
  try {
    const body: unknown = req.body
    const decodeResult = S.decodeUnknownEither(S.Array(LogInput))(body)
    if (decodeResult._tag === 'Left') {
      res.sendStatus(500)
      console.log('Decode error')
      return
    }
    res.json(null)
    const logs = decodeResult.right
    logs.map(l =>
      console.log(
        formatTimestamp(l.timestamp),
        req.params.app,
        l.event,
        JSON.stringify(l.data),
      ),
    )
    client.query(
      `
      INSERT INTO log
      (timestamp, event, data) VALUES
      ${logs
        .map(
          (l, i) =>
            `($${i * 3 + 1}::timestamp, $${i * 3 + 2}::text, $${
              i * 3 + 3
            }::json)`,
        )
        .join(',\n')}
    `,
      logs.flatMap(l => [new Date(l.timestamp), l.event, l.data]),
    )
  } catch (e) {
    console.log('httpHandlerError')
    console.log(e)
  }
})

app.post('/api/v2/:app/logs', (req, res) => {
  try {
    const body: unknown = req.body
    const decodeResult = S.decodeUnknownEither(S.Array(LogInput2))(body)
    if (decodeResult._tag === 'Left') {
      res.sendStatus(500)
      console.log('Decode error')
      return
    }
    res.json(null)
    const logs = decodeResult.right
    logs.map(l =>
      console.log(
        formatTimestamp(l.timestamp),
        req.params.app,
        l.logLevel,
        ...l.annotations.map(
          a => JSON.stringify(a[0]) + '=' + JSON.stringify(a[1]),
        ),
        ...l.spans.map(s => JSON.stringify(s.label) + '=' + s.startTime),
        JSON.stringify(l.message),
        ...(l.cause ? ['cause=' + JSON.stringify(l.cause)] : []),
      ),
    )
  } catch (e) {
    console.log('httpHandlerError2')
    console.log(e)
  }
})

app.get('/api/v1/data', async (req, res) => {
  if (req.header('auth') !== process.env.READ_API_KEY) {
    res.sendStatus(401)
    return
  }
  try {
    const result = await client.query(`SELECT * FROM log`)
    res.json(result.rows)
  } catch (e) {
    console.log('error getting data')
    console.log(e)
  }
})

client.on('error', e => {
  console.log('dbClientError')
  console.log(e)
})

client.connect().then(async () => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS log (
      timestamp timestamp NOT NULL,
      event text NOT NULL,
      data json NOT NULL
    )
  `)
  app.listen(port, () => {
    console.log(`Server listening on the port ${port}`)
  })
})
