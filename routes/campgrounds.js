var express = require("express")
var router = express.Router({mergeParams: true}) //use req.user
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")
var middleware = require("../middleware")


//middleware
var middlewareObj = require('../middleware/index.js');


// INDEX - Show all campgrounds
router.get("/", function(req, res){
    //Get all Campgrounds from DB 
    Campground.find({}, function (err, campgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index",{campgrounds:campgrounds, currentuser: req.user});
        }
    })
});

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn , function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price:price, image: image, description: description, author:author}
    console.log(newCampground)
    Campground.create(newCampground, function (err, camp){
        if(err){
        console.log(err)
        } else {
            console.log("Congrats you add new campground!")
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW WITH COMMENTS
router.get("/:id", function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err)
        } else {
            // render show template with that campground
            console.log(foundcampground)
            res.render("campgrounds/show", {campground: foundcampground})
        }
    })
})

//EDIT ROUTES
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, (err,foundcampground) => {
        res.render("campgrounds/edit", {campground: foundcampground})
    })
})

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedcampground){
        if(err){
            res.redirect("/campground")
        } else {
            //redirect to show page
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//DELETE ROUTES

router.delete("/:id", function(req,res){
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})
/*
//MIDDLEWARE
function isLoggedIn(req ,res , next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkCampgroundOwnership(req,res,next){
        if(req.isAuthenticated()){
        //does the user own the campground
        Campground.findById(req.params.id, function (err,foundcampground) {
            if(err){
                res.redirect("back")
            } else {
                //does the use rown the campground
                if(foundcampground.author.id.equals(req.user._id)){
                    return next()
                }
                res.redirect("back")
            }
        })
        
    } else {
        res.redirect("back")
    }
}
*/
module.exports = router