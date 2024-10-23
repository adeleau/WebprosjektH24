import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import taskService, { Task } from '../src/task-service';

const testTasks: Task[] = [
  { id: 1, title: 'Les leksjon', done: false , description: 'PPT 1 og 2'},
  { id: 2, title: 'Møt opp på forelesning', done: false , description: 'Uke 34'},
  { id: 3, title: 'Gjør øving', done: false , description: 'Øving 2'},
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tasks', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    taskService
      .create(testTasks[0].title, testTasks[0].description)
      .then(() => taskService.create(testTasks[1].title, testTasks[1].description)) // Create testTask[1] after testTask[0] has been created
      .then(() => taskService.create(testTasks[2].title, testTasks[2].description)) // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch tasks (GET)', () => {
  test('Fetch all tasks (200 OK)', (done) => {
    axios.get('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test('Fetch task (200 OK)', (done) => {
    axios.get('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/tasks/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios.post('/tasks', { title: 'Ny oppgave', description: 'Ny oppgave' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });
});

describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Update task (PUT)', () => {
  test('Update task (200 OK)', (done) => {
    axios
      .put('/tasks/1', { title: 'Oppdatert tittel', done: true, description: 'Oppdatert beskrivelse' })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });
});


// for å få mer dekning: feilmelding på create (x 400 bad request - oppgave uten tittel), delete (x 404 not found - ikke-eksisterende oppgave) og update (x 400 bad request - uten tittel)