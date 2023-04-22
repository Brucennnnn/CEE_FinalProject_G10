const dotenv =require('dotenv');
dotenv.config();
const port=3001;
const app=require('./app');

const server=app.listen(port,()=>{});