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
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true })) //由於bodyParser is deprecated express 4

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

// go "new" page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const filteredRestaurant = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().trim().includes(keyword.toLocaleLowerCase().trim()) || restaurant.category.toLowerCase().trim().includes(keyword.toLocaleLowerCase().trim())
      })

      if (filteredRestaurant.length >= 0) {
        res.render('index', { restaurants: filteredRestaurant, keyword })
      }
    })
    .catch(error => console.log(error))
})


// add new restaurant
app.post('/restaurants', (req, res) => {
  console.log('add', req.body)
  return Restaurant.create(req.body)     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  console.log('update', req.body)
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.google_map = req.body.google_map
      restaurant.rating = req.body.rating
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// get a restaurant by id
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})



// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
