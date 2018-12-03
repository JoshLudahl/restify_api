# RESTify API
Playing with RESTify - This is a basic user login system using JSON Web Tokens for route protection.

## Routes:

### User:

* POST    '/register'     - takes email and password and returns token
* GET     '/users'        - returns all users (must be authenticated)
* DELETE  '/user/{id}'    - deletes one user by id (must be authenticated & have authorization to delete user)
* POST    '/login'        - authenticates the user



