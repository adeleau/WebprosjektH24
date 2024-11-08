import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Series = {
    series_id: number;
    name: string;
}

class SeriesService {
    // trenger vi????
    // getAll() {
    //     return new Promise<Series[] | Error> ((resolve, reject) => {
    //         pool.query('SELECT * FROM Series', [], (error, results: RowDataPacket[]) => {
    //             if (error) return reject(error);
    //             resolve(results as Series[])
    //         })
    //     })
    // }
    get(name: string) {
        return new Promise<Series | Error> ((resolve, reject) => {
            pool.query('SELECT * FROM Series WHERE name=?', [name], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results[0] as Series)
            })
        })
    }
}

export default new SeriesService;