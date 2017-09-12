//***********************************
// COMMENTS ROUTES
//***********************************
var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")
var middleware = require("../middleware")

//COMMENTS NEW 
router.get("/new",middleware.isLoggedIn,function(req, res) {
    // find campground by id
    console.log(req.params.id)
    Campground.findById(req.params.id, function(err, foundcampground) {
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground : foundcampground})
        }
    })
})

//COMMENTS CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
     //lookup campground using id
    Campground.findById(req.params.id, function(err, foundcampground){
         if(err){
             req.flash("error","Something went wrong!")
             console.log(err)
         } else {
            //create new comment
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err)
                } else {
                    console.log(comment)
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save comment
                    comment.save()
                    console.log(comment)
                    //connect new comment to campground
                    foundcampground.comments.push(comment)
                    foundcampground.save()
                    //redirect campground show page
                    req.flash("success","Success when add comment!")
                    res.redirect("/campgrounds/"+foundcampground._id)
                }
            })
        }
     })
})

//EDIT 
router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req,res) => {
    Comment.findById(req.params.comment_id,(err,comment)=>{ 
        if(err){
            res.redirect("back")
        } else {
            console.log(req.params.id)
            res.render("comments/edit", {campground_id:req.params.id , comment:comment})
        }
    })
})

router.put("/:comment_id",middleware.checkCommentOwnership, (req,res)=>{
    //find and update comment
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedcomment)=>{
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err,deletedcomment)=>{
        if(err){
            res.redirect("back")
        } else {
            req.flash("success","Comment deleted!")
           res.redirect("/campgrounds/"+req.params.id) 
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

function checkCommentOwnership(req,res,next){
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
        })
        
    } else {
        res.redirect("back")
    }
}
*/
module.exports = router