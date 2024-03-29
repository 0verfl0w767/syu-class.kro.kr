/**
 *    ____                  __________
 *   / __ \_   _____  _____/ __/ / __ \_      __
 *  / / / / | / / _ \/ ___/ /_/ / / / / | /| / /
 * / /_/ /| |/ /  __/ /  / __/ / /_/ /| |/ |/ /
 * \____/ |___/\___/_/  /_/ /_/\____/ |__/|__/
 *
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 *
 * @author 0verfl0w767
 * @link https://github.com/0verfl0w767
 * @license MIT LICENSE
 *
 */
const express = require('express')
const { param, validationResult } = require('express-validator')
const http = require('http')
const cors = require('cors')
const fs = require('fs')
const requestIp = require('request-ip')

const app = express()

const date = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = ('0' + (today.getMonth() + 1)).slice(-2)
  const day = ('0' + today.getDate()).slice(-2)
  return year + '-' + month + '-' + day
}

const time = () => {
  const today = new Date()
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2)
  const seconds = ('0' + today.getSeconds()).slice(-2)
  return hours + ':' + minutes + ':' + seconds
}

const prefix = () => {
  return '[' + date() + ' ' + time() + ']'
}

const userInfo = (req) => {
  console.log(prefix() + ' client IP: ' + requestIp.getClientIp(req))
  console.log(prefix() + ' url: ' + req.originalUrl)
};

app.use(cors({
  origin: "*",
  credentials: true,
}))

app.use('/', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  userInfo(req)
  res.status(200).sendFile(__dirname + '/page/index.html')
})

app.get('/department', (req, res) => {
  userInfo(req)
  res.status(200).sendFile(__dirname + '/page/department.html')
})

app.get('/info', (req, res) => {
  userInfo(req)
  res.status(200).sendFile(__dirname + '/page/info.html')
})

app.get('/api/docs', (req, res) => {
  userInfo(req)
  res.status(200).sendFile(__dirname + '/page/api/docs.html')
})

app.get('/api/college/v1/all', (req, res) => {
  userInfo(req)
  const jsonData = JSON.parse(fs.readFileSync(__dirname + '/data/학부(과).json', 'utf8'))
  res.status(200).json(jsonData)
})

app.get('/api/undergraduate/v1/:year/:semester/:id', 
  param('year').exists(), 
  param('year').isInt({min: 2000, max: 2023}), 
  param('semester').exists(), 
  param('semester').isInt({min: 1, max: 2}), 
  param('id').exists(), 
  param('id').isInt({min: 1, max: 63}), 
  (req, res) => {
    userInfo(req)
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
      return param + ': ' + msg
    }
    const result = validationResult(req).formatWith(errorFormatter)
    if (!result.isEmpty()){
      res.status(401).json(result)
      return
    }
    const year = req.params.year
    const semester = req.params.semester
    const convertSemester = { 1: '1학기 정규', 2: '2학기 정규' }
    const id = req.params.id
    const dirPath = __dirname + '/data/' + year + '/' + convertSemester[semester]
    const undergraduates = JSON.parse(fs.readFileSync(dirPath + '/학부(과).json', 'utf8'))
    let undergraduateData = null
    for (const index in undergraduates['api']){
      if (undergraduates['api'][index]['식별번호'] == id){
        undergraduateData = undergraduates['api'][index]
      }
    }
    if (undergraduateData === null){
      res.status(401).json({ statusCode: 401, message: 'unknown request.' })
      return
    }
    const jsonData = JSON.parse(fs.readFileSync(dirPath + '/전체대학/' + undergraduateData['학부(과)'] + '.json', 'utf8'))
    res.status(200).json(jsonData)
  }
)

// app.get('/api_show', (req, res) => {
//   userInfo(req)
//   res.status(200).sendFile(__dirname + '/data/syu_api.json')
// })

app.get('*', (req, res) => {
  userInfo(req)
  res.status(404).json({ statusCode: 404, message: 'unknown request.' })
})

http.createServer(app).listen(3000, '0.0.0.0')