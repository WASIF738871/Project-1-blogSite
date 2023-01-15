const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
require('dotenv').config();
let {PORT, MongoDB_CLUSTER} = process.env;

const app =express();

app.use(express.json());

mongoose.connect(MongoDB_CLUSTER)
.then(()=>console.log('MongoDB is connected'))
.catch(err => console.log(err));

app.use('/',route);

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`)
});
