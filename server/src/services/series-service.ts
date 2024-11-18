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

    getName(id: number) {
        return new Promise<string | Error> ((resolve, reject) => {
            pool.query('SELECT name FROM Series WHERE series_id=?', 
            [id], 
            (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                if (results.length === 0) return reject(new Error('Series not found'));
                resolve(results[0].name as string)
            }
          )
        })
    }

  // Add a new series (new method)
  createSeries(series: { name: string }) {
    return new Promise<Series>((resolve, reject) => {
      pool.query(
        'INSERT INTO Series (name) VALUES (?)',
        [series.name],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve({ series_id: results.insertId, name: series.name });
        }
      );
    });
  }


  deleteSeries(seriesId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Series WHERE series_id = ?',
        [seriesId],
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

}

export default new SeriesService;