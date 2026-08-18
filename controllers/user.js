const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Registration successful! Welcome to RealStay.");
            return res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res)=>{
     res.render("users/login.ejs");
};


module.exports.login = async(req, res)=>{
   req.flash("success", "Welcome back! You have successfully signed in to RealStay.");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "You have been logged out successfully. See you again soon!");
        res.redirect("/listings");
    })
};