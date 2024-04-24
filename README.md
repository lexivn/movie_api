# Movie API Documentation

This API provides information about movies, genres, and directors. Users can interact with the API to retrieve details about movies, genres, directors, create new users, and manage their favorite movies.

## Table of Contents

- [Endpoints](#endpoints)
  - [1. Get All Movies](#1-get-all-movies)
  - [2. Get Movie by ID](#2-get-movie-by-id)
  - [3. Get Genre Description](#3-get-genre-description)
  - [4. Get Director by Name](#4-get-director-by-name)
  - [5. Create New User](#5-create-new-user)
  - [6. Update User Details](#6-update-user-details)
  - [7. Add Movie to User's Favorites](#7-add-movie-to-users-favorites)
  - [8. Remove Movie from User's Favorites](#8-remove-movie-from-users-favorites)
  - [9. Delete User](#9-delete-user)

## Endpoints

### 1. Get All Movies

- **Request:**

  - Method: `GET`
  - URL: `/movies`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: A JSON object containing data on all movies.

### 2. Get Movie by ID

- **Request:**

  - Method: `GET`
  - URL: `/movies/[title]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: A JSON object containing data about a specific movie, including title, description, director details, genre with description, release date, image URL, and featured status.

### 3. Get Genre Description

- **Request:**

  - Method: `GET`
  - URL: `/movies/genre/[name]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: A JSON object containing the description of a genre.

### 4. Get Director by Name

- **Request:**

  - Method: `GET`
  - URL: `/movies/director/[name]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: A JSON object containing details about a director, including name, bio, birth date, and death date.

### 5. Create New User

- **Request:**

  - Method: `POST`
  - URL: `/users`
  - Request Body Format: JSON
    ```json
    {
      "Username": "AlexSoto",
      "Password": "al3x5oto123*",
      "Email": "asoto@fakemail.com",
      "Birthday": "1996-06-09"
    }
    ```

- **Response:**
  - Format: JSON
  - Description: A JSON object with user details, including the new user's ID, version, date, and an empty list of favorite movies.

### 6. Update User Details

- **Request:**

  - Method: `PUT`
  - URL: `/users/[name]`
  - Request Body Format: JSON (with at least one updated field)
    ```json
    {
      "Password": "123*####",
      "Email": "newmail@nonexist.com",
      "Birthday": "1983-06-09"
    }
    ```

- **Response:**
  - Format: JSON
  - Description: Updated user details.

### 7. Add Movie to User's Favorites

- **Request:**

  - Method: `POST`
  - URL: `/users/[name]/movies/[movie._id]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: Updated user details.

### 8. Remove Movie from User's Favorites

- **Request:**

  - Method: `DELETE`
  - URL: `/users/[name]/movies/[movie._id]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: Updated user details.

### 9. Delete User

- **Request:**

  - Method: `DELETE`
  - URL: `/users/[name]`
  - Request Body: None

- **Response:**
  - Format: JSON
  - Description: A message confirming the removal of the user.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt
- body-parser
- cors
- express-validator
- jsonwebtoken
- lodash
- passport
- passport-jwt
- passport-local
- uuid

## Getting Started

1. Install dependencies: `npm install`
2. Start the server: `npm start` or for development with nodemon: `npm run dev`

## Author

- **Alex Soto**
<div id="badges">
  <a href="https://www.linkedin.com/in/alexisedson/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
</div>

## License

This project is licensed under the ISC License.

Feel free to explore and interact with the Movie API!
