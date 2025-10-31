const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const Driver = require('./models/driver');
const PickupPoint = require('./models/pickupPoint');
const Assignment = require('./models/assignment');
const { mockDrivers, mockPickupPoints, mockAssignments } = require('./lib/mockData');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://127.0.0.1:27017/driverapp'; // Standard local MongoDB URI

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase(); // Seed data after successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


// Function to seed the database with initial data if it's empty
const seedDatabase = async () => {
  try {
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      console.log('Seeding drivers...');
      await Driver.insertMany(mockDrivers);
    }

    const pickupPointCount = await PickupPoint.countDocuments();
    if (pickupPointCount === 0) {
      console.log('Seeding pickup points...');
      await PickupPoint.insertMany(mockPickupPoints);
    }

    const assignmentCount = await Assignment.countDocuments();
    if (assignmentCount === 0) {
      console.log('Seeding assignments...');
      await Assignment.insertMany(mockAssignments);
    }
    
    if(driverCount > 0 && pickupPointCount > 0 && assignmentCount > 0) {
        console.log('Database already seeded.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
