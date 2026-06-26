const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoute = require('./routes/userRoute');
const careerRoute = require('./routes/careerRoute');
const universityRoute = require('./routes/universityRoute');
const majorRoute = require('./routes/majorRoute');
const scholarshipRoute = require('./routes/scholarshipRoute');
const tuitionFeeRoute = require('./routes/tuitionFeeRoute');
const facultyRoute = require('./routes/facultyRoute');

app.use('/api/users', userRoute);
app.use('/api/careers', careerRoute);
app.use('/api/universities', universityRoute);
app.use('/api/majors', majorRoute);
app.use('/api/scholarships', scholarshipRoute);
app.use('/api/tuition-fees', tuitionFeeRoute);
app.use('/api/faculties', facultyRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
