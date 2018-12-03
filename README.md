# restify_api
Playing with RESTify

## Routes:

### User:

* POST '/register' - takes email and password and returns token
* GET '/users' - returns all users (must be authenticated)
* DELETE '/user/{id}' - deletes one user by id (must be authenticated & have authorization to delete user)
* POST '/login' - authenticates the user



