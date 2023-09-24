const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: {virtuals: true}};
const imageSchema = new Schema({url:String,
    filename:String,})
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_250');
});
const campgroundSchema = new Schema({
    title:{
        type:String,
        // required:true
    },
    // image:{
    //     type:String
    // },
    images:[imageSchema],
    price:{
        type:Number,
        // required: true,
        // min:0
    },
    description:{
        type:String,
        // required:true
    },
    location:{
        type:String,
        // required:true
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
    
},opts);

campgroundSchema.virtual('properties.popupMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substr(0,40)}...<p>`;
});

campgroundSchema.post('findOneAndDelete',async function (camp)  {
    if(camp ){
        const result = await Review.deleteMany({_id:{$in:camp.reviews}})
        console.log(result);
    }
})
//longway
const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;   //to export and use in other files


//shortway
// module.exports = mongoose.model('Campground', campgroundSchema);  //to export and use in other files
