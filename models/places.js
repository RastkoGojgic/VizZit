const mongoose = require("mongoose")
const { Review } = require("./reviews")


const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_200") 
})

const options = {toJSON: {virtuals:true}}

const placeSchema = new mongoose.Schema({
    title: String,
    location: String,
    geometry: {

        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    images: [imageSchema],
    description: String,
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, options)

placeSchema.virtual("properties.popUpMarkup").get(function(){
    return `
    <strong><a href="/places/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,30)}...</p>
    `
})


placeSchema.post("findOneAndDelete", async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Place = mongoose.model("Place", placeSchema)

exports.Place = Place