import cors from 'cors'
import express from 'express'
import { LogInputDecoder } from 'src/domain/models/Log'

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

app.get('/api/v1/:app/logs', (req, res) => {
  console.log(req.method)
  console.log(req.headers)
  console.log(req.body)
  console.log(req.url)
  const body: unknown = req.body
  const decodeResult = LogInputDecoder.decode(body)
  if (decodeResult._tag === 'Left') {
    console.log('Decode error')
    res.sendStatus(500)
    return
  }
  const data = decodeResult.right
  console.log(
    formatTimestamp(data.timestamp),
    data.event,
    JSON.stringify(data.data),
  )
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`)
})
