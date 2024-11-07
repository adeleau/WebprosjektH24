import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Series = {
    series_id: number;
    name: string;
}

class SeriesService {
    getAll() {
        return new Promise<Series[] | Error> ((resolve, reject) => {
            pool.query('select * from series', [], (err, res: RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(res as Series[])
            })
        })
    }
    getById(series_id: number) {
        return new Promise<Series | Error> ((resolve, reject) => {
            pool.query('select * from series where series_id=?', [series_id], (err, res: RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(res[0] as Series)
            })
        })
    }
}

export default new SeriesService;