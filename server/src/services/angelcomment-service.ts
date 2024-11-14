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
          pool.query('SELECT * FROM Angel_comments WHERE angel_id = ? ORDER BY created_at DESC', 
            [angel_id], 
            (error, results: RowDataPacket[]) => {
              if (error) {
                console.error("Error fetching comments:", error);  
                return reject(new Error('Failed to fetch comments.'));
              } 
            resolve(results as AngelComment[]);
          });
        });
    }
    
    addAngelComment(angel_id: number, user_id: number, content: string): Promise<number> {
      const created_at = new Date(); // Set current time as default for `created_at`
      return new Promise((resolve, reject) => {
          pool.query(
              'INSERT INTO Angel_comments (angel_id, user_id, content, created_at) VALUES (?, ?, ?, ?)',
              [angel_id, user_id, content, format(created_at, 'yyyy-MM-dd HH:mm:ss')],
              (error, results: ResultSetHeader) => {
                  if (error) {
                      console.error("Error adding comment:", error);
                      return reject(new Error('Failed to add comment.'));
                  }
                  resolve(results.insertId);
              }
          );
      });
  }
    /*addAngelComment(angel_id: number, user_id: number, content: string created_at: Date) {
        return new Promise<number>((resolve, reject) => {
          pool.query('INSERT INTO angel_comments SET angel_id=?, user_id=?, content=?, created_at=?', [angel_id, user_id, content, created_at], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            resolve(results.insertId);
          });
        });
    }*/
    
    updateAngelComment(angelcomment_id: number, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE Angel_comments SET content = ?, updated_at = ? WHERE angelcomment_id = ?',
                [content, format(new Date(), 'yyyy-MM-dd HH:mm:ss'), angelcomment_id],
                (error, results: ResultSetHeader) => {
                    if (error) {
                        console.error("Error updating comment:", error);
                        return reject(new Error('Failed to update comment.'));
                    }
                    if (results.affectedRows === 0) {
                        return reject(new Error('No comment found to update.'));
                    }
                    resolve();
                }
            );
        });
    }
  
    deleteAngelComment(angelcomment_id: number): Promise<void> {
      return new Promise((resolve, reject) => {
          pool.query(
              'DELETE FROM Angel_comments WHERE angelcomment_id = ?',
              [angelcomment_id],
              (error, results: ResultSetHeader) => {
                  if (error) {
                      console.error("Error deleting comment:", error);
                      return reject(new Error('Failed to delete comment.'));
                  }
                  if (results.affectedRows === 0) {
                      return reject(new Error('No comment found to delete.'));
                  }
                  resolve();
              }
          );
      });
  }
}

export default new AngelCommentService();
