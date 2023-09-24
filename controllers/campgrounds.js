const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapboxToken});
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res,next) => {
    const geodata = await geocoder.forwardGeocode({query:req.body.location,limit:1}).send();
    const newCampground = new Campground(req.body);
    newCampground.geometry = geodata.body.features[0].geometry;
    newCampground.images = req.files.map(file => ({url:file.path,filename:file.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success','Succesfully made a new campground');
    res.redirect(`campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author')
    .populate({path:'reviews',
    populate:{
        path:'author'
    }});
    if(!campground){
        req.flash('error',"Can't find that campground");
        return res.redirect('/campgrounds');
    }
    else {
        res.render('campgrounds/show', { campground });
    }
    
}

module.exports.renderEditForm  = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error',"Can't find that campground");
        return res.redirect('/campgrounds');
    }
    else {
        res.render('campgrounds/edit', { campground });
    }
    
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });        //
    const images = req.files.map(file => ({url:file.path,filename:file.filename}))
    campground.images.push(...images);
    await campground.save();
    if(req.body.deleteImages){
        for(let file of req.body.deleteImages){
            await cloudinary.uploader.destroy(file);
        }
     await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(campground);
    }
    req.flash('success','Campground updated succesfully !');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground');
    res.redirect(`/campgrounds`);
}



// [{"id":"place.8906859",
// "type":"Feature",
// "place_type":["place"],
// "relevance":1,
// "properties":{"wikidata":"Q1352","mapbox_id":"dXJuOm1ieHBsYzpoK2hy"},
// "text":"Chennai",
// "place_name":"Chennai, Tamil Nadu, India",
// "bbox":[80.140106,12.852023,80.358761328,13.2352],
// "center":[80.270186,13.083694],
// "geometry":{"type":"Point","coordinates":[80.270186,13.083694]},
// "context":[{"id":"district.1042027","wikidata":"Q15116","mapbox_id":"dXJuOm1ieHBsYzpEK1py","text":"Chennai"},{"id":"region.173163","short_code":"IN-TN","wikidata":"Q1445","mapbox_id":"dXJuOm1ieHBsYzpBcVJy","text":"Tamil Nadu"},{"id":"country.8811","short_code":"in","wikidata":"Q668","mapbox_id":"dXJuOm1ieHBsYzpJbXM","text":"India"}]
// }]

