import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import seriesService, { Series } from '../src/services/series-service';
//import { response } from 'express';

const testSeries: Series[] = [
    { series_id: 1, name: 'Marine Series'},
    { series_id: 2, name: 'Animal Series'},
    { series_id: 3, name: 'Christmas series'},
];

axios.defaults.baseURL = 'http://localhost:3002';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3002, () => done());
});

beforeEach((done) => {
    // Delete all series, and reset id auto-increment start value
    pool.query('TRUNCATE TABLE Series', (error) => {
      if (error) return done(error);
  
      const query = 'INSERT INTO Series (series_id, name) VALUES ?';
      const values = testSeries.map((series) => [series.series_id, series.name]);

      pool.query(query, [values], (error) => {
        if (error) return done(error);
        done();
      });
    });
  });

afterAll((done) => {
    if (!webServer) return done(new Error());
    webServer.close(() => pool.end(() => done()));
});

describe('Fetch series (GET)', () => {
  test('Fetch all series (200 OK)', async () => {
    const response = await axios.get('/series')
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testSeries);
  });

    test('Fetch Series (200 OK)', async () => {
    const response = await axios.get('/series/1')
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testSeries[0]);
  });
  
    test('Fetch series (404 Not Found)', async() => {
      try {
        await axios.get('/series/4'); 
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toEqual(404);
          expect(error.message).toContain('Request failed with status code 404');
      } else {
      throw error;
      }
    }
  });
});
  
describe('Create new series (POST)', () => {
  test('Create new series (201 Created)', async () => {
    const response = await axios.post('/series', { name: 'Dreaming Christmas' });
    expect(response.status).toEqual(201);
    expect(response.data).toEqual(expect.objectContaining({ id: 4 }));
  });
});

describe('Delete series (DELETE)', () => {
  test('Delete series (200 OK)', async () => {
    const response = await axios.delete('/series/2');
    expect(response.status).toEqual(200);
  });
});

describe('Update series (PUT)', () => {
  test('Update series (200 OK)', async () => {
    const response = await axios.put('/series/1', { name: 'Oppdatert navn', done: true });
    expect(response.status).toEqual(200);
  });
});
