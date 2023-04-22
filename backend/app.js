const express= require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const login = require("./routes/login");
dotenv.config();


const app=express();


const corsOptions = {
    origin: true,
    credentials: true,
  };

app.use(cors(corsOptions));


app.use("/login",login);

module.exports=app;