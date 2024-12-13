import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import './index.css';

const PlayingPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushRadius, setBrushRadius] = useState(10);
  const [images, setImages] = useState([]); // State to hold retrieved images
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert('Please upload only PNG/JPEG files');
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const generateMask = () => {
    if (canvasRef.current) {
      const maskData = canvasRef.current.getDataURL('image/png');
      const img = new Image();
      img.src = maskData;

      img.onload = () => {
        const maskCanvas = document.createElement('canvas');
        const ctx = maskCanvas.getContext('2d');
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;

        ctx.fillStyle = '#000000'; // Fill black
        ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        ctx.drawImage(img, 0, 0);

        const finalMaskData = maskCanvas.toDataURL('image/png');
        setMaskImage(finalMaskData); // Store mask image
      };
      return maskData;
    }
    return null;
  };

  const handleExport = async () => {
    await generateMask();
  };

  const handleUploadImages = async () => {
    if (uploadedImage && maskImage) {
      const formData = new FormData();
      const originalBlob = await fetch(uploadedImage).then(res => res.blob());
      const maskBlob = await fetch(maskImage).then(res => res.blob());

      formData.append('original', originalBlob, 'original.png');
      formData.append('mask', maskBlob, 'mask.png');

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log(result); // Handle response as needed

        // Fetch updated image list after uploading
        fetchImages();
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      alert('Please generate a mask before uploading.');
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/images');
      const data = await response.json();
      setImages(data); // Store retrieved images in state
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    // Fetch images when the component mounts
    fetchImages();
  }, []);

  return (
    <div className="image-inpainting-container">
      <div className="upload-section">
        {uploadedImage ? <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          className="file-input"
        /> : <><h1>Upload Your Image</h1><input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="file-input" /></>}
      </div>

      {uploadedImage && (
        <div className="canvas-section">
          <div className="canvas-controls">
            <label>
              Brush Size:
              <input
                type="range"
                min="5"
                max="50"
                value={brushRadius}
                onChange={(e) => setBrushRadius(Number(e.target.value))}
              />
              {brushRadius}px
            </label>
            <button onClick={handleClearCanvas}>Clear Canvas</button>
            <button onClick={handleExport}>Generate Mask</button>
            <button onClick={handleUploadImages}>Upload Images</button>
          </div>

          <div className="canvas-wrapper">
            <CanvasDraw
              ref={canvasRef}
              brushColor="white" // Keep brush color white for the sketch
              brushRadius={brushRadius}
              canvasWidth={600}
              canvasHeight={400}
              imgSrc={uploadedImage}
              hideGrid={true}
              canvasBgColor="#000000" // Background of the drawing canvas
              className="drawing-canvas"
            />
          </div>
        </div>
      )}

      <div className="image-comparison">
        {uploadedImage && (
          <div className="image-container">
            <h4>Original Image</h4>
            <img src={uploadedImage} alt="Original" className="display-image" />
          </div>
        )}

        {maskImage && (
          <div className="image-container">
            <h4>Generated Mask</h4>
            <img src={maskImage} alt="Generated Mask" className="display-image" />
          </div>
        )}
      </div>

      <div className="retrieved-images">
        <h4>Uploaded Images from Database:</h4>
        {images.length > 0 ? (
          images.map((image) => (
            <div className="image-box" key={image._id}>
              <div>
              <p>Original Uploaded</p>
              <img 
                src={`http://localhost:5000/${image.originalImagePath}`} 
                alt="Original Uploaded" 
                className="display-image" 
              />
              </div>
              <div>
              <p>Mask Image</p>
              <img 
                src={`http://localhost:5000/${image.maskImagePath}`} 
                alt="Mask Uploaded" 
                className="display-image" 
              />
              </div>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
};

export default PlayingPage;
