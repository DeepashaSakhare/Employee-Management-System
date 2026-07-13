# Employee Management System

A full-stack Employee Management System built with Node.js, Express, MongoDB, Mongoose, and vanilla frontend technologies.

> Note: This project runs on port `5001` so it can coexist with another authentication project using `localhost:5000`.
>
> Confidentiality: only the admin user should manage employee data to keep worker records secure. For testing, use the admin credentials below.
>
> Test admin credentials:
> - Email: admin@example.com
> - Password: StrongPassword123

## Features

- Admin authentication with JWT and bcrypt password hashing
- Secure login and logout
- Protected routes for employee management
- Dashboard with total employees, active employees, departments count, and recent hires
- Create, read, update, delete employee records
- Responsive Bootstrap 5 UI with sidebar, cards, tables, modals, and forms
- Search by name, employee ID, and department
- Validation on frontend and backend


## Setup Instructions

### 1. Install Dependencies

Open a terminal in the `backend` folder and run:

```bash
npm install


2. Install MongoDB Community Server
If MongoDB is not installed, download and install from:

https://www.mongodb.com/try/download/community
3. Start MongoDB Locally
Run MongoDB using the default local URI:
mongod --dbpath C:\data\db

Or start the MongoDB service if installed as a service.

4. Configure Environment Variables
Open backend/.env and update the values as needed:

PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/employeeDB
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h

Security note: only the admin user should access and manage employee records to protect worker confidentiality.

5. Run the Backend
From the backend folder:
npm run dev

6. Run the Frontend
Open frontend/index.html in your browser.

Alternatively, use Live Server in VS Code.

7. CRUD Operations Implementation
This project implements Employee CRUD operations with frontend forms and backend REST APIs.

Create: POST /api/employees saves a new employee using employeeController.createEmployee and automatically generates a new employeeId.
Read: GET /api/employees returns all employees, and GET /api/employees/:id returns a single employee by document ID
Update: PUT /api/employees/:id updates employee data and validates unique email and required fields.
Delete: DELETE /api/employees/:id removes the selected employee record from MongoDB.


Employee data is stored in MongoDB using the Employee model, and all employee routes are protected by JWT middleware so only authenticated admins can access them.

8. Test APIs in Postman
Use these endpoints:

POST http://localhost:5001/api/auth/register
POST http://localhost:5001/api/auth/login
GET http://localhost:5001/api/auth/logout
GET http://localhost:5001/api/employees
GET http://localhost:5001/api/employees/:id
POST http://localhost:5001/api/employees
PUT http://localhost:5001/api/employees/:id
DELETE http://localhost:5001/api/employees/:id

9. Verify CRUD Operations

Login as admin
Add a new employee
View the employee list
Edit employee details
Delete an employee
Validate search and dashboard stats
