import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { toDoApiObjectVacancies } from './Service/todoApiObjectVacancies.js'
import { employerParsing } from './Parsing/Employer/employerParsing.js'
import { ogrnParsing } from './Parsing/OGRM/ogrnParsing.js'
import { getCompanyInformation } from './Parsing/OGRM/getCompanyInformation.js'


const app = express()
const port = 3001


app.use(cors());
app.use(express.json());


//contollers/searchWorldController.js
const searchWordController = async (req, res) => {
  let content = await toDoApiObjectVacancies()
  await res.send(content)
}

const employerParsingController = async (req, res) => {
  console.log(await req.body.name)
  let content2 = await employerParsing(req.body.name)
  return content2
  //await res.send(content2)
}

//routes.js
//app.get('/', (req, res) => searchWordController(req, res))

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
    

    res.send(data)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }

});

// app.post('/feedback', (req, res) => employerParsingController(req, res))
//app.post('/feedback', (req, res) => `${req}`)

//парсим отзывы
 //employerParsing('ООО Тануки')
//ogrnParsing()
let test = new getCompanyInformation()
test.getresult()
//console.log(test.resI)
employerParsingController({body: {name: 'ВИТА'}})


//chekingLinks()


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})