const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ImageMetadata = require('./models/ImageMetadata');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint to upload images
app.post('/upload', upload.fields([{ name: 'original' }, { name: 'mask' }]), async (req, res) => {
  const originalImagePath = `uploads/${req.files['original'][0].originalname}`;
  const maskImagePath = `uploads/${req.files['mask'][0].originalname}`;

  const imageMetadata = new ImageMetadata({
    originalImagePath,
    maskImagePath,
  });

  try {
    await imageMetadata.save();
    res.status(201).json({ id: imageMetadata._id, original: originalImagePath, mask: maskImagePath });
  } catch (error) {
    res.status(500).json({ message: 'Error saving image metadata', error });
  }
});

// Endpoint to get image metadata by ID
app.get('/images', async (req, res) => {
  try {
    const images = await ImageMetadata.find();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error); // Log the error to the console
    res.status(500).json({ message: 'Error fetching images', error });
  }
});


// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
