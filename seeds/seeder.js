const mongoose = require("mongoose")
const { Place } = require("../models/places")
const cities = require("./cities")
const { descriptors, places } = require("./seed-helper")

mongoose.connect('mongodb://localhost:27017/VizZitt')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(err, resp){
  console.log("Connected to the VizZitt database")
})

function getRandomItem(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}


async function seedDB(){
    await Place.deleteMany({})

    for(let i = 0; i < 501; i++){
        const rand1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*35)+20
        const place = new Place({
            author: "631a5c65cd1f3a22787d47a9",
            title: `${getRandomItem(descriptors)} ${getRandomItem(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            price: price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[rand1000].longitude,
                cities[rand1000].latitude
              ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/draxxddwf/image/upload/v1663698265/VizZitt/default_ejhbku.jpg',
                  filename: 'VizZitt/default_ejhbku'
                }
              ],
            
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos voluptatibus exercitationem neque eius nam iure earum laboriosam vel animi, consequatur ducimus iste maiores quasi aspernatur doloribus explicabo natus. Mollitia, architecto. Deserunt, recusandae non voluptatum deleniti enim quibusdam. Ipsam pariatur porro omnis excepturi ullam sapiente. At, dolorum deserunt? Hic, eum? Totam dolorum magni ut veritatis dicta voluptas, architecto quam atque harum?"
        })
        await place.save()
    }
}

seedDB()
.then(()=>{
    console.log("VizZitt database successfully seeded")
    db.close()
})
.catch((err)=>{
    console.log(err)
})