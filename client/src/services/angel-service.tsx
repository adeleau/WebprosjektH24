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
            .post<Angel>(`/angels`, angel)
            .then((response) => response.data.angel_id);
    }

    updateAngel(angel: Angel) {
        return axios
            .put<null>(`/angels/${angel.angel_id}`, angel);
    }

    deleteAngel(angel_id: number) {
        return axios
            .delete<Angel>(`/angels/${angel_id}`)
            .then((response) => response.data.angel_id)
    }

    //get angels etter series_id
    getBySeries(series_id: number) {
        return axios
            .get<Angel[]>(`/series/${series_id}`) 
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching angels for series with id ${series_id}:`, err);
                throw err;
            });
    }

    //søkefelt
    search(query: string): Promise<Angel[]> {
        return axios
            .get<Angel[]>(`/angels/search?q=${encodeURIComponent(query)}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error searching for angels with query "${query}":`, err);
                throw err;
            });
    } //søkefelt

    getUsername(angel_id: number) {
        return axios
            .get<{ username: string }>(`/angels/${angel_id}/username`)
            .then((res) => res.data.username)
            .catch((err) => {
                console.error('Error fetching username', err)
                throw err;
            })
    }
    

}

export default new AngelService();
