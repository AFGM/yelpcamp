
//all middleware goes here
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")

module.exports = {
    
    isLoggedIn(req ,res , next){
        if(req.isAuthenticated()){
            return next()
        } else 
                req.flash("error", "You need to be logged in to do that")
                res.redirect("/login")
        },
    
        checkCampgroundOwnership(req,res,next){
            if(req.isAuthenticated()){
            //does the user own the campground
            Campground.findById(req.params.id, function (err,foundcampground) {
                if(err){
                    req.flash("error","Campground not found!")
                    res.redirect("back")
                } else {
                    //does the use rown the campground
                    if(foundcampground.author.id.equals(req.user._id)){
                        return next()
                    }
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")
                }
            })} else {
                req.flash("error", "You need to be logged in to do that")
                res.redirect("back")
        }},
        
        checkCommentOwnership(req,res,next){
            if(req.isAuthenticated()){
            //does the user own the campground
            Comment.findById(req.params.comment_id, function (err,foundcomment) {
            if(err){
                res.redirect("back")
            } else {
                //does the use rown the campground
                if(foundcomment.author.id.equals(req.user._id)){
                    return next()
                }
                res.redirect("back")
            }
        })} else {
            res.redirect("back")
        }},
};
