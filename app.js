require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const _ = require('lodash')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(session({
  secret: 'abcdef.',
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
})
userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/secrets', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('secrets')
  } else {
    res.redirect('/')
  }
})

app.post('/register', (req, res) => {
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (!err) { 
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')
      })
    } else {
      console.log(err)
      res.redirect('/register')
    }
  })
})
app.post('/login', (req, res) => {

})

app.listen(3000, () => {
  console.log('server is running on port 3000.')
})
