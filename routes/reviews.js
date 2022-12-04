const express = require("express")

const { checkAsync } = require("../utils/checkAsync")
const { Place } = require("../models/places")
const { Review } = require("../models/reviews")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const reviews = require("../controllers/reviews")

const router = express.Router({mergeParams:true})


router.post("/", isLoggedIn, validateReview, checkAsync(reviews.createReview))

router.delete("/:reviewID", isLoggedIn, isReviewAuthor, checkAsync(reviews.deleteReview))


exports.reviewRoutes = router