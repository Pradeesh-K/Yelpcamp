const mongoose = require('mongoose');
const Campground = require('../models/campground'); //double dot because we are in seeds directory and we have to back out to get to models directory
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Review = require('../models/review');
// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
// const dbUrl = "mongodb://localhost:27017/yelp-camp";
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb+srv://ge84zon:WZnWHIqXyR5D7otP@base1.rkbpewi.mongodb.net/'

//to seed map location
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = 'pk.eyJ1IjoicHJhZGVlc2hrIiwiYSI6ImNsamcwaWV0YjAwYTUzZXBndXFpNXRuNncifQ.icNpJbs3JbQbqmlIsvmyUQ';
const geocoder = mbxGeocoding({accessToken:mapboxToken});


mongoose.connect(dbUrl)   //27017 is the standard port number for mongoDB if db doesn't exist it is created
    .then(() => {
        console.log('Mongo connection open');
    })
    .catch(err => {
        console.log('Oh no, Mongo express error');
        console.log(err);
    })


const sample = (array) => array[Math.floor(Math.random() * array.length)];
//these were local database ids
// const authorArray = ['6495f81c656fb780ebb35df6','64954de1a3b65d908eab6938','649410316304a1c3c46191d3']
//mongo atlas 
const authorArray = ['64a368504633b542f1c4459b','64a43e14f0924ede0d31812a','64e7c91c88fee208f42bb424','64e7c96688fee208f42bb4db']
//I can seed them with random images
const imageSeedArray = ['https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882543/Yelpcamp/brian-yurasits-cAVUdHxLgIw-unsplash_jsokb9.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882543/Yelpcamp/everett-mcintire-BPCsppbNRMI-unsplash_hdzlnm.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882542/Yelpcamp/vladimir-haltakov-9J4Id8uXcQU-unsplash_jqq2a6.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882542/Yelpcamp/chris-holder-uY2UIyO5o5c-unsplash_ufjfmu.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882542/Yelpcamp/rahul-bhosale-yBgC-qVCxMg-unsplash_kuiavx.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882542/Yelpcamp/wei-pan-Ta0A1miYZKc-unsplash_zzodwm.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687708730/samples/balloons.jpg','https://res.cloudinary.com/dt6vwovu0/video/upload/v1687708724/samples/elephants.mp4','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687708720/samples/landscapes/nature-mountains.jpg','https://res.cloudinary.com/dt6vwovu0/image/upload/v1687708731/samples/breakfast.jpg'];
const randomImages = () => {
    const imageArray = [];
    const numberOfImages =  Math.floor(Math.random() * 3)+1;
    for (let i = 0; i < numberOfImages; i++) {
        let url = imageSeedArray[Math.floor(Math.random() * imageSeedArray.length)];
        imageArray.push({url:url,filename:url.match(/\/([^/]+)\.\w+$/)[1]})
    }
    return imageArray;
}
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 40; i++) {
        
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const random3 = Math.floor(Math.random() * 3);
        const camp = new Campground({
            author:authorArray[random3],
            geometry:{type: "Point", coordinates:[-113.1331,47.0202]},
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, officiis minus. Beatae cupiditate magni eius magnam praesentium commodi sit laborum ea eveniet deserunt? Qui illum minima numquam sunt sit laboriosam',
            price,
            images: [{url:'https://res.cloudinary.com/dt6vwovu0/image/upload/v1687882543/Yelpcamp/brian-yurasits-cAVUdHxLgIw-unsplash_jsokb9.jpg',filename:'Yelpcamp/brian-yurasits-cAVUdHxLgIw-unsplash_jsokb9'}]
        });
        const geodata = await geocoder.forwardGeocode({query:camp.location.split(',')[0],limit:1}).send();
        camp.geometry = geodata.body.features[0].geometry;
        camp.images = randomImages();
        await camp.save();
        console.log(`camp ${i} made, ${camp._id}`);
    }
}

seedDB();
console.log('Seeding completed');
// const authorArray = ['6495f81c656fb780ebb35df6','64954de1a3b65d908eab6938','649410316304a1c3c46191d3']
// const reviewSeed = async () => {
//     const random3 = Math.floor(Math.random() * 3);
//     await Review.updateMany({$set:{author:authorArray[random3]}});
// }

// reviewSeed();
