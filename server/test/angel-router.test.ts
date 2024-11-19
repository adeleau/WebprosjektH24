import axios from "axios";
import pool from "../src/mysql-pool";
import app from "../src/app";
import angelService, { Angel } from "../src/services/angel-service"

axios.defaults.baseURL = "http://localhost:3005";

let webServer: any;

const testAngels: Angel[] = [
  {
    name: "Test Angel 1",
    description: "Description 1",
    image: "http://example.com/angel1.jpg",
    release_year: 2020,
    views: 5,
    user_id: 1,
    series_id: 1,
  },
  {
    name: "Test Angel 2",
    description: "Description 2",
    image: "http://example.com/angel2.jpg",
    release_year: 2021,
    views: 3,
    user_id: 1,
    series_id: 1,
  },
];

beforeAll((done) => {
  webServer = app.listen(3005, () => done());
});

beforeEach((done) => {
    pool.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
      if (err) return done(err);
  
      // Tabeller som må tømmes
      const tables = [
        "AngelHistory",
        "Angel_comments",
        "Collections",
        "Wishlists",
        "Angels",
        "Users",
        "Series",
      ];
  
      // Slett innhold i alle tabeller
      const truncatePromises = tables.map(
        (table) =>
          new Promise((resolve, reject) => {
            pool.query(`DELETE FROM ${table}`, (error) => {
              if (error) reject(error);
              else resolve(true);
            });
          })
      );
  
      Promise.all(truncatePromises)
        .then(() => {
          pool.query("SET FOREIGN_KEY_CHECKS = 1", (enableErr) => {
            if (enableErr) return done(enableErr);
  
            // Sett inn nødvendige data i Users og Series før Angels
            const user = {
              user_id: 1, // Sørger for riktig bruker-ID
              username: "TestUser",
              email: "test@example.com",
              password_hash: "Passord123",
            };
  
            const series = { series_id: 1, name: "TestSeries" };
  
            const insertUsers = new Promise((resolve, reject) => {
              pool.query(
                `INSERT INTO Users (user_id, username, email, password_hash) 
                 VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 username = VALUES(username), 
                 email = VALUES(email), 
                 password_hash = VALUES(password_hash)`,
                [user.user_id, user.username, user.email, user.password_hash],
                (error) => {
                  if (error) reject(error);
                  else resolve(true);
                }
              );
            });
  
            const insertSeries = new Promise((resolve, reject) => {
              pool.query(
                `INSERT INTO Series (series_id, name) 
                 VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 name = VALUES(name)`,
                [series.series_id, series.name],
                (error) => {
                  if (error) reject(error);
                  else resolve(true);
                }
              );
            });
  
            Promise.all([insertUsers, insertSeries])
              .then(() => {
                const values = testAngels.map((angel) => [
                  angel.name,
                  angel.description,
                  angel.image,
                  angel.release_year,
                  angel.views,
                  angel.user_id,
                  angel.series_id,
                ]);
  
                // Sett inn data i Angels
                pool.query(
                  "INSERT INTO Angels (name, description, image, release_year, views, user_id, series_id) VALUES ?",
                  [values],
                  (error, results) => {
                    if (error) {
                      console.error("Error inserting Angels:", error);
                      done(error);
                    } else {
                      // Cast results to the correct type
                      const result = results as { affectedRows: number };
                      console.log("Inserted rows into Angels:", result.affectedRows);
                      done();
                    }
                  }
                );
              })
              .catch(done);
          });
        })
        .catch(done);
    });
  });
  

afterAll((done) => {
  if (!webServer) return done(new Error("WebServer not running"));
  webServer.close(() => pool.end(() => done()));
});

describe("Angel Router Tests", () => {
  test("Fetch all angels (GET /angels) - 200 OK", (done) => {
    axios
      .get("/angels")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(2);
        expect(response.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
                name: "Test Angel 1",
                description: "Description 1",
                image: "http://example.com/angel1.jpg",
                release_year: 2020,
                views: 5,
                user_id: 1,
                series_id: 1,
              }),
              expect.objectContaining({
                name: "Test Angel 2",
                description: "Description 2",
                image: "http://example.com/angel2.jpg",
                release_year: 2021,
                views: 3,
                user_id: 1,
                series_id: 1,
              }),
            ])
          );
        done();
      })
      .catch(done);
  });

  test("Fetch angel by ID (GET /angels/:angel_id) - 200 OK", (done) => {
    axios
      .get("/angels/1")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(
            expect.objectContaining({
                name: "Test Angel 1",
                description: "Description 1",
                image: "http://example.com/angel1.jpg",
                release_year: 2020,
                views: 5,
                user_id: 1,
                series_id: 1,
            })
        );
        done();
      })
      .catch(done);
  });

  test("Fetch angel by invalid ID (GET /angels/:angel_id) - 400 Bad Request", (done) => {
    axios
      .get("/angels/invalid-id")
      .then(() => done(new Error("Request should have failed")))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Invalid angel ID");
        done();
      });
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
        expect(response.data).toEqual(expect.objectContaining(newAngel));
        done();
      })
      .catch(done);
  });

  test("Create angel with missing fields (POST /angels) - 400 Bad Request", (done) => {
    const incompleteAngel = {
      name: "Incomplete Angel",
      description: "",
    };

    axios
      .post("/angels", incompleteAngel)
      .then(() => done(new Error("Request should have failed")))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual(
          "Missing required fields: name, description, user_id, series_id"
        );
        done();
      });
  });

  test("Update angel (PUT /angels/:angel_id) - 200 OK", (done) => {
    const updatedAngel = { description: 'Updated Description' };

    axios
      .put(`/angels/1`, updatedAngel)
      .then((response) => {
        console.log("UPDATING ANGEL ERROR: " + response.data);
        expect(response.status).toEqual(200);
        expect(response.data.description).toEqual("Updated Description");
      })
      .catch(done);
  });

  test("Delete angel (DELETE /angels/:angel_id) - 200 OK", (done) => {
    axios
      .delete("/angels/1")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ message: "Angel deleted successfully" });
        return axios.get("/angels/1");
      })
      .then(() => done(new Error("Request should have failed")))
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        done();
      });
  });

  test("Increment angel views (PUT /angels/:angel_id/increment-views) - 200 OK", (done) => {
    axios
      .put("/angels/1/increment-views")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.views).toEqual(
            expect.objectContaining({
              views: testAngels[0].views + 1,
            })
          );
          done();
        })
        .catch(done);
    });

  test("Fetch angels by series ID (GET /series/:series_id) - 200 OK", (done) => {
    axios
      .get("/series/1")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(2);
        done();
      })
      .catch(done);
  });

  test("Fetch angel count by series (GET /series/:series_id/count) - 200 OK", (done) => {
    axios
      .get("/series/1/count")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.count).toEqual(2);
        done();
      })
      .catch(done);
  });

  test("Search angels (GET /angels/search/:query) - 200 OK", (done) => {
    axios
      .get("/angels/search/Test")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(2);
        done();
      })
      .catch(done);
  });

  test("Fetch popular angels (GET /popular) - 200 OK", async() => {
    const response = await axios.get("/popular");
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data[0]).toEqual(
        expect.objectContaining({
            name: "Test Angel 1",
            views: 5,
        })
        );
    });

  test("Create angel with invalid data type (POST /angels) - 400 Bad Request", (done) => {
    const invalidAngel = {
      name: "Invalid Angel",
      description: "Description",
      image: "http://example.com/image.jpg",
      release_year: "invalid-year",
      views: 0,
      user_id: 1,
      series_id: 1,
    };

    axios
      .post("/angels", invalidAngel)
      .then(() => done(new Error("Request should have failed")))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Invalid data type for release_year");
        done();
      });
  });

  test("Search angels with no matching results (GET /angels/search/:query) - 200 OK", async () => {
    const response = await axios.get("/angels/search/NonExistentAngel");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });

  test("Fetch popular angels sorted by views (GET /popular) - 200 OK", async () => {
    const response = await axios.get("/popular");
    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data[0].views).toBeGreaterThanOrEqual(response.data[1].views);
  });

  test("Fetch angels by non-existent series ID (GET /series/:series_id) - 200 OK", async () => {
    const response = await axios.get("/series/999");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });
});
