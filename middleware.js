const { Place } = require("./models/places")
const { Review } = require("./models/reviews")
const { placeSchema, reviewSchema } = require("./schemas")
const { ExpressError } = require("./utils/expressError")


function isLoggedIn(req, res, next){
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in")
        return res.redirect("/login")
    }
    next()
}

exports.isLoggedIn = isLoggedIn


async function isAuthor(req, res, next){
    const { id } = req.params
    const place = await Place.findById(id)
    if(!place.author.equals(req.user._id)){
        req.flash("error", "You don't have a parmission to do that")
        return res.redirect(`/places/${id}`)
    }
    next()
}

exports.isAuthor = isAuthor

async function isReviewAuthor(req, res, next){
    const { id, reviewID } = req.params
    const review = await Review.findById(reviewID)
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You don't have a parmission to do that")
        return res.redirect(`/places/${id}`)
    }
    next()
}

exports.isReviewAuthor = isReviewAuthor


function validatePlace(req, res, next){
    const err = placeSchema.validate(req.body)
    if(err.error){
        throw new ExpressError(err.error.message, 404)
    }
    else{
        next()
    }
}

exports.validatePlace = validatePlace


function validateReview(req, res, next){
    const err = reviewSchema.validate(req.body)
    if(err.error){
        throw new ExpressError(err.error.message, 404)
    }
    else{
        next()
    }
}

exports.validateReview = validateReview