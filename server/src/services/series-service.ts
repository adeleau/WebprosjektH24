import { RowDataPacket } from 'mysql2';
import pool from '../mysql-pool';

export type Series = {
    series_id: number,
    name: string
}

class SeriesService {
    getAll() {
        return new Promise<Array<Series> | Error> ((resolve, reject) => {
            pool.query('select * from series', [], (err, res: RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(res as Array<Series>)
            })
        })
    }
}



export default new SeriesService