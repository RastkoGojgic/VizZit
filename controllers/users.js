const { User } = require("../models/user");

module.exports.renderRegister = (req, res)=>{
    res.render("users/register")
}

module.exports.registerUser = async(req, res)=>{
    try {
        const { username, email, password } = req.body
        const user = new User({username, email})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to VizZitt")
            res.redirect("/places")
        })

    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/register")
    }

}

module.exports.renderLogin = (req, res)=>{
    res.render("users/login")
}


module.exports.loginUser = (req, res)=>{
    req.flash("success", "Welcome back")
    const redirectURL = req.session.returnTo || "/places"
    res.redirect(redirectURL)
}


module.exports.logoutUser = (req, res)=>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success', "Goodbye!");
        res.redirect('/places');
    })
}