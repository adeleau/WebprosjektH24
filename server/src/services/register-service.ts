import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';
const PORT = 3000;
import RegisterService from './services/register-service';

const router = express.Router();


export type Users = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
};

class RegisterService {
    async checkUserExists(username: string, email: string): Promise<boolean> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM users WHERE username = ? OR email = ?',
                [username, email]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw error;
        }
    }

    async registerUser(username: string, email: string, password_hash: string): Promise<number> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, password_hash]
            );
            return result.insertId; // Returnerer ID-en til den nyopprettede brukeren
        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;
        }
    }
    async getUserById(user_id: number): Promise<User | null> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM users WHERE user_id = ?',
                [user_id]
            );
            if (rows.length > 0) {
                return rows[0] as User;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }
    async getAllUsers(): Promise<User[]> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
            return rows as User[];
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }
}

export default new RegisterService();