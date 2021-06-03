// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js') //load restaurant model

// define express server variables
const app = express()
const port = 3000


// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))

// db connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

// routes setting
// get all restaurant
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// get a restaurant
app.get('/restaurants/:restaurant_id', (req, res) => {
  console.log('req.params.restaurant_id', req.params.restaurant_id)
})

app.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword
  res.render('index', { restaurants, keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
