require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const _ = require('lodash')
const md5 = require('md5')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
mongoose.connect('mongodb://localhost:27017/userDB')
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/register', (req, res) => {
  const email = req.body.username
  const password = md5(req.body.password)
  const newUser = new User({
    username: email,
    password: password,
  })
  newUser.save((err) => {
    if (!err) {
      res.render('secrets')
    } else {
      console.log(err)
    }
  })
})
app.post('/login', (req, res) => {
  const usernameUser = req.body.username
  const passwordUser = md5(req.body.password)
  User.findOne({ username: usernameUser }, (err, userFound) => {
    if (!err) {
      if (userFound) {
        if (userFound.password === passwordUser) {
          res.render('secrets')
        } else {
          res.send('You entered wrong Email or Password!')
        }
      }
    } else {
      console.log(err)
    }
  })
})

app.listen(3000, () => {
  console.log('server is running on port 3000.')
})
