const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth-route");
require("./config/passport");
const profileRoute = require("./routes/profile-route");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

mongoose.connect(
    process.env.DB_CONNECT,
    )
    .then(()=>{
        console.log("Connect to mongoBD atlas.");
    })
    .catch(err =>{
        console.log(err);
    });

//middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res, next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});
app.use("/auth", authRoute);
app.use("/profile",profileRoute);

app.get("/", (req,res)=>{
    res.render("index", {user:req.user});
});

app.listen(process.env.PORT || 8080, ()=>{
    console.log("Server running on port 8080.");
});

