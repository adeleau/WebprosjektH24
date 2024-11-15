import { RowDataPacket } from 'mysql2';
import pool from '../mysql-pool';

export type User = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
};

class LoginService {
    // Find user by username
    async getUserByUsername(username: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM Users WHERE username = ?', [username], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                if (results.length === 0) return resolve(null); // Return null if no user found
                resolve(results[0] as User);
            });
        });
    }

    // Validate password
    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const bcrypt = require('bcrypt');
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default new LoginService();
