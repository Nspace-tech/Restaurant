const express = require('express');
const app = express();
var path = require('path');
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser');
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

require("cookie-parser");


//Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());


//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


app.use(express.static('public'));
app.use(express.static(__dirname + "./public/"));
app.set('trust proxy', true);
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes-users
app.use("/", require("./routes/user"));

// routes-admin
app.use("/", require("./routes/admin"));



app.listen(PORT, console.log('Server started on port 5000'));