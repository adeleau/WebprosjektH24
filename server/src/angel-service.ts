import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Angel = {
  angel_id: number;
  series: string;
  name: string;
  image: string;
  description: string;
};

class AngelService {
  /**
   * Get angel with given id.
   */
  get(angel_id: number) {
    return new Promise<Angel | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Angels WHERE id = ?', [angel_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Angel);
      });
    });
  }

  /**
   * Get all angels.
   */
  getAll() {
    return new Promise<Angel[]>((resolve, reject) => {
      pool.query('SELECT * FROM Angels', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Angel[]);
      });
    });
  }
}

const angelService = new AngelService();

export type Post = {
  post_id: number;
  content: string;
  img: string;
};

class PostService {
  /**
   * Get post with given id.
   */
  get(post_id: number) {
    return new Promise<Post | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Posts WHERE id = ?', [post_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Post);
      });
    });
  }

  /**
   * Get all posts.
   */
  getAll() {
    return new Promise<Post[]>((resolve, reject) => {
      pool.query('SELECT * FROM Posts', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Post[]);
      });
    });
  }
  
  /**
   * Create new post having the given title.
   *
   * Resolves the newly created post id.
   */
  create(title: string, content: string, img: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Posts SET title=?, content=?, img=?', [title, content, img], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  /**
   * Delete post with given id.
   */
  deletePost(post_id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Posts WHERE post_id = ?', [post_id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      });
    });
  }

  updatePost(post_id: number, title: string, content: string, img: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query('UPDATE Posts SET title=?, content=?, img=? WHERE angel_id=?', [title, content, post_id, img], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

const postService = new PostService();

export default { angelService, postService };
