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
const Reviews = require("../models/reviews");
const Gallery = require("../models/gallery");
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

// Routes
router.get("/admin", (req, res) => { res.render("./admin/admin"); });

// events
 // SET STORAGE
 var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/events')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
 
var upload = multer({ storage: storage });

router.get("/admin/dashboard", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        Events.find().exec((err, event) => {
          if(err) return next(err);
          Reviews.find().exec((err, review) => {
            if(err) return next(err);
            res.render("./admin/index", {allEvents: event, allReviews: review});
          });
        });
      });
    client.close();
});
router.post('/uploadevent', upload.single('myEvent'), function (req, res){ 
  var newEvent = new Events({
    eventName: req.body.eventName,
    eventDate: req.body.eventDate,
    eventDesc: req.body.eventDesc,
    filename: req.file.filename
  });

  newEvent.save();
  console.log(newEvent); 
  mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
      res.redirect("./admin/dashboard");
    })
    .catch(err => {
    });
  client.close();
});
router.get("/admin/events/:id", (req, res) => {
  mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(client => {
     Events.findById({_id: req.params.id}, (err, docs) => {
       if (err) throw err;
       console.log(docs);
       res.json(docs);
     });
  })
  client.close();
})

router.post("/admin/events/:id", (req, res) => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    })
    .then(client => {
      Events.findOneAndUpdate(
        req.params.id,
        {$set: {eventName: req.body.eventName, eventDate: req.body.eventDate, eventDesc: req.body.eventDesc}},
        {new: true},
        (err, doc) => {
          if (err) throw err;
          res.redirect("/admin/dashboard");
        }
      );
    });
  client.close();
});

router.get("/:id/deleteEvent", (req, res) => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(client => {
      Events.findByIdAndRemove({_id: req.params.id}, (err, event) => {
        if (err) throw err;
        fs.unlink(path.join("public/uploads/events", event.filename), err => {
          if (err) throw err;
          res.redirect("/admin/dashboard");
        });
      });
    })
  client.close();
});
router.post('/uploadreview', function (req, res){ 
  var newReview = new Reviews(req.body);

  newReview.save();
  console.log(newReview); 
  mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
      res.redirect("./admin/dashboard");
    })
    .catch(err => {
    });
  client.close();
});
router.get("/:id/deleteReview", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Reviews.findByIdAndRemove({_id: req.params.id}, (err, review) => {
        if (err) throw err;
        fs.unlink(path.join("public/uploads/reviews", review.filename), err => {
          if (err) throw err;
          res.redirect("/admin/dashboard");
        });
      });
    })
  client.close();
});


router.get("/admin/menu", (req, res) => { res.render("./admin/menu"); });
router.get("/admin/reservation", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        var mySort = {date: -1};
        Reservations.find().sort(mySort).exec((err, booking) => {
          if(err) return next(err);
          res.render("./admin/reservation", {allBookings: booking});
        });
      });
    client.close(); 
});
router.get("/admin/reservation/:id/delete", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Reservations.findByIdAndRemove({_id: req.params.id}, (err, booking) => {
        if (err) throw err;
        res.redirect("/admin/reservation");
      });
    })
  client.close();
});

// Gallery
 // SET STORAGE
 var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/gallery')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
 
var upload = multer({ storage: storage });
router.get("/admin/gallery", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        Gallery.find().exec((err, image) => {
          if(err) return next(err);
          res.render("./admin/gallery", {allImages: image});
        });
      });
    client.close();
});
router.post('/gallery', upload.single('myGallery'), function (req, res){ 
  var newgallery = new Gallery({
    category: req.body.category,
    filename: req.file.filename
  });

  newgallery.save();
  console.log(newgallery);
  mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
      res.redirect("./admin/gallery");
    })
    .catch(err => {
    });
  client.close();
});
router.get("/:id/deleteimage", (req, res) => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(client => {
      Gallery.findByIdAndRemove({_id: req.params.id}, (err, image) => {
        if (err) throw err;
        fs.unlink(path.join("public/uploads/gallery", image.filename), err => {
          if (err) throw err;
          res.redirect("/admin/gallery");
        });
      });
    })
  client.close();
});

// about
 // SET STORAGE
 var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/staff')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
 
var upload = multer({ storage: storage });
router.get("/admin/about", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        var mySort = {date: -1};
        Staff.find().sort(mySort).exec((err, staff) => {
          if(err) return next(err);
          res.render("./admin/about", {allStaff: staff});
        });
      });
    client.close(); 
});
router.post("/uploadStaff", upload.single('myStaff'), (req, res) => {
  var newStaff = new Staff({
    staffName: req.body.staffName,
    filename: req.file.filename,
    staffTitle: req.body.staffTitle,
    aboutStaff: req.body.aboutStaff
  });
  newStaff.save();
  console.log(newStaff);
  res.redirect("./admin/about");  
});
router.get("/admin/staff/:id/delete", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Staff.findByIdAndRemove({_id: req.params.id}, (err, staff) => {
        if (err) throw err;
        fs.unlink(path.join("public/uploads/staff/", staff.filename), err => {
          if (err) throw err;
          res.redirect("/admin/about");
        });
      });
    })
  client.close();
});

// blog
 // SET STORAGE
 var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/blogs')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
 
var upload = multer({ storage: storage });

router.get("/admin/blog", (req, res) => {
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        var mySort = {date: -1};
        Blogs.find().sort(mySort).exec((err, blog) => {
          if(err) return next(err);
          res.render("./admin/blog", {allBlogs: blog});
        });
      });
    client.close();  
});
router.post("/uploadblog", upload.single('myBlog'), (req, res) => {
  var newBlog = new Blogs({
    blogTitle: req.body.blogTitle,
    category: req.body.category,
    content: req.body.content,
    filename: req.file.filename,
    author: "Sam"
  });
  newBlog.save();
  console.log(newBlog);
  res.redirect("./admin/blog");  
});
router.get("/admin/blog/:id/edit", (req, res) => {
  mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
       Blogs.findById({_id: req.params.id}, (err, blogs) => {
         if (err) throw err;
         console.log(blogs);
         res.render("./admin/edit", {blogs: blogs});
       });
    })
    client.close(); 
});
router.post("/admin/blog/:id/edit", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Blogs.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {blogTitle: req.body.blogTitle, category: req.body.category, content: req.body.content}},
        {new: true},
        (err, blog) => {
          console.log(blog);
          if (err) throw err;
          res.redirect("/admin/blog");
        }
      );
    });
  client.close();
});
router.get("/admin/blog/:id/delete", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Blogs.findByIdAndRemove({_id: req.params.id}, (err, blog) => {
        if (err) throw err;
        fs.unlink(path.join("public/uploads/blogs/", blog.filename), err => {
          if (err) throw err;
          res.redirect("/admin/blog");
        });
      });
    })
  client.close();
});
router.get("/admin/blog/comments/:id/delete/:otherId", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      const Id = { _id: req.params.id };
      Blogs.updateOne(Id, 
        { $pull : {comments : { _id: req.params.otherId }}}, {multi: true},
        (err, data) => {
          if (err) throw err;
          console.log(data);
          res.redirect("/admin/blog")
        });
    })
  client.close();
});
router.get("/admin/blog-detail", (req, res) => { res.render("./admin/blog-detail"); });
router.get("/admin/contact", (req, res) => { 
  mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(client => {
        var mySort = {date: -1};
        Contacts.find().sort(mySort).exec((err, message) => {
          if(err) return next(err);
          res.render("./admin/contact", {allMessages: message});
        });
      });
    client.close(); 
});
router.get("/admin/contact/:id/delete", (req, res) => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(client => {
      Contacts.findByIdAndRemove({_id: req.params.id}, (err, message) => {
        if (err) throw err;
        res.redirect("/admin/contact");
      });
    })
  client.close();
});

module.exports = router;