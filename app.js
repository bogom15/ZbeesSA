var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campgrounds"),
    Comment         = require("./models/comments"),
    User            = require("./models/users"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");

// require routes

var commentRoutes       = require("./routes/comments.js");
var campgroundRoutes    = require("./routes/campgrounds.js");
var indexRoutes          = require("./routes/index");


//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=============================================
//         PASSPORT CONFIGURATION
//=============================================

app.use(require("express-session")({
    secret:"a special secret",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen("3001",function(){
console.log(" Z/BEES server listening");
});