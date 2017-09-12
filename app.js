  var express = require("express");
  var app = express();
  var bodyParser = require("body-parser");
  var mongoose = require("mongoose");
  var passport = require("passport");
  var LocalStrategy = require("passport-local");
  var methodOverride = require("method-override");
  var Campground = require("./models/campgrounds");
  var Comment = require("./models/comment");
  var User = require("./models/user");
  var seedDB = require("./seeds");
  var flash = require("connect-flash")


  //REQUIRE ROUTES
  var commentRoutes = require("./routes/comments")
  var campgroundRoutes = require("./routes/campgrounds")
  var indexRoutes = require("./routes/index")

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs");
  mongoose.connect("mongodb://localhost/yelp_camp_v12");
  app.use(methodOverride("_method"));
  app.use(flash())
  //seedDB(); // Seed Database


  //PASSPORT CONFIG
  app.use(require("express-session")({
      secret: "Nuria is awesome",
      resave: false,
      saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  //Middleware for get user in every routes
  app.use(function(req,res,next){
      res.locals.currentuser = req.user
      res.locals.error = req.flash("error")
      res.locals.success = req.flash("success")
      next()
  })

  //ATUALMENTE É RENDER DO LADO DO SERVIDOR CASO SEJA ANGULAR ENVIA JSON E FAZ RENDER DO LADO DO CLIENTE

  app.use(indexRoutes)
  app.use("/campgrounds", campgroundRoutes)
  app.use("/campgrounds/:id/comments", commentRoutes)



  app.listen(3000, function(){
     console.log("The YelpCamp Server Has Started!");
     console.log("--------------------------------")
  });
