import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../mysql-pool";

class RegisterService {
  getAllUsers(): Promise<RowDataPacket[]> {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Users", [], (error, results) => {
        if (error) return reject(error);
        resolve(results as RowDataPacket[]);
      });
    });
  }

  getUserById(user_id: number): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Users WHERE user_id = ?",
        [user_id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results[0] || null);
        }
      );
    });
  }

  register(username: string, email: string, password_hash: string): Promise<any> {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Users WHERE username = ? OR email = ?",
        [username, email],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          if (results.length > 0) {
            return reject(new Error("Username or email already in use"));
          }

          pool.query(
            "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, password_hash],
            (err, result: ResultSetHeader) => {
              if (err) return reject(err);
              resolve({ user_id: result.insertId, username, email });
            }
          );
        }
      );
    });
  }

  checkUserExists(username: string, email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) AS count FROM Users WHERE username = ? OR email = ?",
        [username, email],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results[0].count > 0);
        }
      );
    });
  }
}

export default new RegisterService();
