import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Sonny_Angel = {
  angel_id: number;
  collection_id: number;
  name: string;
  image: string;
  description: string;
};

class AngelService {
  /**
   * Get angel with given id.
   */
  get(angel_id: number) {
    return new Promise<Sonny_Angel | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Sonny_Angels WHERE angel_id = ?', [angel_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Sonny_Angel);
      });
    });
  }

  /**
   * Get all angels.
   */
  getAll() {
    return new Promise<Sonny_Angel[]>((resolve, reject) => {
      pool.query('SELECT * FROM Sonny_Angels', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Sonny_Angel[]);
      });
    });
  }
}

const angelService = new AngelService();

export type Collection = {
  collection_id: number;
  series: string;
  reldate: Date;
  description: string;
}

export type CollectionComment = {
  colcom_id: number;
  collection_id: number;
  user_id: number;
  content: string;
  created_at: Date;
};

export type CollectionLike = {
  collike_id: number;
  collection_id: number;
  like_count: number;
};

class CollectionService {
  likeCollection(collection_id: number, user_id: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO CollectionLikes SET collection_id=?, user_id=?', [collection_id, user_id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  getColLikes(collection_id: number) {
    return new Promise<number[]>((resolve, reject) => {
      pool.query('SELECT like_count FROM CollectionLikes WHERE collection_id = ?', [collection_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        const colLikeCount = results[0].like_count;
        resolve(colLikeCount);
      });
    });
  }

  addColComs(collection_id: number, user_id: number, content: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO CollectionComments SET collection_id=?, user_id=?, content=?', [collection_id, user_id, content], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  getColComs(collection_id: number) {
    return new Promise<CollectionComment[]>((resolve, reject) => {
      pool.query('SELECT * FROM CollectionComments WHERE collection_id = ?', [collection_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as CollectionComment[]);
      });
    });
  }
}

const collectionService = new CollectionService();


export type Post = {
  post_id: number;
  user_id: number;
  title: string;
  content: string;
  img: string;
};

export type PostComment = {
  poscom_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
};

export type PostLike = {
  poslike_id: number;
  post_id: number;
  like_count: number;
};

class PostService {
  /**
   * Get post with given id.
   */
  get(post_id: number) {
    return new Promise<Post | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Posts WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
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
  create(user_id: number, title: string, content: string, img: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Posts SET user_id=?, title=?, content=?, img=?', [user_id, title, content, img], (error, results: ResultSetHeader) => {
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
      pool.query('UPDATE Posts SET title=?, content=?, img=? WHERE post_id=?', [title, content, post_id, img], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  likePost(post_id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      pool.query('UPDATE PostLikes SET like_count = like_count + 1 WHERE post_id=?', [post_id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows === 0) return reject(new Error('Post not found'))
        resolve();
      });
    });
  }

  getPosLikes(post_id: number) {
    return new Promise<number[]>((resolve, reject) => {
      pool.query('SELECT like_count FROM PostLikes WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        const posLikeCount = results[0].like_count;
        resolve(posLikeCount);
      });
    });
  }

  addPosCom(post_id: number, user_id: number, content: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO PostComments SET post_id=?, user_id=?, content=?', [post_id, user_id, content], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  getPosComs(post_id: number) {
    return new Promise<PostComment[]>((resolve, reject) => {
      pool.query('SELECT * FROM PostComments WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as PostComment[]);
      });
    });
  }
}

const postService = new PostService();

export default { angelService, collectionService, postService };
