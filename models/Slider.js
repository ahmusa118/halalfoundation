const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sliderSchema=new Schema({
 
  
   
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
const Slider= mongoose.model('Slider', sliderSchema)
module.exports = Slider

