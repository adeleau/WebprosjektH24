import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';
import { format } from 'date-fns';

export type AngelComment = {
    angelcomment_id: number;
    angel_id: number;
    user_id: number;
    content: string;
    created_at: Date;
}

class AngelCommentService {
    getAngelComments(angel_id: number) {
        return new Promise<AngelComment[]>((resolve, reject) => {
          pool.query('SELECT * FROM angel_comments WHERE angel_id = ?', [angel_id], (error, results: RowDataPacket[]) => {
            if (error) return reject(error);
            resolve(results as AngelComment[]);
          });
        });
    }
    
    addAngelComment(angel_id: number, user_id: number, content: string, created_at: Date) {
        return new Promise<number>((resolve, reject) => {
          pool.query('INSERT INTO angel_comments SET angel_id=?, user_id=?, content=?, created_at=?', [angel_id, user_id, content, created_at], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve(results.insertId);
          });
        });
    }
    
    updateAngelComment(angelcomment: AngelComment) {
    
    }
    
    deleteAngelComment() {
    
    }
}

export default new AngelCommentService();
