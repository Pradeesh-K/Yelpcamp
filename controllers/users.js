const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}

module.exports.register = async (req,res) => {
    try {
        const { email, password, username } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser,password);
    // await newUser.save();
    req.login(registeredUser,err =>{
        if(err){
            return next();
        }
        else {
            req.flash('success','Succesfully registered! Welcome to Yelpcamp');
            res.redirect(`/campgrounds`);
        }
    })
   }
    catch(e) {
        req.flash('error',e.message);
        res.redirect('users/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success','Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully logged out, see you again');
        res.redirect('/campgrounds');
    })
}