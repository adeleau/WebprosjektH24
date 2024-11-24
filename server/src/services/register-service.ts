import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Users = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string; // Endret til string for å reflektere normalisert datoformat
    bio?: string | null;
    profile_picture?: string | null;
    role?: string | null;
   
};

class RegisterService {
    //henter alle brukere
    // Hjelpefunksjon for normalisering av dato
    private normalizeDate(date: Date): string {
        return new Date(date).toISOString().split('.')[0];
    }
    getAllUsers(): Promise<Users[]| Error> {

        return new Promise<Users[] | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Users', [], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);

                const users = (results as Users[]).map((user) => ({
                    ...user,
                    created_at: this.normalizeDate(user.created_at as unknown as Date),
                }));


                resolve(results as Users[])
            });
            
        });
    }
//Get user with ID
    getUserById(user_id: number) {
        return new Promise<Users | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Users WHERE user_id=?', [user_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results[0] as Users);
            })
        })
    }
//register user
    registerUser(username: string, email:string, password_hash:string) {
        return new Promise<number>((resolve, reject) => {
            pool.query('INSERT INTO Users SET username=?, email=?, password_hash=?', [username, email, password_hash], (error, results: ResultSetHeader) => {
                if (error) return reject(error);
                resolve(results.insertId);
            });
        });
    }
//registrering
register(username: string, email: string, password_hash: string): Promise<Users | Error> {
    return new Promise<Users | Error>((resolve, reject) => {
        pool.query('SELECT * FROM Users WHERE username=? OR email=?', [username, email], (error, results: RowDataPacket[]) => {
            if (error) return reject(error);

            if (results.length > 0) {
                return reject(new Error("Username or email already in use"));
            }

            pool.query('INSERT INTO Users (username, email, password_hash) VALUES (?,?,?)', [username, email, password_hash], (error, results: ResultSetHeader) => {
                if (error) return reject(error);

                pool.query('SELECT * FROM Users WHERE user_id = ?', [results.insertId], (error, results: RowDataPacket[]) => {
                    if (error) return reject(error);

                    const user = {
                        ...results[0],
                        created_at: this.normalizeDate(results[0].created_at as unknown as Date),
                    };
                    resolve(user as Users);
                });
            });
        });
    });
}

    checkUserExists(username:string, email:string): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            pool.query('SELECT COUNT(*) AS count FROM Users WHERE username = ? OR email = ?',
            [username, email],
            (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                const userExists = results[0].count > 0;
                resolve(userExists);
                }
            );
        });
    };
};


export default new RegisterService();
    
