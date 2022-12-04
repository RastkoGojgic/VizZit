const express = require("express")

const { checkAsync } = require("../utils/checkAsync")
const { Place } = require("../models/places")
const { ExpressError } = require("../utils/expressError")
const { isLoggedIn, isAuthor, validatePlace } = require("../middleware")
const places = require("../controllers/places")
const multer  = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage })

const router = express.Router()


router.route("/")
    .get(checkAsync(places.index))
    .post(isLoggedIn, upload.array("image"), validatePlace, checkAsync(places.createPlace))


router.get("/new", isLoggedIn, places.renderNewForm)

router.route("/:id")
    .get(checkAsync(places.showPlace))
    .put(isLoggedIn, isAuthor, upload.array("image"), validatePlace, checkAsync(places.updatePlace))
    .delete(isLoggedIn, isAuthor, checkAsync(places.deletePlace))

router.get("/:id/edit", isLoggedIn, isAuthor, checkAsync(places.renderEditForm))


exports.placeRoutes = router