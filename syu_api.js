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
  res.status(200).sendFile(__dirname + '/page/syu_api.html')
})

app.get('/api', (req, res) => {
  userInfo(req)
  const jsonFile = fs.readFileSync(__dirname + '/data/syu_api.json', 'utf8')
  const jsonData = JSON.parse(jsonFile)
  res.status(200).json(jsonData)
})

app.get('/api_show', (req, res) => {
  userInfo(req)
  res.status(200).sendFile(__dirname + '/data/syu_api.json')
})

app.get('*', (req, res) => {
  userInfo(req)
  res.status(404).json({ statusCode: 404, message: 'unknown request.' })
})

http.createServer(app).listen(3000, '0.0.0.0')