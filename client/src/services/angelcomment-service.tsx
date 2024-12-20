import axios from "axios";

export type AngelComment = {
    angelcomment_id: number;
    angel_id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}
class AngelCommentService {
    getAngelComments(angel_id: number) {
      return axios
        .get<AngelComment[]>(`/angels/${angel_id}/comments`)
        .then((response) => response.data);
    }
  
    addAngelComment(angel_id: number, user_id: number, content: string) {
      return axios
        .post(`/angels/${angel_id}/comments`, { angel_id, user_id, content })
        .then((response) => response.data.angelcomment_id);
    }
  
    editAngelComment(angelcomment_id: number, content: string, user_id: number, role: string) {
      return axios
        .put(`/angels/comments/${angelcomment_id}`, { content, user_id, role })
        .then((response) => response.data);
    }
    
  
    deleteAngelComment(angelcomment_id: number, user_id: number, role: string) {
      return axios
        .delete(`/angels/comments/${angelcomment_id}`, { data: { user_id, role } })
        .then((response) => response.data);
    }
  }    
  
  export default new AngelCommentService();
  