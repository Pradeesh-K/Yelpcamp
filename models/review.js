const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:{
        type:String,
    },
    rating:{
        type:Number
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    // price:{
    //     type:Number,
    // },
    // description:{
    //     type:String,
    //     // required:true
    // },
    // location:{
    //     type:String,
    //     // required:true
    // }
})

module.exports = mongoose.model('Review', reviewSchema);  //to export and use in other files
