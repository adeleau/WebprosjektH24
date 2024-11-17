import { RowDataPacket } from 'mysql2';
import pool from '../mysql-pool';

export type WishlistItem = {
    user_id: number;
    angel_id: number;
};

class WishlistService {

    // Get wishlist for a specific user
    getUserWishlist(user_id: number): Promise<WishlistItem[]> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM Wishlists WHERE user_id = ?', [user_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results as WishlistItem[]);
            });
        });
    }

    // Add an item to the wishlist
    addWishlistItem(userId: number, angelId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('Inserting into Wishlist table with:', [userId, angelId]);
            pool.query(
                'INSERT INTO Wishlists (user_id, angel_id) VALUES (?, ?)',
                [userId, angelId],
                (error) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        return reject(error);  // Log the error if any
                    }
                    resolve();
                }
            );
        });
    }

    // Remove an item from the wishlist
    removeWishlistItem(user_id: number, angel_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query(
                'DELETE FROM Wishlists WHERE user_id = ? AND angel_id = ?',
                [user_id, angel_id],
                (error) => {
                    if (error) return reject(error);
                    resolve();
                }
            );
        });
    }
}

export default new WishlistService();