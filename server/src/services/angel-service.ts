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
    created_at: string;
    updated_at?: string;
    series_id: number;
    user_name: string; 
};

//AngelLike

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
                tempAngel.updated_at = format(tempAngel.updated_at, 'dd/MM/yyyy HH:mm:ss') as string;
                tempAngel.created_at = format(tempAngel.created_at, 'dd/MM/yyyy HH:mm:ss') as string;
                resolve(tempAngel)
            })
        })
    }
//name: string, description: string, image: string, release_year: number, user_id: number, created_at: Date, series_id: number
    createAngel(angel: Angel) {
        return new Promise<number>((resolve, reject) => {
            pool.query('INSERT INTO Angels SET name=?, description=?, image=?, release_year=?, user_id=?, created_at=?, series_id=?', [angel.name, angel.description, angel.image, angel.release_year, angel.user_id, angel.created_at, angel.series_id], (error, results: ResultSetHeader) => {
              if (error) return reject(error);
              resolve(results.insertId);
            });
          });
    }

    updateAngel(angel: Angel) {
        return new Promise<void>((resolve, reject) => {
          pool.query('UPDATE Angels SET name=?, description=?, image=?, release_year=?, updated_at=?, series_id=?, views=? WHERE angel_id=?', [angel.name, angel.description, angel.image, angel.release_year, angel.updated_at, angel.series_id,angel.views, angel.angel_id], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve();
          });
        });
    }

    deleteAngel(angel_id: number) {
        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE FROM Angels WHERE angel_id = ?', [angel_id], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows == 0) return reject(new Error('No row deleted'));
            resolve();
          });
        });
    }

    //søkeflet
    search(query: string): Promise<Angel[]> {
        return new Promise<Angel[]>((resolve, reject) => {
          pool.query(
            'SELECT * FROM Angels WHERE name LIKE ? OR description LIKE ?',
            [`%${query}%`, `%${query}%`], 
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
    //Søkfelt

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
}

export default new AngelService();
