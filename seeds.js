var mongoose = require("mongoose")
var Campground = require("./models/campgrounds")
var Comment = require("./models/comment")

var data = [
        {
            name: "Salmon Creek", 
            image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eget nisi sit amet placerat. Donec pellentesque turpis vel orci vulputate mattis molestie eu metus. Nam gravida libero quis tellus tempor, at aliquet libero tristique. Praesent mattis dictum turpis vitae tincidunt. Donec vel ipsum at velit ultrices iaculis non vitae est. Ut et finibus leo. Pellentesque porta, risus et commodo pharetra, augue risus egestas lectus, sit amet molestie purus velit mollis lectus. Nam sollicitudin, nibh in condimentum tempus, elit sem porttitor quam, sed tincidunt nisl turpis elementum sapien. Mauris tempor orci ut urna ultrices, vitae efficitur augue fermentum. Proin dictum leo odio. Donec ullamcorper risus non commodo gravida. Curabitur nisi erat, aliquam eget cursus vel, tincidunt at arcu."
        },
        {   
            name: "Granite Hill", 
            image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eget nisi sit amet placerat. Donec pellentesque turpis vel orci vulputate mattis molestie eu metus. Nam gravida libero quis tellus tempor, at aliquet libero tristique. Praesent mattis dictum turpis vitae tincidunt. Donec vel ipsum at velit ultrices iaculis non vitae est. Ut et finibus leo. Pellentesque porta, risus et commodo pharetra, augue risus egestas lectus, sit amet molestie purus velit mollis lectus. Nam sollicitudin, nibh in condimentum tempus, elit sem porttitor quam, sed tincidunt nisl turpis elementum sapien. Mauris tempor orci ut urna ultrices, vitae efficitur augue fermentum. Proin dictum leo odio. Donec ullamcorper risus non commodo gravida. Curabitur nisi erat, aliquam eget cursus vel, tincidunt at arcu."
        },
        {
            name: "Mountain Goat's Rest", 
            image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eget nisi sit amet placerat. Donec pellentesque turpis vel orci vulputate mattis molestie eu metus. Nam gravida libero quis tellus tempor, at aliquet libero tristique. Praesent mattis dictum turpis vitae tincidunt. Donec vel ipsum at velit ultrices iaculis non vitae est. Ut et finibus leo. Pellentesque porta, risus et commodo pharetra, augue risus egestas lectus, sit amet molestie purus velit mollis lectus. Nam sollicitudin, nibh in condimentum tempus, elit sem porttitor quam, sed tincidunt nisl turpis elementum sapien. Mauris tempor orci ut urna ultrices, vitae efficitur augue fermentum. Proin dictum leo odio. Donec ullamcorper risus non commodo gravida. Curabitur nisi erat, aliquam eget cursus vel, tincidunt at arcu."
        }
];

function seedDB(){
    //Remove All Campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err)
        } 
        console.log ("removed campgrounds!")
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added campgrounds")
                    //create a comment
                    Comment.create(
                        {
                            text:"This place is great, but i wish there was internet",
                            author: "Homer"
                        }, function(err,comment){
                            if(err){
                                console.log(err)
                            } else {
                                campground.comments.push(comment)
                                campground.save()
                                console.log("Created new comment")
                            }
                        })
                    }
            })
        })
    })
}

module.exports = seedDB