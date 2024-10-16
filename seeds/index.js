const mongoose = require('mongoose');
const Campground = require('../models/campground.js')
const cities = require('./cities.js')
const { places, descriptors } = require('./seedHelpers.js')

mongoose.connect("mongodb://localhost:27017/yelp-camp")
.then(() => {
  console.log("connected to db")
})
.catch((e) => {
  console.log(e)
}) 

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({})
  for(let i = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000)
    const camp = new Campground({
      author: '66a77c6a66647ee4b5a5f90a',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati doloribus quaerat a, eaque incidunt cum, ipsa ad perferendis id debitis facere ducimus natus dicta aspernatur totam repellat recusandae ut sint?Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati doloribus quaerat a, eaque incidunt cum, ipsa ad perferendis id debitis facere ducimus natus dicta aspernatur totam repellat recusandae ut sint',
      price: Math.floor(Math.random() * 20) + 10,
      image:`https://picsum.photos/400?random=${Math.random()}`
    })
    await camp.save();
  }
}

seedDB();