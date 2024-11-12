import axios from "axios";



export type AngelComment = {
    angelcomment_id: number;
    angel_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

class AngelCommentService {
    getAngelComments(angel_id: number) {
        return axios.get<AngelComment[]>('/angels/' + angel_id + '/comments').then((response) => response.data);
    }
    
    addAngelComment(angelcomment: AngelComment) {
        return axios
          .post<AngelComment>('/angels/' + angelcomment.angel_id + '/comments', angelcomment)
          .then((response) => response.data.angelcomment_id);
    }

    editAngelComment() {

    }

    deleteAngelComment() {

    }
    
    

}
export default new AngelCommentService();
