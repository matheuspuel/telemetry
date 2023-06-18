import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import * as D from 'io-ts/Decoder'
import { Client } from 'pg'
import { LogInputDecoder } from 'src/domain/models/Log'

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

const decoder = D.array(LogInputDecoder)

app.post('/api/v1/:app/logs', (req, res) => {
  const body: unknown = req.body
  const decodeResult = decoder.decode(body)
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
})

client.connect().then(() =>
  app.listen(port, () => {
    console.log(`Server listening on the port ${port}`)
  }),
)
