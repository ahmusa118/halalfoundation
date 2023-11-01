const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const multer=require('multer')
require('dotenv').config()
const mongoose=require('mongoose')
const cors=require('cors')
const Works = require('./models/Works');
const Pw=require('./models/Projworks')
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const Tes=require('./models/Testimonials')
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

app.get('/', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/edit', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'edit.html'));
})

app.get('/cpanel', (req, res) => {
    // Serve the HTML form file when a GET request is made to /uploadworkform.
    res.sendFile(path.join(__dirname, 'controlpanel.html'));
})
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