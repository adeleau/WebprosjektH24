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
        return axios
        .get<AngelComment[]>('/angels/' + angel_id + '/comments')
        .then((response) => response.data);
    }
    
    addAngelComment(angelId: number, content: string, angelcomment: AngelComment) {
        return axios
          .post<AngelComment>('/angels/' + angelcomment.angel_id + '/comments', angelcomment)
          .then((response) => response.data.angelcomment_id);
    }

    editAngelComment(angelcomment_id: number, content: string) {
        return axios
        .put(`/comments/${angelcomment_id}`, { content })
        .then((response) => response.data)
    }

    deleteAngelComment(angelcomment_id: number) {
        return axios
        .delete(`/comments/${angelcomment_id}`)
        .then((response) => response.data)

    }

}
export default new AngelCommentService();
