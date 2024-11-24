// src/services/user-service.ts
import { RowDataPacket } from 'mysql2';
import pool from '../mysql-pool';

export type User = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    role: string;
    bio: string;
    profile_picture: string; 
};

class UserService {

    // Get all users
    getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            console.log('Executing query: SELECT * FROM Users');
            pool.query('SELECT * FROM Users', (error, results) => {
                if (error) {
                    console.error('Database query error:', error);
                    return reject(error);
                }
                console.log('Query results:', results);
                resolve(results as User[]);
            });
        });
    }
    
    // Get user by ID
    getById(user_id: number) {
        return new Promise<User | null>((resolve, reject) => {
            pool.query('SELECT * FROM Users WHERE user_id=?', [user_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                if (results.length === 0) return resolve(null);
                const user = results[0] as User;
                if (user.profile_picture) {
                    // Convert BLOB to base64 for frontend compatibility
                    user.profile_picture = user.profile_picture.toString();
                }
                resolve(user);
            });
        });
    }

    getByUsername(username: string) {
        return new Promise<User | null>((resolve, reject) => {
            pool.query('SELECT * FROM Users WHERE username=?', [username], (error, results: RowDataPacket[]) => {
                if (error) return reject("Shit's fucked");
                if (results.length === 0) return resolve(null);
                resolve(results[0] as User);
            });
        });
    }

    // Update user details
    updateUser(user_id: number, user: Partial<User>): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE Users SET ? WHERE user_id = ?', [user, user_id], (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }
    
    // Update user profile picture
    updateProfilePicture(user_id: number, profilePicture: Buffer) {
        return new Promise<void>((resolve, reject) => {
            pool.query('UPDATE Users SET profile_picture = ? WHERE user_id = ?', [profilePicture, user_id], (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    
    login(userData: {username: string, password: string}): Promise<boolean> {
        return new Promise<boolean> ((res, rej) => {
            pool.query("SELECT * FROM Users WHERE username = ? AND password_hash = ?", [userData.username, userData.password], (err, result: RowDataPacket[]) => {
                if (err) {
                    return rej(err);
                }
                if (result.length === 1) {
                    return res(true);
                }
                res(false);
            })
        })
    }
}

export default new UserService();
