const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Note = require('../src/models/Note');

// Connect to the test database
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/note-api-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database before each test
beforeEach(async () => {
  await Note.deleteMany();
});

// Close the database connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
  // close the server connection
  await app.close();
});

describe('Note API Endpoints', () => {
  it('should create a new note', async () => {
    const response = await request(app)
      .post('/notes/add')
      .auth('Shashanka G', 'NotesApiP@ssw0rd')
      .send({
        title: 'Test Note',
        content: 'This is a test note',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('createdNote');
  });

  it('should retrieve all notes', async () => {
    await Note.create({
      title: 'Test Note 1',
      content: 'This is test note 1',
    });

    await Note.create({
      title: 'Test Note 2',
      content: 'This is test note 2',
    });

    const response = await request(app)
      .get('/notes/all')
      .auth('Shashanka G', 'NotesApiP@ssw0rd');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('notes');
    expect(response.body.notes.length).toBe(2);
  });

  it('should update a note by ID', async () => {
    // Create a test note
    const createdNote = await Note.create({
      title: 'Update Test Note',
      content: 'This is a note to update',
    });

    const response = await request(app)
      .put(`/notes/update/${createdNote._id}`)
      .auth('Shashanka G', 'NotesApiP@ssw0rd')
      .send({
        title: 'Updated Test Note',
        content: 'This is the updated content',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', createdNote._id.toString());
    expect(response.body).toHaveProperty('title', 'Updated Test Note');
    expect(response.body).toHaveProperty('content', 'This is the updated content');
  });

  it('should delete a note by ID', async () => {
    // Create a test note
    const createdNote = await Note.create({
      title: 'Delete Test Note',
      content: 'This is a note to delete',
    });
  
    const response = await request(app)
      .delete(`/notes/delete/${createdNote._id}`)
      .auth('Shashanka G', 'NotesApiP@ssw0rd');
  
    expect(response.status).toBe(200);
    expect(response.body.deletedNote).toHaveProperty('_id', createdNote._id.toString());
    expect(response.body.deletedNote).toHaveProperty('title', 'Delete Test Note');
    expect(response.body.deletedNote).toHaveProperty('content', 'This is a note to delete');
  });
});