import cors from 'cors'
import express from 'express'
import path from 'path'
import { LogController } from './infra/http/controllers/Log'

const app = express()
const port = process.env.PORT || 8080
const clientDir = path.join(__dirname, '..', '..', '..', 'client', 'build')

app.use(cors())
app.use(express.json())
app.use(express.static(clientDir))

app.use((req, res, next) => {
  const now = new Date()
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  console.info(`${time} ${req.method} ${req.url}`)
  next()
})

app.use('/api/v1/:app/logs', LogController)

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`)
})
