import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';
import { format } from 'date-fns';

export type Angel = {
    angel_id?: number; 
    name: string;
    description: string;
    image: string;
    release_year: number;
    views: number;
    user_id: number;
    // created_at: string;
    // updated_at?: string;
    series_id: number;
    user_name: string;
};

export type AngelHistory = {
  angel_id?: number;
  description: string;
  user_id: string;
  updated_at?: Date;
};

export type AngelCardProps = {
    angel: Angel;
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
        return new Promise<Angel | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Angels WHERE angel_id=?', [angel_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                let tempAngel: Angel = results[0] as Angel;
                // tempAngel.updated_at = format(tempAngel.updated_at, 'dd/MM/yyyy HH:mm:ss') as string;
                // tempAngel.created_at = format(tempAngel.created_at, 'dd/MM/yyyy HH:mm:ss') as string;
                resolve(tempAngel)
            })
        })
    }

    createAngel(angel: Omit<Angel, 'angel_id' | 'created_at' | 'updated_at'>) {
      return new Promise<Angel>((resolve, reject) => {
        const { name, description, image, release_year, views, user_id, series_id } = angel;
  
        pool.query(
          'INSERT INTO Angels (name, description, image, release_year, views, user_id, series_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, description, image, release_year, views, user_id, series_id],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
  
            // Retrieve the created record with `created_at` and `updated_at`
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
        // Log the current state to AngelHistory
        pool.query(
          'INSERT INTO AngelHistory (angel_id, description, user_id, updated_at) VALUES (?, ?, ?, NOW())',
          [angel.angel_id, angel.description, angel.user_id],
          (error) => {
            if (error) return reject(error);
    
            // Update the angel
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

          // Fetch updated angel data
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
          const deleteAngelTags = `DELETE FROM Angel_tags WHERE angel_id = ?`;
          const deleteAngelHistory = `DELETE FROM AngelHistory WHERE angel_id = ?`;
  
          // Delete Angel Comments
          connection.query(deleteComments, [angelId], (error) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                reject(error);
              });
            }
  
            // Delete Wishlists
            connection.query(deleteWishlists, [angelId], (error) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  reject(error);
                });
              }
  
              // Delete Collections
              connection.query(deleteCollections, [angelId], (error) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release();
                    reject(error);
                  });
                }
  
                // Delete Angel Tags
                connection.query(deleteAngelTags, [angelId], (error) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(error);
                    });
                  }
  
                  // Delete Angel History
                  connection.query(deleteAngelHistory, [angelId], (error) => {
                    if (error) {
                      return connection.rollback(() => {
                        connection.release();
                        reject(error);
                      });
                    }
  
                    // Finally, delete the Angel itself
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
    });
  }
  
  
    

    //legger til engel historikk
    getAngelHistory(angel_id: number) {
      return new Promise<AngelHistory[]>((resolve, reject) => {
        pool.query(
          'SELECT * FROM AngelHistory WHERE angel_id = ? ORDER BY updated_at DESC',
          [angel_id],
          (error, results) => {
            if (error) return reject(error);
            resolve(results as AngelHistory[]); // Returner historikken som en liste
          }
        );
      });
    }

    // Log history
    logHistory(angel_id: number, description: string, user_id: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        pool.query(
          'INSERT INTO AngelHistory (angel_id, description, user_id, updated_at) VALUES (?, ?, ?, ?)', //hva med resten? skal ikke alt kunne oppdateres, vet ikke om denne funker da
          [angel_id, description, user_id],
          (error) => {
            if (error) return reject(error);
            resolve();
          }
        )
      })
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

    // likeAngel(angel_id: number, user_id: number) {
    //     return new Promise<number>((resolve, reject) => {
    //       pool.query('INSERT INTO AngelLikes SET angel_id=?, user_id=?', [angel_id, user_id], (error, results: ResultSetHeader) => {
    //         if (error) return reject(error);
    
    //         resolve(results.insertId);
    //       });
    //     });
    // }
    
    // getAngelLikes(angel_id: number) {
    //     return new Promise<number[]>((resolve, reject) => {
    //       pool.query('SELECT like_count FROM AngelLikes WHERE angel_id = ?', [angel_id], (error, results: RowDataPacket[]) => {
    //         if (error) return reject(error);
    //         const angelLikeCount = results[0].like_count;
    //         resolve(angelLikeCount);
    //       });
    //     });
    // }

    //midlertidig for å se brukernavn
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
