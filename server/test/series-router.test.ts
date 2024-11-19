import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import seriesService, { Series } from '../src/services/series-service';

const testSeries: Series[] = [
  { series_id: 60, name: 'Marine Series' },
  { series_id: 61, name: 'Animal Series' },
  { series_id: 62, name: 'Christmas series' },
];

axios.defaults.baseURL = 'http://localhost:3002';

let webServer: any;

// Set Jest timeout to 30 seconds
jest.setTimeout(60000);

beforeAll((done) => {
  webServer = app.listen(3002, () => done());
});

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    pool.query('DELETE FROM Series', (error) => {
      if (error) return done(error);

      pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
        if (error) return done(error);

        // Insert specific `series_id` values directly
        const insertQuery =
          'INSERT INTO Series (series_id, name) VALUES ?';
        const values = testSeries.map((series) => [series.series_id, series.name]);

        pool.query(insertQuery, [values], (error) => {
          if (error) return done(error);
          done();
        });
      });
    });
  });
});

/*
beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    pool.query('DELETE FROM Angels', (error) => {
      if (error) return done(error);

      pool.query('DELETE FROM Series', (error) => {
        if (error) return done(error);

        pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
          if (error) return done(error);

          // Insert test data sequentially
          seriesService
            .createSeries({ name: testSeries[0].name })
            .then(() => seriesService.createSeries({ name: testSeries[61].name }))
            .then(() => seriesService.createSeries({ name: testSeries[62].name }))
            .then(() => done())
            .catch(done);
        });
      });
    });
  });
});*/

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});
describe('Series Router Tests', () => {
  test('Fetch all series (200 OK)', (done) => {
    axios.get('/series').then((response) => {
      expect(response.status).toEqual(200);
      const sortedTestSeries = testSeries.sort((a, b) => a.series_id - b.series_id);
      const sortedResponse = response.data.sort((a: Series, b: Series) => a.series_id - b.series_id);

      expect(sortedResponse).toEqual(sortedTestSeries);
      done();
    }).catch(done);
  });

  test('Fetch series by ID (200 OK)', (done) => {
    axios.get('/series/name/60').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testSeries[0].name);
      done();
    }).catch(done);
  });

  test('Fetch series by ID (404 Not Found)', (done) => {
    axios.get('/series/name/999').then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('Series not found');
      done();
    });
  });

  test('Create new series (201 Created)', (done) => {
    axios.post('/series', { name: 'Dreaming Christmas' }).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toHaveProperty('name', 'Dreaming Christmas');
      done();
    }).catch(done);
  });

  test('Create series with missing name (400 Bad Request)', (done) => {
    axios.post('/series', {}).then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(400);
      expect(error.response?.data).toEqual('Series name is required');
      done();
    });
  });

  test('Delete existing series (200 OK)', (done) => {
    axios.delete('/series/60').then((response) => {
      expect(response.status).toEqual(200);
      done();
    }).catch(done);
  });

  test('Delete non-existing series (404 Not Found)', (done) => {
    axios.delete('/series/999').then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('Series not found');
      done();
    });
  });
});

/*describe('Fetch series (GET)', () => {
  test('Fetch all series (200 OK)', (done) => {
    axios.get('/series').then((response) => {
      expect(response.status).toEqual(200);
      console.log(response.data)
      const sortedTestSeries = testSeries.sort((a, b) => a.series_id - b.series_id);
      const sortedResponse = response.data.sort((a: Series, b: Series) => a.series_id - b.series_id);

      expect(sortedResponse).toEqual(sortedTestSeries);
      done();
    }).catch(done);
  });

  test('Fetch series by ID (200 OK)', (done) => {
    axios.get('/series/name/60').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testSeries[0].name);
      done();
    }).catch(done);
  });

  test('Fetch series by ID (404 Not Found)', (done) => {
    axios.get('/series/name/999').then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(500);
      expect(error.response?.data).toEqual('Series not found');
      done();
    });
  });
});

describe('Create new series (POST)', () => {
  test('Create new series (201 Created)', (done) => {
    axios.post('/series', { name: 'Dreaming Christmas' }).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toHaveProperty('name', 'Dreaming Christmas');
      done();
    }).catch(done);
  });

  test('Create series with missing name (400 Bad Request)', (done) => {
    axios.post('/series', {}).then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(400);
      expect(error.response?.data).toEqual('Series name is required');
      done();
    });
  });
});

describe('Delete series (DELETE)', () => {
  test('Delete existing series (200 OK)', (done) => {
    axios.delete('/series/60').then((response) => {
      expect(response.status).toEqual(200);
      done();
    }).catch(done);
  });

  /*test('Delete non-existing series (404 Not Found)', (done) => {
    axios.delete('/series/999').then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('Series not found');
      done();
    });
  });*/
/*
  test('Delete non-existing series (404 Not Found)', (done) => {
    axios.delete('/series/999').then(() => {
      done(new Error('Request should have failed'));
    }).catch((error) => {
      console.log(error.response?.status); // For å sjekke hvilken status som faktisk returneres
      console.log(error.response?.data);  // For å se hva slags data som returneres
      expect(error.response?.status).toEqual(500);
      expect(error.response?.data).toEqual('Series not found');
      done();
    });
  });
  
*/
