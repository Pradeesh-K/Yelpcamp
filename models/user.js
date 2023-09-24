const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Username cannot be blank'],
        unique:true
    },
    
})

userSchema.plugin(passportLocalMongoose);   // this is going to add username and password to our schema


module.exports = mongoose.model('User', userSchema);