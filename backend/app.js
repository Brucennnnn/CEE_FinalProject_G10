const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");



const toDoTaskRoutes = require("./routes/toDoTaskRoutes");
const courseVilleRoutes = require("./routes/courseVilleRoutes");
const tagRoutes = require("./routes/tagRoutes");
dotenv.config();
const middleware = require("./routes/middleware")
const app = express();

const sessionOptions = {
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    // setting this false for http connections
    secure: false,
  },
};

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.static("static"));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/task", middleware.middleware, toDoTaskRoutes);
app.use("/tag",middleware.middleware, tagRoutes)
app.use("/courseville", courseVilleRoutes);
app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started at http://${process.env.backendIPAddress}/couresville/auth_app`);
});


module.exports = app;