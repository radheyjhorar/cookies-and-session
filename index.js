// Importing express module
const express = require('express');

//Importing express-session module
const session = require('express-session');

// Importing session-file-store module for session storage
const filestore = require('session-file-store')(session);

const path = require('path');

// Seting Up the server
let app = express();

// Creating session
app.use(session({
  name: "session-id",
  secret: "GFGEnter", // Secret Key
  saveUninitialized: false,
  resave: false,
  store: new filestore()
}))



// Asking for the authorization
function auth(req, res, next) {
  // Checking for the session
  console.log(req.session);

  // Checking  for the authorization
  if (!req.session.user) {
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    let err = new Error("You are not authenticated");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);

    let auth = new Buffer.from(authHeader.split(' ')[1], "base64").toString().split(":");

    // Reading Username and Password
    let username = auth[0];
    let password = auth[1];
    if (username == "admin2" && password == "password") {
      req.session.user = "admin2";
      next();
    } else {
      // Retry incase of incorrect credentials
      let err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic")
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.session.user == "admin2") {
      next();
    }
    else {
      let err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  }
}


// Middlewares
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

// Server setup
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})