// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';

// // Load environment variables
// dotenv.config();

// // Import routes
// import customerRoutes from './routes/customerRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';

// // Initialize app
// const app = express();

// // Middleware
// app.use(cors({
//   origin: ['*'], // or other allowed origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(bodyParser.json());

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Serve static files from uploads directory
// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/customers', customerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);
// // User routes
// app.use('/api/users', userRoutes);


// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Start server
// const PORT = process.env.PORT || 5000;

// // Socket.io connection for location updates
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for location updates from clients
//   socket.on('locationUpdate', async ({ userId, lat, lng }) => {
//     try {
//       // Update user's location in the database
//       await User.findByIdAndUpdate(userId, { location: { lat, lng } });
//       console.log(`Location updated for user ${userId}: ${lat}, ${lng}`);

//       // Emit updated location to all admins
//       io.emit('locationUpdate', { userId, lat, lng });
//     } catch (error) {
//       console.error('Error updating location:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import User from './models/User.js'; // Ensure you import the User model

// Load environment variables
dotenv.config();

// Import routes
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, { cors: { origin: '*' } });

// Serve static files (e.g., product images)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection for location updates
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for location updates from the client
//   socket.on('locationUpdate', async ({ userId, lat, lng }) => {
//     console.log(`Received location update for user ${userId}: Latitude: ${lat}, Longitude: ${lng}`);

//     try {
//       // Update the user's location in the database (optional)
//       const updateResult = await User.findByIdAndUpdate(userId, { location: { lat, lng } }, { new: true });

//       if (updateResult) {
//         console.log(`Location updated for user ${userId} in the database.`);
//       } else {
//         console.warn(`Failed to update location for user ${userId}. User may not exist in the database.`);
//       }
//     } catch (error) {
//       console.error('Error updating location in the database:', error.message);
//     }

//     try {
//       // Emit the updated location to all connected admins (or any specific group if needed)
//       // Assuming you have a mechanism to identify if a socket connection belongs to an admin
//       // Example: if (socket.user.role === 'admin') or use rooms or namespaces
//       io.emit('locationUpdate', { userId, lat, lng });
//       console.log(`Location update emitted to connected clients for user ${userId}.`);
//     } catch (emitError) {
//       console.error('Error emitting location update to clients:', emitError.message);
//     }
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for location updates from the client
  socket.on('locationUpdate', ({ userId, lat, lng }) => {
    console.log(`Received location update for user ${userId}: Latitude: ${lat}, Longitude: ${lng}`);

    // Emit the updated location to all connected clients
    try {
      io.emit('locationUpdate', { userId, lat, lng });
      console.log(`Location update emitted to all connected clients for user ${userId}.`);
    } catch (emitError) {
      console.error('Error emitting location update to clients:', emitError.message);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Use server.listen instead of app.listen to enable socket.io and HTTP on the same server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));