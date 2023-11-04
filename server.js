const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const fs = require('fs');
const multer=require('multer')
require('dotenv').config()
const mongoose=require('mongoose')
const Slider=require('./models/Sliderimagenames')
const cors=require('cors')
const Works = require('./models/Works');
const Pw=require('./models/Projworks')
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const Tes=require('./models/Testimonials')
const About=require('./models/About')
app.use(cors())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Set the destination folder for uploaded files
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Set the filename for uploaded files
      cb(null, Date.now() + '-' + file.originalname);
    }
  })

  const upload = multer({
    storage: storage,
    limits: { files: 5 } // Set the maximum number of files allowed to 5
  })


app.get('/pw', (req,res)=>{
    res.sendFile(path.join(__dirname, 'projwok.html'));
})

app.get('/editpw',(req,res)=>{
    res.sendFile(path.join(__dirname,'editproj.html'))
})

app.get('/testimonial',(req,res)=>{
    res.sendFile(path.join(__dirname,'testi.html'))
})
app.get('/edit/testimonial',(req,res)=>{
    res.sendFile(path.join(__dirname,'edittestimonial.html'))
})
app.get('/editsliders',(req,res)=>{
    res.sendFile(path.join(__dirname,'editsliders.html'))
})
app.get('/', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'index.html'));
})
app.get('/about',(req,res)=>{
  res.sendFile(path.join(__dirname, 'about.html'));
})
app.get('/sliderimages',async(req,res)=>{
    try{
    const data= await Slider.find()
    res.status(200).json(data)
    }
    catch(error){
res.status(500).json(error)
    }
})

app.get('/edit', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'edit.html'));
})

app.get('/cpanel', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'controlpanel.html'));
})
app.get('/sliderpost', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'postslider.html'));
})
app.post('/postslider',upload.array('images', 5),(req, res)=>{
    const images = req.files.map((file) => file.path);
images.forEach(async(i)=>{
   
    try{
        const slider=new Slider({name:i})
       await slider.save()
       res.status(200).send('Item saved')
    }
    catch(e){
        res.status(500).json({message:e})
    }
})
    
})

app.get('/sliderImages2', async (req, res) => {
    try {
      const images = await Slider.find();
      res.json(images);
    } catch (error) {
      res.status(500).send('Error fetching slider images');
      console.error('Error fetching slider images:', error);
    }
  });
  app.delete('/deletesliderimage/:id', async (req, res) => {
    const imageId = req.params.id;
  
    try {
      const image = await Slider.findOne({ _id: imageId });
  
      if (!image) {
        res.status(404).send('Image not found');
        return;
      }
  
      const imageName = image.name;
      const fileName = imageName.replace('uploads/', '');
  
      fs.unlink(path.join(__dirname, 'uploads', fileName), async (err) => {
        if (err) {
          res.status(500).send(`Error deleting file: ${err}`);
          console.error(`Error deleting file: ${err}`);
        } else {
          await Slider.findOneAndDelete({ _id: imageId });
          res.send('File and record deleted successfully');
        }
      });
    } catch (error) {
      res.status(500).send('Error deleting image');
      console.error('Error deleting image:', error);
    }
  });
  
  
app.post('/uploadwork', upload.array('images', 5), (req, res) => {
    const {
        title,
        project_name,
        icon,
        startdate,
        enddate,
        iconBg,
        points
    } = req.body;
    const pointsArray = points.split(',   ');
    const images = req.files.map((file) => file.path);

    const work = new Works({
        title,
        project_name,
        icon,
        startdate,
        enddate,
        iconBg,
        images,

    });
    pointsArray.forEach((point) => {
        work.points.push(point);
    });
    work.save()
        .then(() => {
            res.status(200).send('Data saved successfully');
        })
        .catch((error) => {
            res.status(500).send('Error saving data');
            console.error('Error saving data:', error);
        });
});
app.post('/api/testimonials', async (req, res) => {
    try {
      const { name, company, testimonial } = req.body;
      // Create a new Testimonial instance
      const newTestimonial = new Tes({ name, company, testimonial });
      // Save the testimonial to the database
      await newTestimonial.save();
      res.status(201).json({ message: 'Testimonial added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add testimonial' });
    }
  });
  app.get('/api/gettestimonials', async (req, res) => {
    try {
      const testimonial = await Tes.find()
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.status(200).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching testimonial' });
    }
  });
  
  // Endpoint to update a specific testimonial by ID
  app.put('/api/edittestimonial/:id', async (req, res) => {
    try {
      const { name, company, testimonial } = req.body;
      const updatedTestimonial = await Tes.findByIdAndUpdate(
        req.params.id,
        { name, company, testimonial },
        { new: true } // To return the updated document
      );
      if (!updatedTestimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.status(200).json({ message: 'Testimonial updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating testimonial' });
    }
  });
  
  
  app.get('/fetchAboutData', async (req, res) => {
    try {
      const aboutData = await About.findOne(); // Fetch the About data; this assumes only one document exists
      res.json(aboutData); // Send the fetched data as a JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching About data' });
    }
  });
  
  // Endpoint to update the About data
  app.put('/updateAboutData', async (req, res) => {
    const { overview, services } = req.body;
  
    try {
      const about = await About.findOne(); // Assuming you only have one About document
  
      about.overview = overview;
  
      if (services && Array.isArray(services)) {
        about.services = services;
      }
  
      await about.save();
  
      res.status(200).send('About data updated successfully');
    } catch (error) {
      res.status(500).send('Error updating About data');
      console.error('Error updating About data:', error);
    }
  });
  app.delete('/deleteService/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;
  
    try {
      const data = await About.findOneAndUpdate(
        {},
        { $pull: { services: { _id: serviceId } } },
        { new: true }
      );
  
      if (!data) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete service' });
    }
  });
  

  app.post('/updateAboutData', async (req, res) => {
    const { overview, servicesTitle, servicesIcon } = req.body;
  
    try {
      const newAboutData = new About({
        overview,
        services: [{ title: servicesTitle, icon: servicesIcon }]
      });
  
      await newAboutData.save();
  
      res.status(200).send('About data created successfully');
    } catch (error) {
      res.status(500).send('Error creating About data');
      console.error('Error creating About data:', error);
    }
  });
  

app.get("/ind/:name", function(req, res) {
    const {name}=req.params
  res.sendFile(__dirname +'/uploads' +"/"+ name);
})

app.post('/projwork', upload.array('images', 1), async (req, res) => {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => file.path);

    const newProjwork = new Pw({
        title,
        description,
        images,
        tags: [] // Initialize tags as an empty array
    });

    Array.isArray(tags) && tags.forEach(tag => {
        newProjwork.tags.push({
            name: tag.name,
            color: tag.color
        });
    });

    try {
        await newProjwork.save();
        res.status(200).send('Data saved successfully');
    } catch (error) {
        res.status(500).send('Error saving data');
        console.error('Error saving data:', JSON.stringify(error)); // Stringify the error
    }
});




app.get('/allprojects',async(req,res)=>{
    try{
        const data=await Works.find()
        res.status(200).json(data)
    }
    catch(e){
    res.status(500).json({message:'Error fetching data'})
    }
})


app.get('/allprojworks',async(req,res)=>{
    try{
        const data=await Pw.find()
        res.status(200).json(data)
    }
    catch(e){
    res.status(500).json({message:'Error fetching data'})
    }
})
// API endpoint for updating a project by _id
app.put('/editproject/:_id', async (req, res) => {
    const projectId = req.params._id;
    const editedProjectData = req.body;

    try {
        const project = await Works.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update the project document with the edited data
        project.project_name = editedProjectData.project_name;
        project.title = editedProjectData.title;
        project.icon = editedProjectData.icon;
        project.iconBg = editedProjectData.iconBg;
        project.startdate = editedProjectData.startdate;
        project.enddate = editedProjectData.enddate;
        project.points = editedProjectData.points;

        // Save the updated project document
        await project.save();

        // Respond with the updated project data
        res.status(200).json(project);
    } catch (e) {
        res.status(500).json({ message: 'Error editing project' });
    }
});

// Express route for deleting a Pw document
app.delete('/deletepwdocument/:id', async (req, res) => {
    const pwId = req.params.id;

    try {
        const deletedDocument = await Pw.findByIdAndDelete(pwId);

        res.json(deletedDocument);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Pw document' });
    }
});

// Express route for editing a Pw document
app.put('/editpwdocument/:id', async (req, res) => {
    const pwId = req.params.id;
    const { title, description, tags } = req.body;

    try {
        const updatedDocument = await Pw.findByIdAndUpdate(
            pwId,
            { title, description, tags },
            { new: true }
        );

        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: 'Error editing Pw document' });
    }
});


// API endpoint for deleting a project by _id
app.delete('/deleteproject/:id', async (req, res) => {


    try {
        const project = await Works.findByIdAndDelete({_id:req.params.id});

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Respond with a success message
        res.status(200).json({ message: 'Project deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting project' });
    }
});



  async function connectToMongoDB() {
    try {
      await mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
      // Continue with your code after successful connection
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      // Handle error
    }
}
connectToMongoDB()
app.listen(3000,()=>{
    console.log('connected to server')
})