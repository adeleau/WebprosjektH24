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

// Explenation of method of choice is found in the ReadMe file
beforeEach(async () => {
  await pool.promise().query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.promise().query('DELETE FROM Series');
  await pool.promise().query('SET FOREIGN_KEY_CHECKS = 1');

  const insertQuery = 'INSERT INTO Series (series_id, name) VALUES ?';
  const values = testSeries.map((series) => [series.series_id, series.name]);

  await pool.promise().query(insertQuery, [values]);
});

afterAll(async () => {
  if (webServer) {
    await webServer.close();
  }
  await pool.end();
});

describe('Series Router Tests', () => {
  test('Fetch all series (200 OK)', async () => {
    const response = await axios.get('/series');
    expect(response.status).toEqual(200);

    const sortedTestSeries = testSeries.sort((a, b) => a.series_id - b.series_id);
    const sortedResponse = response.data.sort((a: Series, b: Series) => a.series_id - b.series_id);

    expect(sortedResponse).toEqual(sortedTestSeries);
  });

  // Fetch series by ID
  test('Fetch series by ID (200 OK)', async () => {
    const response = await axios.get('/series/name/60');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testSeries[0].name);
  });

  // Fetch series by ID
  test('Fetch series by ID (404 Not Found)', async () => {
    try {
      await axios.get('/series/name/999');
    } catch (error: any) {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('Series not found');
    }
  });

  // Create new series
  test('Create new series (201 Created)', async () => {
    const response = await axios.post('/series', { name: 'Dreaming Christmas' });
    expect(response.status).toEqual(201);
    expect(response.data).toHaveProperty('name', 'Dreaming Christmas');
  });

  // Create series with missing name
  test('Create series with missing name (400 Bad Request)', async () => {
    try {
      await axios.post('/series', {});
    } catch (error: any) {
      expect(error.response?.status).toEqual(400);
      expect(error.response?.data).toEqual('Series name is required');
    }
  });

  // Deleting existing series
  test('Delete existing series (200 OK)', async () => {
    const response = await axios.delete('/series/60');
    expect(response.status).toEqual(200);
  });

  // Deleting non-existing users
  test('Delete non-existing series (404 Not Found)', async () => {
    try {
      await axios.delete('/series/999');
    } catch (error: any) {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('Series not found');
    }
  });
});


// import axios from 'axios';
// import pool from '../src/mysql-pool';
// import app from '../src/app';
// import seriesService, { Series } from '../src/services/series-service';

// const testSeries: Series[] = [
//   { series_id: 60, name: 'Marine Series' },
//   { series_id: 61, name: 'Animal Series' },
//   { series_id: 62, name: 'Christmas series' },
// ];

// axios.defaults.baseURL = 'http://localhost:3002';

// let webServer: any;

// // Set Jest timeout to 30 seconds
// jest.setTimeout(60000);

// beforeAll((done) => {
//   webServer = app.listen(3002, () => done());
// });

// // Explenation of method of choice is found in the ReadMe file
// beforeEach(async () => {
//   await pool.promise().query('SET FOREIGN_KEY_CHECKS = 0');
//   await pool.promise().query('DELETE FROM Series');
//   await pool.promise().query('SET FOREIGN_KEY_CHECKS = 1');

//   const insertQuery = 'INSERT INTO Series (series_id, name) VALUES ?';
//   const values = testSeries.map((series) => [series.series_id, series.name]);

//   await pool.promise().query(insertQuery, [values]);
// });

// afterAll(async () => {
//   if (webServer) {
//     await webServer.close();
//   }
//   await pool.end();
// });

// describe('Series Router Tests', () => {
//   test('Fetch all series (200 OK)', async () => {
//     const response = await axios.get('/series');
//     expect(response.status).toEqual(200);

//     const sortedTestSeries = testSeries.sort((a, b) => a.series_id - b.series_id);
//     const sortedResponse = response.data.sort((a: Series, b: Series) => a.series_id - b.series_id);

//     expect(sortedResponse).toEqual(sortedTestSeries);
//   });

//   // Fetch series by ID
//   test('Fetch series by ID (200 OK)', async () => {
//     const response = await axios.get('/series/name/60');
//     expect(response.status).toEqual(200);
//     expect(response.data).toEqual(testSeries[0].name);
//   });

//   // Fetch series by ID
//   test('Fetch series by ID (404 Not Found)', async () => {
//     try {
//       await axios.get('/series/name/999');
//     } catch (error: any) {
//       expect(error.response?.status).toEqual(404);
//       expect(error.response?.data).toEqual('Series not found');
//     }
//   });

//   // Create new series
//   test('Create new series (201 Created)', async () => {
//     const response = await axios.post('/series', { name: 'Dreaming Christmas' });
//     expect(response.status).toEqual(201);
//     expect(response.data).toHaveProperty('name', 'Dreaming Christmas');
//   });

//   // Create series with missing name
//   test('Create series with missing name (400 Bad Request)', async () => {
//     try {
//       await axios.post('/series', {});
//     } catch (error: any) {
//       expect(error.response?.status).toEqual(400);
//       expect(error.response?.data).toEqual('Series name is required');
//     }
//   });

//   // Deleting existing series
//   test('Delete existing series (200 OK)', async () => {
//     const response = await axios.delete('/series/60');
//     expect(response.status).toEqual(200);
//   });

//   // Deleting non-existing users
//   test('Delete non-existing series (404 Not Found)', async () => {
//     try {
//       await axios.delete('/series/999');
//     } catch (error: any) {
//       expect(error.response?.status).toEqual(404);
//       expect(error.response?.data).toEqual('Series not found');
//     }
//   });
// });
