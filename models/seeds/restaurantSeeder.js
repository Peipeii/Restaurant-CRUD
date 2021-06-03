const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const RestaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')

  for (var key in RestaurantList.results) {
    //console.log(key, RestaurantList.results[key])
    Restaurant.create(RestaurantList.results[key])
  }
  console.log('restaurant seeder done')
})