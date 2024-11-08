import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Angel = {
    angel_id: number; 
    name: string;
    description: string;
    image: string;
    release_year: number;
    views: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    series_id: number;
};

export type AngelComment = {
    angelcomment_id: number;
    angel_id: number;
    user_id: number;
    content: string;
    created_at: Date;
}

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
                resolve(results[0] as Angel)
            })
        })
    }

    createAngel(name: string, description: string, image: string, release_year: number, user_id: number, created_at: Date, series_id: number) {
        return new Promise<number>((resolve, reject) => {
            pool.query('INSERT INTO Angels SET name=?, description=?, image=?, release_year=?, user_id=?, created_at=?, series_id=?', [name, description, image, release_year, user_id, created_at, series_id], (error, results: ResultSetHeader) => {
              if (error) return reject(error);
              resolve(results.insertId);
            });
          });
    }

    updateAngel(angel_id: number, name: string, description: string, image: string, release_year: number, updated_at: Date, series_id: number) {
        return new Promise<void>((resolve, reject) => {
          pool.query('UPDATE Angels SET name=?, description=?, image=?, release_year=?, updated_at=?, series_id=? WHERE angel_id=?', [name, description, image, release_year, updated_at, series_id, angel_id], (error, results: ResultSetHeader) => {
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
    
    addAngelComment(angel_id: number, user_id: number, content: string, created_at: Date) {
        return new Promise<number>((resolve, reject) => {
          pool.query('INSERT INTO angel_comments SET angel_id=?, user_id=?, content=?, created_at=?', [angel_id, user_id, content, created_at], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve(results.insertId);
          });
        });
    }
    
    getAngelComments(angel_id: number) {
        return new Promise<AngelComment[]>((resolve, reject) => {
          pool.query('SELECT * FROM angel_comments WHERE angel_id = ?', [angel_id], (error, results: RowDataPacket[]) => {
            if (error) return reject(error);
            resolve(results as AngelComment[]);
          });
        });
    }
}

export default new AngelService();