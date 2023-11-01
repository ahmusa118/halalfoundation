const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projworkSchema=new Schema({
 
    title:{
    type: String,
        required: true 
   },
   description:{
        type: String,
        required: true 
    },
    tags: [{
        name: { type: String },
        color: { type: String }
    }],
   
    images: {
        type: [String],
        validate: {
          validator: function (array) {
            return array.every(item => item.match(/\.(jpg|jpeg|png)$/));
          },
          message: 'Invalid image format. Only JPG, JPEG, and PNG files are allowed.'
        }
      }


})
const Projwork= mongoose.model('Projwork', projworkSchema)
module.exports = Projwork

