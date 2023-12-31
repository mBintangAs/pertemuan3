import express from 'express';
import {  customerRoute, shoppingroutes, vendorroutes } from './route/'
const app = express()
import path from 'path';
import bodyParser, { BodyParser } from "body-parser";
import mongoose from 'mongoose';
import { MONGO_URI } from './config/';
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
// Gunakan express.json() sebagai middleware
app.use(express.json());
app.use('/vendor', vendorroutes)
app.use(shoppingroutes)
app.use('/customer',customerRoute)
mongoose.connect(MONGO_URI).then(result => {
    console.log("DB KONEK");
}).catch(err => console.log(`error ${err}`))
app.listen(8000, () => {
    console.log(` listening on port 8000`);
});


