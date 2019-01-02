import express from 'express'
import { hello } from 'my-common'

const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  hello()
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
