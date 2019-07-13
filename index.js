const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

/**
 * Initializing the app
 */
const app = express();

/**
 * Initialize the PORT
 */
const PORT = process.env.PORT || 5000;

// Defining the Middlewares
app.use(cors());

// BodyParser Middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Passport
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Database connection
const db = require("./config/db").mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log(`Database Connected Successfully ${db}`))
  .catch(err => console.log(`Error in connecting Database ${err}`));

// Set the static folder
app.use(express.static(path.join(__dirname, "public")));

// User Routes
const users = require("./routes/users");
app.use("/api/users", users);

/**
 * Server Listening
 */
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
