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
    getAll() {
        return axios
            .get<Angel[]>("/series/:name/angels")
            .then((res) => res.data)
            .catch((err) => {
                console.error("Error fetching angels:", err);
                throw err;
            });
    }

    get(angel_id: number) {
        return axios
            .get<Angel>('/angels/' + angel_id)
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching angel with id ${angel_id}:`, err);
                throw err;
            });
    }

    createAngel(name: string, description: string, image: string, release_year: number, user_id: number, created_at: Date, series_id: number) {
        return axios
            .post<Angel>('/series/:name/angels', { name: name, description: description, image: image, release_year: release_year, user_id: user_id, created_at: created_at, series_id: series_id })
            .then((response) => response.data.angel_id);
    }

    updateAngel(angel_id: number, name: string, description: string, image: string, release_year: number, updated_at: Date, series_id: number) {
        return axios
            .put<Angel>('/series/:name/angels' + angel_id, { name: name, description: description, image: image, release_year: release_year, updated_at: updated_at, series_id: series_id })
            .then((response) => response.data.angel_id);
    }

    deleteAngel(angel_id: number) {
        return axios
            .delete<Angel>('/series/:name/angels' + angel_id)
            .then((response) => response.data.angel_id)
    }

    //likeAngel

    //getAngelLikes

    addAngelComment(angel_id: number, user_id: number, content: string, created_at: Date) {
        return axios
          .post<AngelComment>('/series/:name/angels/' + angel_id + '/comments', { user_id, content, created_at })
          .then((response) => response.data.angelcomment_id);
      }
    
    getAngelComments(angel_id: number) {
        return axios.get<AngelComment[]>('/series/:name/angels/' + angel_id + '/comments').then((response) => response.data);
    }

}

export default new AngelService();
