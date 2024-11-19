import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../mysql-pool";

export type AngelComment = {
  angelcomment_id: number;
  angel_id: number;
  user_id: number;
  username: string; // Added to display username in comments
  content: string;
  created_at: Date;
  updated_at?: Date;
};

class AngelCommentService {
  // Get comments with user details
  getAngelComments(angel_id: number): Promise<AngelComment[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT ac.*, u.username 
         FROM Angel_comments ac
         JOIN Users u ON ac.user_id = u.user_id
         WHERE ac.angel_id = ? 
         ORDER BY ac.created_at DESC`,
        [angel_id],
        (error, results: RowDataPacket[]) => {
          if (error) {
            console.error("Error fetching comments:", error);
            return reject(new Error("Failed to fetch comments."));
          }
          resolve(results as AngelComment[]);
        }
      );
    });
  }

  // Add a comment
  addAngelComment(
    angel_id: number,
    user_id: number,
    content: string
  ): Promise<number> {
    const created_at = new Date();
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO Angel_comments (angel_id, user_id, content, created_at) 
         VALUES (?, ?, ?, ?)`,
        [angel_id, user_id, content, created_at],
        (error, results: ResultSetHeader) => {
          if (error) {
            console.error("Error adding comment:", error);
            return reject(new Error("Failed to add comment."));
          }
          resolve(results.insertId);
        }
      );
    });
  }

  // Edit a comment
  updateAngelComment(
    angelcomment_id: number,
    user_id: number,
    role: string,
    content: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT user_id FROM Angel_comments WHERE angelcomment_id = ?`,
        [angelcomment_id],
        (error, results: RowDataPacket[]) => {
          if (error) {
            console.error("Error fetching comment owner:", error);
            return reject(new Error("Failed to fetch comment owner."));
          }
  
          const commentOwnerId = results[0]?.user_id;
          if (role !== "admin" && commentOwnerId !== user_id) {
            return reject(new Error("Unauthorized to edit this comment."));
          }
  
          pool.query(
            `UPDATE Angel_comments 
             SET content = ?, updated_at = ? 
             WHERE angelcomment_id = ?`,
            [content, new Date(), angelcomment_id],
            (updateError, updateResults: ResultSetHeader) => {
              if (updateError) {
                console.error("Error updating comment:", updateError);
                return reject(new Error("Failed to update comment."));
              }
              if (updateResults.affectedRows === 0) {
                return reject(new Error("No comment found to update."));
              }
              resolve();
            }
          );
        }
      );
    });
  }
  

  // Delete a comment (with ownership or admin)
  deleteAngelComment(
    angelcomment_id: number,
    user_id: number,
    role: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT user_id FROM Angel_comments WHERE angelcomment_id = ?`,
        [angelcomment_id],
        (error, results: RowDataPacket[]) => {
          if (error) {
            console.error("Error fetching comment owner:", error);
            return reject(new Error("Failed to fetch comment owner."));
          }

          const commentOwnerId = results[0]?.user_id;
          if (role !== "admin" && commentOwnerId !== user_id) {
            return reject(new Error("Unauthorized to delete this comment."));
          }

          pool.query(
            `DELETE FROM Angel_comments WHERE angelcomment_id = ?`,
            [angelcomment_id],
            (deleteError, results: ResultSetHeader) => {
              if (deleteError) {
                console.error("Error deleting comment:", deleteError);
                return reject(new Error("Failed to delete comment."));
              }
              if (results.affectedRows === 0) {
                return reject(new Error("No comment found to delete."));
              }
              resolve();
            }
          );
        }
      );
    });
  }
}

export default new AngelCommentService();
