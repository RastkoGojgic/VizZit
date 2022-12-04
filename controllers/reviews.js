const { Place } = require("../models/places")
const { Review } = require("../models/reviews")



module.exports.createReview = async(req, res)=>{
    const { id } = req.params
    const place = await Place.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    place.reviews.push(review)
    await review.save()
    await place.save()
    req.flash("success", "Successfully created a review")
    res.redirect(`/places/${id}`)
}


module.exports.deleteReview = async(req, res)=>{
    const { id, reviewID } = req.params
    await Place.findByIdAndUpdate(id, {$pull:{reviews:reviewID}})
    await Review.findByIdAndDelete(reviewID)
    req.flash("success", "Successfully deleted a review")
    res.redirect(`/places/${id}`)
}