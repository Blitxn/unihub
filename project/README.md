# UniHub Backend

A Node.js Express backend for a university information portal that provides data about careers, universities, majors, scholarships, and tuition fees.

## Features

- User authentication (register/login)
- Career management
- University information
- Major/Faculty management
- Scholarship database
- Tuition fee tracking

## Prerequisites

- Node.js (v14 or higher)
- MySQL database

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure database connection in `.env` file

3. Create database tables using the provided SQL schema

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Careers
- `POST /api/careers` - Create career
- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get career by ID
- `PUT /api/careers/:id` - Update career
- `DELETE /api/careers/:id` - Delete career

### Universities
- `POST /api/universities` - Create university
- `GET /api/universities` - Get all universities
- `GET /api/universities/:id` - Get university by ID
- `PUT /api/universities/:id` - Update university
- `DELETE /api/universities/:id` - Delete university

### Majors
- `POST /api/majors` - Create major
- `GET /api/majors` - Get all majors
- `GET /api/majors/:id` - Get major by ID
- `GET /api/majors/university/:universityId` - Get majors by university
- `PUT /api/majors/:id` - Update major
- `DELETE /api/majors/:id` - Delete major

### Scholarships
- `POST /api/scholarships` - Create scholarship
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/:id` - Get scholarship by ID
- `GET /api/scholarships/university/:universityId` - Get scholarships by university
- `PUT /api/scholarships/:id` - Update scholarship
- `DELETE /api/scholarships/:id` - Delete scholarship

### Tuition Fees
- `POST /api/tuition-fees` - Create tuition fee
- `GET /api/tuition-fees` - Get all tuition fees
- `GET /api/tuition-fees/:id` - Get tuition fee by ID
- `GET /api/tuition-fees/major/:majorId` - Get fees by major
- `GET /api/tuition-fees/university/:universityId` - Get fees by university
- `PUT /api/tuition-fees/:id` - Update tuition fee
- `DELETE /api/tuition-fees/:id` - Delete tuition fee

### Faculties
- `POST /api/faculties` - Create faculty
- `GET /api/faculties` - Get all faculties
- `GET /api/faculties/:id` - Get faculty by ID
- `GET /api/faculties/university/:universityId` - Get faculties by university
- `PUT /api/faculties/:id` - Update faculty
- `DELETE /api/faculties/:id` - Delete faculty

## Running the Server

```bash
npm start
```

The server will start on the port specified in the `.env` file (default: 3000)

## Health Check

`GET /api/health` - Check if server is running
