const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sliderSchema=new Schema({
 
    name:{
    type: String,
        required: true 
   }
  

      


})
const Sliderimagename = mongoose.model('Sliderimagenames', sliderSchema)
module.exports = Sliderimagename

