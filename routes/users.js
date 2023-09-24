const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');// .. since now we are in the routes directory and we have to go back to access other directories
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post( catchAsync(users.register));

router.route('/login')
    .get( users.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

router.get('/logout', users.logout)

module.exports = router;
