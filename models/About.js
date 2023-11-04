const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema=new Schema({
 
    overview:{
    type: String,
        required: true 
   },
   
    services: [{
        title: { type: String },
        icon: { type: String }
    }],
   



})
const About= mongoose.model('About', aboutSchema)
module.exports = About

