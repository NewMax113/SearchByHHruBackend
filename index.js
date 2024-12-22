import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { toDoApiObjectVacancies } from './Service/todoApiObjectVacancies.js'
import { ProcessorFacade } from './Service/getCompanyInformation.js'

const app = express()
const port = 3001

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  console.log(req.query, 'получили')
  let urlParams = ''
  let token = ''

  for (let key in req.query) {
    if (key == 'token') {
      token = req.query[key]

    } else {
      if (typeof req.query[key] === 'object') {
        req.query[key].map(element => {
          urlParams += req.query[key] && `&${key}=${element}`
        })

      } else {
        urlParams += req.query[key] && `&${key}=${req.query[key]}`
      }
    }
  }
  console.log(urlParams, 'распределили')

  try {
    const resultFun = async () => {
      const start = Date.now();
      let vacancy = await toDoApiObjectVacancies(urlParams, token)
      const end = Date.now();

      console.log(`Время выполнения: ${end - start} мс`)
      return vacancy
    }
    let data = await resultFun()
    console.log('Выполнил верно')
    res.send(data)

  } catch (error) {
    console.log('Выполнил с ошибкой')
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
});

app.post('/feedback', async (req, res) => {
  console.log( req.body)
  if (req?.body?.name) {
    let createResultParsing = new ProcessorFacade()
    let getResultParsing = createResultParsing.processAll(req.body.name, req.body.city, req.body.remoteWork, req.body.employer_id, req.body.token)
    res.send(await getResultParsing)
    console.log(await getResultParsing, 'res')
  } else {
    res.status(500).json({ error: 'fd' })
  }


})
//app.post('/feedback', (req, res) => `${req}`)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})