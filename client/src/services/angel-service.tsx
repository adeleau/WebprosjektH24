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
    created_at: string;
    updated_at: string;
    series_id: number;
};




// AngelService class to interact with the backend API
class AngelService {
    getAll(): Promise<Angel[]> {
        return axios
            .get<Angel[]>("/angels")
            .then((res) => res.data)
            .catch((err) => {
                console.error("Error fetching angels:", err);
                throw err;
            });
    }

    get(angel_id: number) {
        return axios
            .get<Angel>('/angels/' + angel_id)
            .then((res) =>  res.data)
            .catch((err) => {
                console.error(`Error fetching angel with id ${angel_id}:`, err);
                throw err;
            });
    }

    createAngel(angel: Angel) {
        return axios
            .post<Angel>('/series/:name/angels', angel)
            .then((response) => response.data.angel_id);
    }

    updateAngel(angel: Angel) {
        return axios
            .put<null>(`/angels/${angel.angel_id}`, angel);
    }

    deleteAngel(angel_id: number) {
        return axios
            .delete<Angel>('/series/:name/angels' + angel_id)
            .then((response) => response.data.angel_id)
    }
}

export default new AngelService();
