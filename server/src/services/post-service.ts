// VI HAR IKKE LAGT TIL POST I DB ENDA
// import { RowDataPacket, ResultSetHeader } from 'mysql2';
// import pool from '../mysql-pool';

// export type Post = {
//     post_id: number;
//     user_id: number;
//     title: string;
//     content: string;
//     image: string;
//     created_at: Date;
//     updated_at: Date;
//   };
  
//   export type PostComment = {
//     postcomment_id: number;
//     post_id: number;
//     user_id: number;
//     content: string;
//     created_at: Date;
//   };
  
//   export type PostLike = {
//     poslike_id: number;
//     post_id: number;
//     like_count: number;
//   };

// export type PostCardProps = {
//     post: Post;
// };

// class PostService {
//     getAll() {
//         return new Promise<Post[] | Error> ((resolve, reject) => {
//             pool.query('select * from posts', [], (err, res: RowDataPacket[]) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(res as Post[])
//             })
//         })
//     }

//     getById(post_id: number) {
//         return new Promise<Post | Error> ((resolve, reject) => {
//             pool.query('select * from posts where post_id=?', [post_id], (err, res: RowDataPacket[]) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(res[0] as Post)
//             })
//         })
//     }

//     /**
//    * Create new post having the given title.
//    *
//    * Resolves the newly created post id.
//    */
//   create(user_id: number, title: string, content: string, img: string) {
//     return new Promise<number>((resolve, reject) => {
//       pool.query('INSERT INTO Posts SET user_id=?, title=?, content=?, img=?', [user_id, title, content, img], (error, results: ResultSetHeader) => {
//         if (error) return reject(error);

//         resolve(results.insertId);
//       });
//     });
//   }

//   /**
//    * Delete post with given id.
//    */
//   deletePost(post_id: number) {
//     return new Promise<void>((resolve, reject) => {
//       pool.query('DELETE FROM Posts WHERE post_id = ?', [post_id], (error, results: ResultSetHeader) => {
//         if (error) return reject(error);
//         if (results.affectedRows == 0) return reject(new Error('No row deleted'));

//         resolve();
//       });
//     });
//   }

//   updatePost(post_id: number, title: string, content: string, img: string) {
//     return new Promise<void>((resolve, reject) => {
//       pool.query('UPDATE Posts SET title=?, content=?, img=? WHERE post_id=?', [title, content, post_id, img], (error, results: ResultSetHeader) => {
//         if (error) return reject(error);
//         resolve();
//       });
//     });
//   }

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

    // addPostComment(post_id: number, user_id: number, content: string, created_at: Date) {
    //     return new Promise<number>((resolve, reject) => {
    //     pool.query('INSERT INTO post_comments SET post_id=?, user_id=?, content=?, created_at=?', [post_id, user_id, content, created_at], (error, results: ResultSetHeader) => {
    //         if (error) return reject(error);

    //         resolve(results.insertId);
    //     });
    //     });
    // }

    // getPostComments(post_id: number) {
    //     return new Promise<PostComment[]>((resolve, reject) => {
    //     pool.query('SELECT * FROM post_comments WHERE post_id = ?', [post_id], (error, results: RowDataPacket[]) => {
    //         if (error) return reject(error);

    //         resolve(results as PostComment[]);
    //     });
    //     });
    // }
// }

// export default new PostService();