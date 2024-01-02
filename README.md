# Note-Taking API
A simple note-taking API that supports CRUD operations via a RESTful interface. The API is built using Node.js and Express.js, with MongoDB as the database. Follow the instructions below to set up and use the API.

## Installation
1. Make sure you have Node.js and npm installed.
2. Clone the repository and navigate to the project folder.
3. Install dependencies by running: `npm install`

## Running the Server
Start the server using the following command:
```bash
npm start
```

# MongoDB Setup
Make sure you have MongoDB installed and running locally. The API is configured to connect to a MongoDB database named `note-api`. Adjust the connection URL in `app.js` if needed.

## REST API
A note object has the following structure:

```json
{
    "_id": "60b2f3533a1b760d5817ad10",
    "title": "Sample Note",
    "content": "This is a sample note content.",
    "createdAt": "2022-05-29T12:34:59.000Z",
    "updatedAt": "2022-05-29T12:34:59.000Z"
}

```

# List All Notes
**GET /notes/all**

Returns a list of all notes.

*Returns*:
Array of note objects

# Retrieve a Single Note
**GET /notes/:id**

Returns a single note based on its ID.

*Args*:
- `id: string` (Note ID)

*Returns*:
Note object

# Add a New Note
**POST /notes/add**

Adds a new note.

*Args*:
- `title: string` (Title of the note)
- `content: string` (Content of the note)

*Returns*:
Note object

# Update a Note
**PUT /notes/update/:id**

Updates an existing note.

*Args*:
- `id: string` (Note ID)
- `title: string` (Updated title, optional)
- `content: string` (Updated content, optional)

*Returns*:
Updated note object

# Delete a Note
**DELETE /notes/delete/:id**

Deletes a note based on its ID.

*Args*:
- `id: string` (Note ID)

*Returns*:
- `success: boolean` (True if deleted successfully, False otherwise)

# Authentication
Basic authentication has been implemented to protect the endpoints. Include the `Authorization` header in user requests with the username and password to access the protected routes.

# Testing
To run tests for the API, follow these steps:
1. Ensure that the server is not running.
2. Run the tests using the following command:
   ```bash
   npm test
    ```
