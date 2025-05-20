# Digiballot - Voting Application Backend

[![Node.js](https://img.shields.io/badge/Node.js-v24.0.0-brightgreen)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express-v5.1.0-blue)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.0.9-green)](https://www.mongodb.com/)  
[![JWT](https://img.shields.io/badge/JWT-v9.0.2-yellow)](https://jwt.io/)  
[![bcrypt](https://img.shields.io/badge/bcrypt-v5.1.0-blueviolet)](https://www.npmjs.com/package/bcrypt)

---

Digiballot is a secure backend voting system built with Node.js, Express, and MongoDB. It uses JWT for authentication and bcrypt for password security, with robust role-based access control to separate user and admin permissions. This architecture ensures a trustworthy and efficient digital voting experience.

---

## Features

- User sign up and login using **Aadhar Card Number** and password  
- Users can view the list of candidates  
- Users can vote for a candidate **only once**  
- Admins can manage candidates (add, update, delete)  
- Admins **cannot** vote  

---

## Technologies Used

- Node.js  
- Express.js  
- MongoDB  
- JSON Web Tokens (JWT) for authentication  
- bcrypt for password hashing  

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Chandan-kr-tiwari/DigiBallot.git
   cd DigiBallot
   ```


2.  Install dependencies:

   ```bash
     npm install
   ```

3.  Create a `.env` file in the root directory and add necessary environment variables:

   ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
     npm start
   ```

## API Endpoints

### Authentication

| Endpoint | Method | Description       |
| -------- | ------ | ----------------- |
| /signup  | POST   | Register a new user |
| /login   | POST   | Login user          |


### Candidates

| Endpoint               | Method | Description               | Access     |
|------------------------|--------|---------------------------|------------|
| /candidates            | GET    | Get list of candidates     | Public     |
| /candidates            | POST   | Add a new candidate        | Admin only |
| /candidates/:candidateId | PUT    | Update a candidate by ID   | Admin only |
| /candidates/:candidateId | DELETE | Delete a candidate by ID   | Admin only |



### Voting

| Endpoint                 | Method | Description                 | Access    |
|--------------------------|--------|-----------------------------|-----------|
| /candidates/vote/count   | GET    | Get vote counts per candidate | Public    |
| /candidates/vote/:candidateId | POST   | Vote for a candidate by ID    | User only |



### User Profile

| Endpoint                 | Method | Description               |
| ------------------------ | ------ | ------------------------- |
| /users/profile           | GET    | Get logged-in user profile |
| /users/profile/password  | PUT    | Change user password       |


## Usage

Use tools like Postman or Insomnia to test API endpoints.

Remember to include the JWT token in the `Authorization` header for protected routes.

### Example Header
Use the header `Authorization: Bearer <your-jwt-token>` in your requests.


## Author

[Chandan Kr Tiwari](https://github.com/Chandan-kr-tiwari)









