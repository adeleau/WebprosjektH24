import axios from "axios";

// Angel type to represent individual angel details
export type Angel = {
    angel_id: number; 
    name: string;
    description: string;
    image: string;
    release_year: number;
    views: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    series_id: number;
};

export type AngelComment = {
    angelcomment_id: number;
    angel_id: number;
    user_id: number;
    content: string;
    created_at: Date;
}

//AngelLike

// Props type for individual angel cards
export type AngelCardProps = {
    angel: Angel;
};

// AngelService class to interact with the backend API
class AngelService {
    // Fetch all angels
    getAll() {
        return axios
            .get<Array<Angel>>("/angels")
            .then((res) => res.data)
            .catch((err) => {
                console.error("Error fetching angels:", err);
                throw err;
            });
    }

    // Fetch a single angel by ID
    getById(id: number) {
        return axios
            .get<Angel>(`/angels/${id}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching angel with id ${id}:`, err);
                throw err;
            });
    }

    //likeAngel

    //getAngelLikes

    addAngelComment(angel_id: number, user_id: number, content: string, created_at: Date) {
        return axios
          .post<{ angelcomment_id: number }>('/angels/' + angel_id + '/comments', { user_id, content, created_at })
          .then((response) => response.data.angelcomment_id);
      }
    
      getAngelComments(angel_id: number) {
        return axios.get<AngelComment[]>('/angels/' + angel_id + '/comments').then((response) => response.data);
      }

}

export default new AngelService();
