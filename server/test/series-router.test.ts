import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import seriesService, {Series} from '../src/services/series-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3002';

const testSeries: Series[] = [
    { series_id: 1, name: 'Marine Series'},
    { series_id: 2, name: 'Animal Series'},
    { series_id: 3, name: 'Christmas series'},
  ];

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3002, () => done());
});

beforeEach((done) => {
    // Delete all series, and reset id auto-increment start value
    pool.query('DELETE FROM Series', (error) => {
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
    test('Fetch all series (200 OK)', (done) => {
      axios.get('/series').then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testSeries);
        done();
      });
    });
  
    test('Fetch Series (200 OK)', (done) => {
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
        expect(response.data).toEqual({ id: 4 });
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
  
  describe('Update series (PUT)', () => {
    test('Update series (200 OK)', (done) => {
      axios
        .put('/series/1', { name: 'Oppdatert navn', done: true})
        .then((response) => {
          expect(response.status).toEqual(200);
          done();
        });
    });
  });

