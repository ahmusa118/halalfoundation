const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema=new Schema({
 
    name:{
    type: String,
        required: true 
   },
   company:{
        type: String,
        required: true 
    },
    testimonial:{
        type: String,
   
    }
    
      


})
const Testimonials = mongoose.model('Testimonial', testimonialSchema)
module.exports = Testimonials

