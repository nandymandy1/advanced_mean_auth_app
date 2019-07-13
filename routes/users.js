const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../config/db").secret;
const passport = require("passport");
const multer = require("multer");

// Load User Model
const User = require("../models/User");

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
 *@URL /api/users/register
 *@ACCESS Public
 */
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  let { firstname, lastname, username, email, password } = req.body;
  let newUser = new User({
    firstname,
    lastname,
    username,
    email,
    password
  });

  req.file ? (newUser.avatar = req.file.path.split("public").pop()) : null;
  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      await newUser
        .save()
        .then(user => {
          return res.json({
            message: "User registration is successful",
            success: true
          });
        })
        .catch(err => errorFunction(err, res));
    });
  });
});

/**
 *@METHOD POST Request
 *@DESC To Authenticate the user
 *@URL /api/users/login
 *@ACCESS Public
 */
router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  await User.findOne({
    username
  })
    .then(async user => {
      if (!user) {
        return res.json({
          success: false,
          message: "Username is not found."
        });
      }
      let isMatch = await matchPassword(user, password);
      // Match the password
      if (isMatch) {
        // Set user activation true
        user.activation = true;
        user.save();
        // Now send the auth token back b generating it and sign it
        // JWT Payload Signing credentials
        let payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        };
        jwt.sign(
          payload,
          key,
          {
            expiresIn: 604800
          },
          (err, token) => {
            return res.json({
              success: true,
              token: `Bearer ${token}`,
              message: "You are successfully logged in."
            });
          }
        );
      } else {
        return res.json({
          success: false,
          message: "Incorrect password."
        });
      }
    })
    .catch(err => errorFunction(err, res));
});

/**
 *@METHOD PUT Request
 *@DESC To Edit the userprofile
 *@URL /api/users/edit-profile/:id
 *@ACCESS Private
 */
router.put(
  "/edit-profile",
  passport.authenticate("jwt", {
    session: false
  }),
  upload.single("profilePicture"),
  async (req, res) => {
    let { firstname, lastname, email } = req.body;
    let user = await User.findById(req.user._id);
    req.file ? (user.avatar = req.file.path.split("public").pop()) : null;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    await user
      .save()
      .then(user => {
        return res.json({
          message: "User details updated.",
          success: true
        });
      })
      .catch(err => errorFunction(err, res));
  }
);

/**
 *@METHOD GET Request
 *@DESC To Deactivate the userprofile
 *@URL /api/users/deactivate-profile/:id
 */
router.get(
  "/deactivate-profile/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    await deactivateAccount(req.user._id).then(user => {
      user
        ? res.json({
            message: `Your account has been successfully deactivated. If you want to activate your account then just login into it with username and current password.`,
            success: true
          })
        : res.json({
            message: "Unable to deactivate the account please try again later.",
            success: false
          });
    });
  }
);

/**
 *@METHOD POST Request
 *@DESC To Deactivate the userprofile verification
 *@URL /api/users/users/deactivate-verification/:id
 */
router.post(
  "/deactivate-verification/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    let { password } = req.body;
    let isMatch = await matchPassword(req.user, password);
    isMatch
      ? res.json({
          success: true
        })
      : res.json({
          success: false
        });
  }
);

/**
 *@METHOD GET Request
 *@DESC To get all the users profile by usernames or first-names or last-names
 *@URL /api/users/profile-search
 *@ACCESS Public
 */
router.post("/profile-search", async (req, res) => {
  let { query } = req.body;
  if (query.length > 3) {
    await User.find({
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
      .catch(err => errorFunction(err, res));
  } else {
    return res.json({});
  }
});

/**
 *@METHOD GET Request
 *@DESC To get all the users profile by id
 *@URL /api/users/profile/:id
 */
router.get(
  "/profiles/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    await User.findOne({ _id: req.params.id })
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
      .catch(err => errorFunction(err, res));
  }
);

// Extra utility routes
// Checks for the unique username while registering
router.get("/validate-username", async (req, res) => {
  await User.findOne({ username: req.query.username })
    .then(user => {
      user
        ? res.json({
            message: "Username is already taken please try another username.",
            success: false
          })
        : res.json({
            success: true
          });
    })
    .catch(err => errorFunction(err, res));
});

// Checks for the unique email while registering
router.get("/validate-email", async (req, res) => {
  await User.findOne({ email: req.query.email })
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
    .catch(err => errorFunction(err, res));
});

/*
 * Utility function to handle the errors
 */
const errorFunction = (error, res) => {
  console.log(error);
  return res.json({
    message: `Server is currently unable to handle this request please try in a moment.`,
    success: false
  });
};

/**
 * Activate or Deactivate Account
 */
const deactivateAccount = async id => {
  await User.findById(id).then(async user => {
    user.activation = !user.activation;
    await user.save().then(user => user);
  });
};

/**
 * Match Password Function
 */
const matchPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

module.exports = router;
