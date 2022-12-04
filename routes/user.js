const express = require("express")
const { User } = require("../models/user")
const { checkAsync } = require("../utils/checkAsync")
const passport = require("passport")
const users = require("../controllers/users")

const router = express.Router()

router.route("/register")
    .get(users.renderRegister)
    .post(checkAsync(users.registerUser))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", keepSessionInfo: true}), users.loginUser)


router.get("/logout", users.logoutUser)



exports.userRoutes = router