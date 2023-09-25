import express from 'express';
import {adminrouter,vendorroutes } from './route/'
const app = express()

import bodyParser, { BodyParser } from "body-parser";
import mongoose from 'mongoose';
import { MONGO_URI } from './config/index';
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/admin',adminrouter)
app.use('/vendor',vendorroutes)
 mongoose.connect(MONGO_URI).then(result =>{
    console.log("DB KONEK");
}).catch(err=>console.log(`error ${err}`))
app.listen(8000, () => {
    console.log(` listening on port 8000`);
});