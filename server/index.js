const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/3dmodels', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for storing 3D models
const modelSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now }
});

const Model = mongoose.model('Model', modelSchema);

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter: (req, file, cb) => {
    // Accept only glb and gltf files
    if (file.originalname.toLowerCase().endsWith('.glb') || 
        file.originalname.toLowerCase().endsWith('.gltf')) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB and GLTF files are supported'), false);
    }
  }
});

// Endpoint to upload a model
app.post('/upload', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newModel = new Model({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    
    const savedModel = await newModel.save();
    res.status(201).json({ 
      message: 'Model uploaded successfully', 
      id: savedModel._id,
      name: savedModel.name
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload model' });
  }
});

// Endpoint to get a model
app.get('/model/:id', async (req, res) => {
  try {
    console.log('Fetching model with ID:', req.params.id);
    const model = await Model.findById(req.params.id);
    
    if (!model) {
      console.log('Model not found:', req.params.id);
      return res.status(404).json({ error: 'Model not found' });
    }
    
    console.log('Found model:', {
      name: model.name,
      contentType: model.contentType,
      dataSize: model.data.length
    });
    
    // Important: For binary files like GLB, set the correct content type
    if (model.name.toLowerCase().endsWith('.glb')) {
      res.contentType('model/gltf-binary');
      console.log('Setting content type: model/gltf-binary');
    } else if (model.name.toLowerCase().endsWith('.gltf')) {
      res.contentType('model/gltf+json');
      console.log('Setting content type: model/gltf+json');
    } else {
      res.contentType(model.contentType);
      console.log('Setting content type:', model.contentType);
    }
    
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log('Sending model data...');
    res.send(model.data);
  } catch (err) {
    console.error('Error retrieving model:', err);
    res.status(500).json({ error: 'Failed to retrieve model' });
  }
});

// List all models
app.get('/models', async (req, res) => {
  try {
    // Only return metadata, not the actual model data
    const models = await Model.find({}, { data: 0 });
    res.json(models);
  } catch (err) {
    console.error('Error listing models:', err);
    res.status(500).json({ error: 'Failed to list models' });
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the 3D Model API server! 🎉');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message || 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  