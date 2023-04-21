const express= require('express');
const cors =require('cors');
const dotenv = require("dotenv");
dotenv.config();


const app=express();


const corsOptions = {
    origin: true,
    credentials: true,
  };

app.use(cors(corsOptions));
