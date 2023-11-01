const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workSchema=new Schema({
 
    title:{
    type: String,
        required: true 
   },
   project_name:{
        type: String,
        required: true 
    },
    icon:{
        type: String,
   
    },
    startdate:{
        type:Date
    },
    enddate:{
        type:Date  
    },
    iconBg:{
type:String,

    },
    points:{
        type:[String]
    }
        ,
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
const Works = mongoose.model('Works', workSchema)
module.exports = Works

