# 3D Model Viewer Web Application

A full-stack web application for uploading and viewing 3D models in GLB/GLTF format. Built with React, Three.js, Express, and MongoDB.

## Features

- Upload 3D models in GLB/GLTF format
- View 3D models with interactive controls (pan, zoom, rotate)
- Store models in MongoDB database
- Modern, responsive user interface
- Real-time model rendering using Three.js
- Error handling and loading states

## Tech Stack

### Frontend
- React
- @react-three/fiber
- @react-three/drei
- Three.js

### Backend
- Node.js
- Express
- MongoDB
- Multer (file handling)
- CORS

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd 3d-project
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../3d-model-viewer
npm install
```

## Configuration

1. Make sure MongoDB is running on your system
2. The backend server runs on port 5000 by default
3. The frontend development server runs on port 3000

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd 3d-model-viewer
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a 3D Model:
   - Click on the file input in the Dashboard
   - Select a GLB or GLTF format file
   - Click the "Upload Model" button
   - Wait for the upload confirmation

2. View the 3D Model:
   - The model will automatically appear in the viewer
   - Use mouse controls:
     - Left click + drag to rotate
     - Right click + drag to pan
     - Scroll to zoom

## Project Structure

```
3d-project/
├── 3d-model-viewer/          # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.js  # File upload component
│   │   │   └── ModelViewer.js# 3D viewer component
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Entry point
│   └── public/              # Static files
└── server/                  # Backend Express server
    └── index.js            # Server implementation
```

## Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Upload failures
- Model loading issues
- Server connection problems
- Database errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Three.js for 3D rendering
- React Three Fiber for React integration
- MongoDB for database management
- Express for backend server 