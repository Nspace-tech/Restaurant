const express = require('express');
const router = express.Router();
const fs = require('fs');
var path = require("path");
var mongoose = require("mongoose");
var multer = require("multer");
mongoose.Promise = global.Promise;
var async = require("async");
var crypto = require("crypto");
const bcrypt = require("bcryptjs");
const passport = require("passport");

var cors = require("cors");
router.use(cors());

const helmet = require("helmet");
router.use(helmet());

require("cookie-parser");

// models
const Blogs = require("../models/blog");
const Events = require("../models/events");
const Gallery = require("../models/gallery");
const Reviews = require("../models/reviews");
const Staff = require("../models/staff");
const Contacts = require("../models/contact");
const Reservations = require("../models/reservation");

mongoose.set("useCreateIndex", true);

const uri =
  "mongodb+srv://Trav:grutikas@bakery-gnzlr.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client
  .once("open", () => {
    console.log('Hotel database connected');
    
  })
  .catch(err => {
    console.log(err);
    
  });


router.get("/", (req, res) => {
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        Events.find().exec((err, event) => {
          if(err) return next(err);
          var mySort = {date: -1}
          Blogs.find().sort(mySort).limit(3).exec((err, blog) => {
            if(err) return next(err);
            Reviews.find().exec((err, review) => {
              if(err) return next(err);
              res.render("./user/home", {allEvents: event, allBlogs: blog, allReviews: review});
            });
          });
        });
      });
    client.close(); 
});
router.get("/menu", (req, res) => { res.render("./user/menu"); });
router.get("/reservation", (req, res) => res.render("./user/reservation"));
router.post("/reserve", (req, res) =>  {
  var booking = new Reservations(req.body);
  booking.save();
  console.log(booking);
  res.redirect("./reservation")
});
router.get("/gallery", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        Gallery.find().exec((err, image) => {
          if(err) return next(err);
          res.render("./user/gallery", {allImages: image});
        });
      });
    client.close();
});

router.get("/about", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        Staff.find().exec((err, staff) => {
          if(err) return next(err);
          res.render("./user/about", {allStaff: staff});
        });
      });
    client.close(); 
});
router.get("/blog", (req, res) => {
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        var mySort = {date: -1}
        Blogs.find().sort(mySort).exec((err, blog) => {
          if(err) return next(err);
          res.render("./user/blog", {allBlogs: blog});
        });
      });
  client.close(); 
});
router.get("/:id/blog-detail", (req, res) => {
  mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
       Blogs.findById({_id: req.params.id}, (err, blogs) => {
         if (err) throw err;
         console.log(blogs);
         res.render("./user/blog-detail", {blogs: blogs});
       });
    })
    client.close(); 
});
router.post("/:id/comment", (req, res) => {
  var data = {
      username: req.body.username,
      comment: req.body.comment
  };
  Blogs.updateOne({_id: req.params.id}, {
    $push: {comments: data}}, {safe: true}, (err, field) => {
      if (err) throw err;
      res.redirect("./blog-detail")
    })
});
router.get("/contact", (req, res) => res.render("./user/contact"));
router.post("/contact", (req, res) => { 
  var contact = new Contacts(req.body);
  contact.save();
  console.log(contact);
  res.redirect("./contact");
});

module.exports = router;