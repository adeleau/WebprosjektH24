// import axios from 'axios';
// import pool from '../src/mysql-pool';
// import app from '../src/app';
// import angelService, { Angel } from '../src/angel-service';

// const testAngels: Angel[] = [
//   { id: 1, title: 'Les leksjon', done: false, description: 'PPT 1 og 2' },
//   { id: 2, title: 'Møt opp på forelesning', done: false, description: 'Uke 34' },
//   { id: 3, title: 'Gjør øving', done: false, description: 'Øving 2' },
// ];

// // Since API is not compatible with v1, API version is increased to v2
// axios.defaults.baseURL = 'http://localhost:3001/api/v2';

// let webServer: any;
// beforeAll((done) => {
//   // Use separate port for testing
//   webServer = app.listen(3001, () => done());
// });

// beforeEach((done) => {
//   // Delete all angels, and reset id auto-increment start value
//   pool.query('TRUNCATE TABLE Angels', (error) => {
//     if (error) return done(error);

//     // Create testAngels sequentially in order to set correct id, and call done() when finished
//     angelService
//       .create(testAngels[0].title, testAngels[0].description)
//       .then(() => angelService.create(testAngels[1].title, testAngels[1].description)) // Create testAngel[1] after testAngel[0] has been created
//       .then(() => angelService.create(testAngels[2].title, testAngels[2].description)) // Create testAngel[2] after testAngel[1] has been created
//       .then(() => done()); // Call done() after testAngel[2] has been created
//   });
// });

// // Stop web server and close connection to MySQL server
// afterAll((done) => {
//   if (!webServer) return done(new Error());
//   webServer.close(() => pool.end(() => done()));
// });

// describe('Fetch angels (GET)', () => {
//   test('Fetch all angels (200 OK)', (done) => {
//     axios.get('/angels').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual(testAngels);
//       done();
//     });
//   });

//   test('Fetch angel (200 OK)', (done) => {
//     axios.get('/angels/1').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual(testAngels[0]);
//       done();
//     });
//   });

//   test('Fetch angel (404 Not Found)', (done) => {
//     axios
//       .get('/angels/4')
//       .then((_response) => done(new Error()))
//       .catch((error) => {
//         expect(error.message).toEqual('Request failed with status code 404');
//         done();
//       });
//   });
// });

// describe('Create new angel (POST)', () => {
//   test('Create new angel (200 OK)', (done) => {
//     axios.post('/angels', { title: 'Ny oppgave', description: 'Ny oppgave' }).then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual({ id: 4 });
//       done();
//     });
//   });
// });

// describe('Delete angel (DELETE)', () => {
//   test('Delete angel (200 OK)', (done) => {
//     axios.delete('/angels/2').then((response) => {
//       expect(response.status).toEqual(200);
//       done();
//     });
//   });
// });

// describe('Update angel (PUT)', () => {
//   test('Update angel (200 OK)', (done) => {
//     axios
//       .put('/angels/1', {
//         title: 'Oppdatert tittel',
//         done: true,
//         description: 'Oppdatert beskrivelse',
//       })
//       .then((response) => {
//         expect(response.status).toEqual(200);
//         done();
//       });
//   });
// });

// // for å få mer dekning: feilmelding på create (x 400 bad request - oppgave uten tittel), delete (x 404 not found - ikke-eksisterende oppgave) og update (x 400 bad request - uten tittel)
