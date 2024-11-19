import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import angelService, {Angel} from '../src/services/angel-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3005';

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3005, () => done());
});

const testAngels = [
    {
      angel_id: 1,
      name: "Test Angel 1",
      description: "Description 1",
      image: "http://example.com/angel1.jpg",
      release_year: 2020,
      views: 5,
      user_id: 1,
      series_id: 1,
      valid_from: new Date().toISOString(),
      valid_to: "9999-12-31 23:59:59",
    },
    {
      angel_id: 2,
      name: "Test Angel 2",
      description: "Description 2",
      image: "http://example.com/angel2.jpg",
      release_year: 2021,
      views: 3,
      user_id: 1,
      series_id: 1,
      valid_from: new Date().toISOString(),
      valid_to: "9999-12-31 23:59:59",
    },
  ];
  
  // Adjust the test cases to account for `valid_from` and `valid_to`
  describe("Angel Router Tests", () => {
    test("Fetch all angels (GET /angels) - 200 OK", (done) => {
      axios
        .get("/angels")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.data.length).toEqual(2);
          expect(response.data).toEqual(
            expect.arrayContaining([
              {
                ...testAngels[0],
                valid_from: expect.any(String),
                valid_to: expect.any(String),
              },
              {
                ...testAngels[1],
                valid_from: expect.any(String),
                valid_to: expect.any(String),
              },
            ])
          );
          done();
        })
        .catch(done);
    });
  
    test("Create a new angel (POST /angels) - 201 Created", (done) => {
      const newAngel = {
        name: "New Angel",
        description: "New Description",
        image: "http://example.com/newangel.jpg",
        release_year: 2022,
        views: 0,
        user_id: 1,
        series_id: 1,
      };
  
      axios
        .post("/angels", newAngel)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.data).toHaveProperty("angel_id");
          expect(response.data.name).toEqual(newAngel.name);
          expect(response.data.valid_from).toEqual(expect.any(String));
          expect(response.data.valid_to).toEqual("9999-12-31 23:59:59");
          done();
        })
        .catch(done);
    });
  
    test("Update angel validity (PUT /angels/:angel_id) - 200 OK", (done) => {
      const updatedAngel = { ...testAngels[0], valid_to: new Date().toISOString() };
  
      axios
        .put(`/angels/1`, updatedAngel)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual("Angel updated successfully");
          done();
        })
        .catch(done);
    });
  
    test("Fetch angels by series ID (GET /series/:series_id) - 200 OK", (done) => {
      axios
        .get("/series/1")
        .then((response) => {
          expect(response.status).toEqual(200);
          response.data.forEach((angel) => {
            expect(angel.valid_from).toEqual(expect.any(String));
            expect(angel.valid_to).toEqual("9999-12-31 23:59:59");
          });
          done();
        })
        .catch(done);
    });
  
    test("Delete angel (DELETE /angels/:angel_id) - 200 OK", (done) => {
      axios
        .delete(`/angels/1`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual("Angel deleted successfully");
          done();
        })
        .catch(done);
    });
  
    test("Increment angel views (PUT /angels/:angel_id/increment-views) - 200 OK", (done) => {
      axios
        .put("/angels/1/increment-views")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.data.views).toBe(testAngels[0].views + 1);
          done();
        })
        .catch(done);
    });
  });
  
