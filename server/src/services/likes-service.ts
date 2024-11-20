import { RowDataPacket } from 'mysql2';
import pool from '../mysql-pool';

export type Like = {
    user_id: number;
    angel_id: number;
};

class LikesService {

    // Get likes (collection) for a specific user
    getUserLikes(user_id: number): Promise<Like[]> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM Collections WHERE user_id = ?', [user_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results as Like[]);
            });
        });
    }

 // Add a like (add to collection)
addLike(userId: number, angelId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO Collections (user_id, angel_id) VALUES (?, ?)',
            [userId, angelId],
            (error) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return reject(error);  
                }
                resolve();
            }
        );
    });
}

    // Remove a like(remove from collection)
    removeLike(user_id: number, angel_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query(
                'DELETE FROM Collections WHERE user_id = ? AND angel_id = ?',
                [user_id, angel_id],
                (error) => {
                    if (error) return reject(error);
                    resolve();
                }
            );
        });
    }
}

export default new LikesService();
