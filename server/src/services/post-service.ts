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
  
  export type PostComment = {
    postcomment_id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: Date;
  };
  
//   export type PostLike = {
//     poslike_id: number;
//     post_id: number;
//     like_count: number;
//   };

export type PostCardProps = {
    post: Post;
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
      
      updatePost(post_id: number, title: string, content: string, image: string) {
        return new Promise((resolve, reject) => {
          console.log('Executing Query:', { post_id, title, content, image });
      
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
      
      
    
      deletePost(post_id: number) {
        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE FROM Posts WHERE post_id = ?', [post_id], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows === 0) return reject(new Error('No row deleted'));
            resolve();
          });
        });
      }

//   likePost(post_id: number): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       pool.query('UPDATE PostLikes SET like_count = like_count + 1 WHERE post_id=?', [post_id], (error, results: ResultSetHeader) => {
//         if (error) return reject(error);
//         if (results.affectedRows === 0) return reject(new Error('Post not found'))
//         resolve();
//       });
//     }); 
//   }

//   getPosLikes(post_id: number) {
//     return new Promise<number[]>((resolve, reject) => {
//       pool.query('SELECT like_count FROM PostLikes WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
//         if (error) return reject(error);
//         const posLikeCount = results[0].like_count;
//         resolve(posLikeCount);
//       });
//     });
//   }

    addPostComment(post_id: number, user_id: number, content: string, created_at: Date) {
        return new Promise<number>((resolve, reject) => {
            pool.query('INSERT INTO Post_comments SET post_id=?, user_id=?, content=?, created_at=?', [post_id, user_id, content, created_at], (error, results: ResultSetHeader) => {
                if (error) return reject(error);
                resolve(results.insertId);
            });
        });
    }

    getPostComments(post_id: number) {
        return new Promise<PostComment[]>((resolve, reject) => {
            pool.query('SELECT * FROM Post_comments WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
                if (error) return reject(error);
                resolve(results as PostComment[]);
            });
        });
    }
}

export default new PostService();