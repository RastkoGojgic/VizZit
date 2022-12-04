const { cloudinary } = require("../cloudinary")
const { Place } = require("../models/places")
const { ExpressError } = require("../utils/expressError")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { placeSchema } = require("../schemas");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async(req, res)=>{
    const places = await Place.find({})
    res.render("places/index", { places })
}


module.exports.renderNewForm = (req, res)=>{
    res.render("places/new")
}

module.exports.createPlace = async(req, res)=>{


     const geoData = await geocoder.forwardGeocode({
        query: req.body.place.location,
        limit: 1
     }).send()
    const newPlace = new Place(req.body.place)
    newPlace.images = req.files.map(f =>({ url: f.path, filename: f.filename }))
    newPlace.author = req.user._id
    newPlace.geometry = geoData.body.features[0].geometry
    await newPlace.save()
    req.flash("success", "Successfully added a new place") 
    res.redirect(`/places/${newPlace._id}`)
}


module.exports.showPlace = async(req, res)=>{
    const { id } = req.params
    const place = await Place.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if(!place){
        req.flash("error", "Sorry but that page does not exist")
        return res.redirect("/places")
    }
    console.log(place)
    res.render("places/show", { place })
}


module.exports.renderEditForm = async(req, res)=>{
    const { id } = req.params
    const place = await Place.findById(id)
    if(!place){
        req.flash("error", "Sorry but that page does not exist")
        return res.redirect("/places")
    }
    res.render("places/edit", { place })
}


module.exports.updatePlace = async(req, res)=>{
    const { id } = req.params
    const place = await Place.findByIdAndUpdate(id, req.body.place)
    const images = req.files.map(f =>({ url: f.path, filename: f.filename }))
    place.images.push(...images)
    if(req.body.deleteImages){
        for(filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await place.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    await place.save()
    if(!req.body.place){
        throw new ExpressError("Invalid place data", 400)
    }
    req.flash("success", "Successfully edited a place")
    res.redirect(`/places/${id}`) 
}

module.exports.deletePlace = async(req, res)=>{
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted a place")
    res.redirect(`/places`) 
}