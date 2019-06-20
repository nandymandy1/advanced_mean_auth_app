const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/db").secret;
const passport = require("passport");
const multer = require("multer");

// Load User Model
const User = require("../../models/User");

// Multer storage startegy
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "./public/images/");
  },
  filename: (req, file, next) => {
    var date = new Date();
    var timestamp = date.getTime();
    let fileName = `${timestamp}${file.originalname}`;
    next(null, fileName);
  }
});

// // File types
// const fileFilter = (req, file, cb) => {
//   cb(null, false);
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
//       // then store the file
//       cb(null, true);
//   } else {
//       // reject the file
//       cb(null, false);
//   }
// };

// Multer Configuration
const upload = multer({
  storage: storage
  // limits: {
  //     fileSize: 1024 * 1024 * 3
  // },
  // fileFilter: fileFilter
});

/**
 *@METHOD POST Request
 *@DESC To register the user
 *@URL /api/user-register
 */
router.get("/user-register", upload.single("profilePicture"), (req, res) => {});

/**
 *@METHOD POST Request
 *@DESC To Authenticate the user
 *@URL /api/user-login
 */
router.post("/user-login", (req, res) => {});

/**
 *@METHOD PUT Request
 *@DESC To Edit the userprofile
 *@URL /api/edit-profile/:id
 */
router.put(
  "/edit-profile/:id",
  upload.single("profilePicture"),
  (req, res) => {}
);

/**
 *@METHOD GET Request
 *@DESC To Deactivate the userprofile
 *@URL /api/deactivate-profile/:id
 */
router.get("/deactivate-profile/:id", (req, res) => {});

/**
 *@METHOD POST Request
 *@DESC To Deactivate the userprofile verification
 *@URL /api/deactivate-verification/:id
 */
router.post("/deactivate-verification/:id", (req, res) => {});

/**
 *@METHOD GET Request
 *@DESC To get all the users profile by usernames or first-names or last-names
 *@URL /api/profile-search
 */
router.get("/profile-search", (req, res) => {
  let query = req.body.query;
  User.find({
    $or: [
      { firstname: { $regex: new RegExp(query), $options: "i" } },
      { lastname: { $regex: new RegExp(query), $options: "i" } },
      { username: { $regex: new RegExp(query), $options: "i" } }
    ]
  })
    .then(users => {
      users.length != 0
        ? res.json({ users, success: true })
        : res.json({
            message: `Unable to find any user with ${query}.`,
            success: false
          });
    })
    .catch(err => errorFunction(err));
});

/**
 *@METHOD GET Request
 *@DESC To get all the users profile by id
 *@URL /api/profile/:id
 */
router.get("/profiles/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      user
        ? res.json({
            user,
            success: true
          })
        : res.json({
            success: false
          });
    })
    .catch(err => errorFunction(err));
});

// Extra utility routes
// Checks for the unique username while registering
router.post("/validate-username", (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      user
        ? res.json({
            message: "Username is already teken please try another username.",
            success: false
          })
        : res.json({
            success: true
          });
    })
    .catch(err => errorFunction(err));
});

// Checks for the unique email while registering
router.post("/validate-email", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      user
        ? res.json({
            message:
              "Email is already registered. Did you forget the password? Try reseting it.",
            success: false
          })
        : res.json({
            success: true
          });
    })
    .catch(err => errorFunction(err));
});

// Utility function to handle the errors
const errorFunction = error => {
  return res.json({
    message: `Server is currently unable to handle this request please try in a moment.`,
    success: false
  });
};

module.exports = router;
