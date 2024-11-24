import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Angel = {
    angel_id?: number; 
    name: string;
    description: string;
    image: string;
    release_year: number;
    views: number;
    user_id: number;
    series_id: number;
    username: string;
};

// for setting up variables and database ref src: 4
export type Angel_History = {
  angelhistory_id:number;
  angel_id?: number;
  description: string;
  user_id: string;
  updated_at?: Date;
};

class AngelService {
    getAll() {
        return new Promise<Angel[] | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Angels', [], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results as Angel[])
            })
        })
    }
    
    get(angel_id: number) {
      return new Promise<Angel>((resolve, reject) => {
        pool.query(
          "SELECT * FROM Angels WHERE angel_id=?",
          [angel_id],
          (error, results: RowDataPacket[]) => {
            if (error) return reject(error);
            if (results.length === 0) return reject(new Error("Angel not found"));
            resolve(results[0] as Angel);
          }
        );
      });
    }
    
    createAngel(angel: Omit<Angel, 'angel_id' | 'created_at' | 'updated_at'>) {
      return new Promise<Angel>((resolve, reject) => {
        const { name, description, image, release_year, views, user_id, series_id } = angel;
          // Validering av description
    if (!description || description.trim() === "") {
      return reject(new Error("Description is required and cannot be empty"));
    }
    //validering av release_year
    if (isNaN(Number(release_year))) {
      return reject(new Error("Invalid release year"));
    }

        pool.query(
          'INSERT INTO Angels (name, description, image, release_year, views, user_id, series_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, description, image, release_year, views, user_id, series_id],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
  
            pool.query(
              'SELECT * FROM Angels WHERE angel_id = ?',
              [results.insertId],
              (selectError, rows: RowDataPacket[]) => {
                if (selectError) return reject(selectError);
                resolve(rows[0] as Angel);
              }
            );
          }
        );
      });
    }

    updateAngel(angel: Angel) {
      return new Promise<void>((resolve, reject) => {
        // Valider input
        if (!angel.angel_id) return reject(new Error("Angel ID is missing."));
        if (!angel.description || angel.description.trim() === "") {
          return reject(new Error("Description is missing or invalid"));
        }
    
        // Hent eksisterende engel for å sammenligne
        this.get(angel.angel_id)
          .then((currentAngel) => {
            if (!currentAngel) {
              return reject(new Error(`Angel with ID ${angel.angel_id} not found.`));
            }
    
            // Logg historikk hvis beskrivelse har endret seg
            if (currentAngel.description !== angel.description) {
              pool.query(
                "INSERT INTO AngelHistory (angel_id, description, user_id, updated_at) VALUES (?, ?, ?, NOW())",
                [angel.angel_id, currentAngel.description, angel.user_id],
                (historyError) => {
                  if (historyError) return reject(historyError);
    
                  // Oppdater engel
                  this.performUpdate(angel, resolve, reject);
                }
              );
            } else {
              // Bare oppdater hvis historikk ikke er nødvendig
              this.performUpdate(angel, resolve, reject);
            }
          })
          .catch(reject);
      });
    }
    
    // Oppdateringslogikk er abstrahert for å unngå repetisjon
    private performUpdate(angel: Angel, resolve: () => void, reject: (error: Error) => void) {
      pool.query(
        "UPDATE Angels SET name = ?, description = ?, image = ?, release_year = ?, series_id = ? WHERE angel_id = ?",
        [angel.name, angel.description, angel.image, angel.release_year, angel.series_id, angel.angel_id],
        (updateError) => {
          if (updateError) return reject(updateError);
          resolve();
        }
      );
    }
    
    updateAngel(angel: Angel) {
      return new Promise<void>((resolve, reject) => {
        
        // get the existing angel from the database
        this.get(angel.angel_id!)
          .then((result) => {
            if (result instanceof Error) {
              return reject(new Error('Failed to fetch existing angel data'));
            }
    
            const currentAngel = result as Angel;
    
  
            //compare the descriptions
            if (currentAngel.description !== angel.description) {
      
              //logg the history if description is different
              pool.query(
                'INSERT INTO AngelHistory (angel_id, description, user_id, updated_at) VALUES (?, ?, ?, NOW())',
                [angel.angel_id, currentAngel.description, angel.user_id],
                (historyError) => {
                  if (historyError) return reject(historyError);
    
                 
                  //Update angel data after logging the history
                  pool.query(
                    'UPDATE Angels SET name=?, description=?, image=?, release_year=?, series_id=? WHERE angel_id=?',
                    [angel.name, angel.description, angel.image, angel.release_year, angel.series_id, angel.angel_id],
                    (updateError) => {
                      if (updateError) return reject(updateError);
                      resolve();
                    }
                  );
                }
              );
            } else {
             
              //if description not changed, update just the angels field
              pool.query(
                'UPDATE Angels SET name=?, description=?, image=?, release_year=?, series_id=? WHERE angel_id=?',
                [angel.name, angel.description, angel.image, angel.release_year, angel.series_id, angel.angel_id],
                (updateError) => {
                  if (updateError) return reject(updateError);
                  resolve();
                }
              );
            }
          })
          .catch((error) => reject(error));
      });
    }

  // Increment views for an angel
  incrementViews(angelId: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Angels SET views = views + 1 WHERE angel_id = ?',
        [angelId],
        (err, results) => {
          if (err) return reject(err);

          this.get(angelId)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }


deleteAngel(angelId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err);
  
        connection.beginTransaction((transactionErr) => {
          if (transactionErr) {
            connection.release();
            return reject(transactionErr);
          }
  
          // Queries to delete related records
          const deleteComments = `DELETE FROM Angel_comments WHERE angel_id = ?`;
          const deleteWishlists = `DELETE FROM Wishlists WHERE angel_id = ?`;
          const deleteCollections = `DELETE FROM Collections WHERE angel_id = ?`;
          const deleteAngelHistory = `DELETE FROM AngelHistory WHERE angel_id = ?`;
  
          // delete Angel Comments
          connection.query(deleteComments, [angelId], (error) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                reject(error);
              });
            }
  
            // delete Wishlists
            connection.query(deleteWishlists, [angelId], (error) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  reject(error);
                });
              }
  
              // delete Collections
              connection.query(deleteCollections, [angelId], (error) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release();
                    reject(error);
                  });
                }
  
                // delete Angel History
                connection.query(deleteAngelHistory, [angelId], (error) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(error);
                    });
                  }
                    
                  // finally, delete the Angel itself
                  const deleteAngelQuery = `DELETE FROM Angels WHERE angel_id = ?`;
                  connection.query(deleteAngelQuery, [angelId], (error) => {
                    if (error) {
                      return connection.rollback(() => {
                        connection.release();
                        reject(error);
                      });
                    }
  
                    // Commit the transaction
                    connection.commit((commitErr) => {
                      connection.release();
                      if (commitErr) {
                        return reject(commitErr);
                      }
                      resolve();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  
  //Ref src:4,5,8
    //legger til engel historikk
    getAngelHistory(angel_id: number) {
      return new Promise<Angel_History[]>((resolve, reject) => {
        pool.query(
          'SELECT angelhistory_id, angel_id, description, user_id, updated_at FROM AngelHistory WHERE angel_id = ? ORDER BY updated_at DESC',
          [angel_id],
          (error, results: RowDataPacket[]) => {
            if (error) return reject(error);
            resolve(results as Angel_History[]);
          }
        );
      });
    }

    // Log history
    logAngelHistory(angel_id: number, description: string, user_id: number) {
      return new Promise((resolve, reject) => {
        pool.query(
          "INSERT INTO AngelHistory (angel_id, description, user_id) VALUES (?, ?, ?)",
          [angel_id, description, user_id],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            pool.query(
              "SELECT * FROM AngelHistory WHERE angelhistory_id = ?",
              [results.insertId],
              (selectError, rows: RowDataPacket[]) => {
                if (selectError) return reject(selectError);
                resolve(rows[0] as Angel_History);
              }
            );
          }
        );
      });
    }

    //søkefelt
    search(query: string): Promise<Angel[]> {
        return new Promise<Angel[]>((resolve, reject) => {
          pool.query(
            'SELECT A.*, S.name as series_name FROM Angels A JOIN Series S ON A.series_id = S.series_id WHERE A.name LIKE ? OR A.description LIKE ? OR S.name LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`], 
            (error, results: RowDataPacket[]) => {
              if (error) {
                console.error('Error fetching search results:', error);
                return reject(error);
              }
              resolve(results as Angel[]);
            }
          );
        });
      }

    // get angels by series_id
    getBySeries(series_id: number): Promise<Angel[]> {
      return new Promise<Angel[]>((resolve, reject) => {
        pool.query(
        'SELECT * FROM Angels WHERE series_id = ?', 
        [series_id], 
        (error, results) => {
            if (error) {
            console.error(`Error fetching angels for series_id ${series_id}:`, error);
            return reject(error);
            }
            resolve(results as Angel[]);
        }
        );
      });
    }

    //get angel count by series_id
    getAngelCount(series_id: number): Promise<number> {
      return new Promise<number>((resolve, reject) => {
        pool.query(
          'SELECT COUNT(*) as count FROM Angels WHERE series_id =?', [series_id], 
          (error, results: RowDataPacket[]) => {
            if (error) {
              console.error(`Error counting angels for series_id ${series_id}: `, error);
              return reject(error);
            }
            resolve(results[0].count);
          }
        )
      })
    }

    getPopular(): Promise<Angel[]> {
      return new Promise<Angel[]>((resolve, reject) => {
        pool.query(
          "SELECT * FROM Angels ORDER BY views DESC LIMIT 10",
          (error, results: RowDataPacket[]) => {
            if (error) {
              console.error("Error fetching popular angels:", error);
              return reject(error);
            }
            resolve(results as Angel[]);
          }
        );
      });
    }


    // temporary to view usernames
    getUsername(angel_id: number) {
        return new Promise<string | Error> ((resolve, reject) => {
            pool.query('SELECT username FROM Users JOIN Angels ON Users.user_id = Angels.user.id WHERE Angels.angel_id=?', [angel_id], (error, results: RowDataPacket[]) => {
                error ? reject(error) : resolve(results[0].username as string)
            }
            )
        })
    }

    getCreatedAt(angel_id: number) {
      return new Promise<string | Error> ((resolve, reject) => {
        pool.query('SELECT created_at FROM Angels WHERE angel_id=?', [angel_id], (error, results: RowDataPacket[]) => {
          if (error) {
            console.error(`Error fetching created timestamp`, error);
            return reject(error);
            }
            if (results.length === 0 || !results[0].created_at) {
              return reject(new Error('Angel not found'))
            }
            resolve(results[0].created_at as string);
        })
      })
    }

    getUpdatedAt(angel_id: number) {
      return new Promise<string | Error> ((resolve, reject) => {
        pool.query('SELECT updated_at FROM Angels WHERE angel_id=?', [angel_id], (error, results: RowDataPacket[]) => {
          if (error) {
            console.error(`Error fetching updated timestamp`, error);
            return reject(error);
            }
            if (results.length === 0) {
              return reject(new Error('Angel not found'))
            }
            resolve(results[0].updated_at as string);
        })
      })
    }
}

export default new AngelService();
