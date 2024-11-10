import axios from "axios";



export type AngelComment = {
    angelcomment_id?: number;
    angel_id: number;
    user_id: number;
    content: string;
    created_at: string;
}

class AngelCommentService {
    addAngelComment(angel_id: number, user_id: number, content: string, created_at: Date) {
        return axios
          .post<AngelComment>('/series/:name/angels/' + angel_id + '/comments', { user_id, content, created_at })
          .then((response) => response.data.angelcomment_id);
      }
    
      getAngelComments(angel_id: number) {
        return axios.get<AngelComment[]>('/series/:name/angels/' + angel_id + '/comments').then((response) => response.data);
    }

}