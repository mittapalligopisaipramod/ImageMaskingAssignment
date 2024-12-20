# Project Title: MaskMaze

## Overview

This project is a web application that allows users to upload images, draw masks on them, and then export both the original and masked images also users can able to store both original image and masked image into databse. The frontend is built using React, and the backend is powered by Express.js with MongoDB as the database.

---

## Frontend Details

### Technologies Used
- **React**: For building the user interface.
- **react-canvas-draw**: For enabling users to draw on images.
- **CSS**: For styling the application.

### Key Features
1. **Image Upload**:
   - Users can upload JPEG or PNG images.
   - Validates the file format before loading the image onto the canvas.

2. **Mask Drawing**:
   - Once the image is uploaded, users can use a brush tool to draw on the image, creating a mask.
   - Users can adjust the brush size with a slider.

3. **Mask Export**:
   - Generates a mask image based on the drawing, displayed in a canvas with the drawn area in white and the background in black.

4. **Display Functionality**:
   - Displays the original image and the generated mask side-by-side below the canvas, allowing for easy comparison.

5. **Image Fetching**:
   - Fetches and displays previously uploaded images and masks from the backend.

### Challenges Faced
- **File Handling**: Ensuring that users could only upload valid image formats required implementing checks and validations.
- **State Management**: Managing the state for uploaded images and drawn masks required careful consideration to avoid unnecessary re-renders.
- **Cross-Origin Requests**: Configuring CORS properly when fetching images from the backend was necessary to avoid issues.

---

## Backend Details

### Technologies Used
- **Express.js**: For creating the API.
- **Mongoose**: For interacting with MongoDB.
- **Multer**: For handling file uploads.
- **dotenv**: To manage environment variables for sensitive data.

### Key Endpoints
1. **POST /upload**:
   - Accepts image uploads (original and mask).
   - Saves the image paths to the database.

2. **GET /images**:
   - Retrieves metadata for all uploaded images and masks.

### File Structure
backend/ 
├── models/ 
│       └── ImageMetadata.js # Mongoose model for storing image metadata 
├── uploads/ # Directory for storing uploaded images 
├── .env # Environment variables (e.g., MongoDB URI) 
├── package.json # Dependency manifest for the Node.js application 
├── server.js # Entry point for the Express application

## Project Implementation Video

https://github.com/user-attachments/assets/6a01d5a7-cb8c-4c7f-a7a6-d2f32fb8e119


### Sample Code

```javascript
// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
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
  // Save metadata logic...
});
