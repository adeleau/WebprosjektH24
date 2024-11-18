import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import seriesService, { Series } from '../src/services/series-service';

const testSeries: Series[] = [
    { series_id: 1, name: 'Marine Series' },
    { series_id: 2, name: 'Animal Series' },
    { series_id: 3, name: 'Christmas series' },
  ];

axios.defaults.baseURL = 'http://localhost:3002';

let webServer: any;
beforeAll((done) => {
  webServer = app.listen(3002, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    pool.query('TRUNCATE TABLE Angels', (error) => {
      if (error) return done(error);

      pool.query('TRUNCATE TABLE Series', (error) => {
        if (error) return done(error);

        pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
          if (error) return done(error);
        })

      // Create testTasks sequentially in order to set correct id, and call done() when finished
      seriesService
        .createSeries({ name: testSeries[0].name })
        .then(() => seriesService.createSeries({ name: testSeries[1].name }) 
        .then(() => seriesService.createSeries({ name: testSeries[2].name }) 
        .then(() => done()))); // Call done() after testTask[2] has been created
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch series (GET)', () => {
  test('Fetch all series (200 OK)', (done) => {
    axios.get('/series').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testSeries);
      done();
    });
  });

  test('Fetch series (200 OK)', (done) => {
    axios.get('/series/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testSeries[0]);
      done();
    });
  });

  test('Fetch series (404 Not Found)', (done) => {
    axios
      .get('/series/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new series (POST)', () => {
  test('Create new series (200 OK)', (done) => {
    axios.post('/series', { name: 'Dreaming Christmas' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ name: 'Dreaming Christmas' });
      done();
    });
  });
});

describe('Delete series (DELETE)', () => {
  test('Delete series (200 OK)', (done) => {
    axios.delete('/series/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Error handling for Series API', () => {
  test('Create series without name (400 Bad Request)', (done) => {
    axios
      .post('/series', {}) // Ingen name i body
      .then(() => done(new Error('Request should have failed')))
      .catch((error) => {
        expect(error.response?.status).toEqual(400);
        expect(error.response?.data).toEqual('Series name is required'); // Juster etter din API-implementasjon
        done();
      });
  });

  test('Delete non-existing series (404 Not Found)', (done) => {
    axios
      .delete('/series/999') // Ikke-eksisterende ID
      .then(() => done(new Error('Request should have failed')))
      .catch((error) => {
        expect(error.response?.status).toEqual(404);
        expect(error.response?.data).toEqual('Series not found'); // Juster etter din API-implementasjon
        done();
      });
  });
})
