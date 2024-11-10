import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Series = {
    series_id: number;
    name: string;
}

class SeriesService {
    getAll() {
        return new Promise<Series[] | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Series', [], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results as Series[])
            })
        })
    }
    get(name: string) {
        return new Promise<Series | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Series WHERE name=?', [name], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results[0] as Series)
            })
        })
    }

    getName(id: number) {
        return new Promise<string | Error> ((resolve, reject) => {
            pool.query('SELECT name FROM Series WHERE series_id=?', [id], (error, results: RowDataPacket[]) => {
                error ? reject(error) : resolve(results[0].name as string)
            }
            )
        })
    }

    


}

export default new SeriesService;