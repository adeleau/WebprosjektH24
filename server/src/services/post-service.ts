import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../mysql-pool';

export type Post = {
    post_id: number;
    user_id: number;
    title: string;
    username: string;
    content: string;
    image: string;
    created_at: Date;
    updated_at: Date;
  };

class PostService {
    getAll() {
        return new Promise<Post[]>((resolve, reject) => {
          pool.query(
            'SELECT Posts.*, Users.username FROM Posts INNER JOIN Users ON Posts.user_id = Users.user_id',
            [],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);
              resolve(results as Post[]);
            }
          );
        });
      }

      // get specific post
      get(post_id: number) {
        return new Promise<Post>((resolve, reject) => {
          pool.query(
            'SELECT Posts.*, Users.username FROM Posts INNER JOIN Users ON Posts.user_id = Users.user_id WHERE post_id = ?',
            [post_id],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);
              resolve(results[0] as Post);
            }
          );
        });
      }

      //post post
      createPost(user_id: number, username: string, title: string, content: string, image: string) {
        return new Promise<number>((resolve, reject) => {
          pool.query(
            'INSERT INTO Posts (user_id, title, content, image) VALUES (?, ?, ?, ?)',
            [user_id, title, content, image],
            (error, results: ResultSetHeader) => {
              if (error) {
                console.error('Database error:', error.message);
                return reject(error);
              }
              resolve(results.insertId);
            }
          );
        });
      }
      
      //update post
      updatePost(post_id: number, title: string, content: string, image: string) {
        return new Promise((resolve, reject) => {
      
          pool.query(
            'UPDATE Posts SET title = ?, content = ?, image = ? WHERE post_id = ?',
            [title, content, image, post_id], 
            (error) => {
              if (error) {
                console.error('Database Query Error:', error.message);
                return reject(error);
              }
              resolve(undefined);
            }
          );
        });
      }
      
      
    // delete posts
      deletePost(post_id: number) {
        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE FROM Posts WHERE post_id = ?', [post_id], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows === 0) return reject(new Error('No row deleted'));
            resolve();
          });
        });
      }
    }

export default new PostService();