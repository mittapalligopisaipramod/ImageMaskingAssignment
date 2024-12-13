const mongoose = require('mongoose');

const ImageMetadataSchema = new mongoose.Schema({
  originalImagePath: { type: String, required: true },
  maskImagePath: { type: String, required: true },
});

module.exports = mongoose.model('imageMetadatas', ImageMetadataSchema);
