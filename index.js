import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { toDoApiObjectVacancies } from './Service/todoApiObjectVacancies.js'
import { employerParsing } from './Parsing/Employer/employerParsing.js'
import { ogrnParsing } from './Parsing/OGRM/ogrnParsing.js'
import { getCompanyInformation } from './Parsing/OGRM/getCompanyInformation.js'
import { chekingLinks } from './Parsing/OGRM/checkingLinks.js'


const app = express()
const port = 3000


app.use(cors());
app.use(express.json());


//contollers/searchWorldController.js
const searchWordController = async (req, res) => {
  let content = await toDoApiObjectVacancies()
  await res.send(content)
}

const employerParsingController = async (req, res) => {
  console.log(req.body)
  let content2 = await employerParsing(req.body.name)
  await res.send(content2)
}

//routes.js
//app.get('/', (req, res) => searchWordController(req, res))

app.get('/', async (req, res) => {
  


  console.log(req.query)
  let urlParams = ''
  for (let key in req.query) {
    urlParams += req.query[key] && `&${key}=${req.query[key]}`
  }

  const resultFun = async () => {
    const start = Date.now();
    let vacancy = await toDoApiObjectVacancies(urlParams)
    const end = Date.now();
  console.log(`Время выполнения: ${end - start} мс`)
    return vacancy
  }
  
  res.send(await resultFun())
});

// app.post('/feedback', (req, res) => employerParsingController(req, res))
//app.post('/feedback', (req, res) => `${req}`)

//парсим отзывы
//employerParsing('ООО Тануки')
//ogrnParsing()
let test = new getCompanyInformation()
test.getOGRNCompany()

//chekingLinks()


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})