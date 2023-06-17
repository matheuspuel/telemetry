import cors from 'cors'
import express from 'express'
import { LogController } from './infra/http/controllers/Log'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use('/api/v1/:app/logs', LogController)

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`)
})
