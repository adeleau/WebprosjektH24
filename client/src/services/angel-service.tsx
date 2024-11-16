import axios from "axios";

// Angel type to represent individual angel details
export type Angel = {
    angel_id?: number; 
    name: string;
    description: string;
    image: string;
    release_year: number;
    views: number;
    user_id: number;
    //created_at: Date;
    //updated_at?: Date;
    series_id: number;
};
export type AngelHistory = {
    angel_id?: number;
    description: string;
    user_id: string;
    // updated_at?: string;
  
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
        const angelId = Number(angel_id)
        return axios
            .get<Angel>('/angels/' + angelId)
            .then((res) =>  res.data)
            .catch((err) => {
                console.error(`Error fetching angel with id ${angelId}:`, err);
                throw err;
            });
    } 

    createAngel(angel: Angel) {
        return axios
            .post<{ angel_id: number }>(`/angels`, angel)
            .then((res) => {
                const angel_id = res.data.angel_id;
    
                // Logg første versjon i AngelHistory
                return axios
                    .post(`/angel/history`, {
                        angel_id: angel_id,
                        name: angel.name,
                        description: angel.description,
                        user_id: angel.user_id,
                    })
                    .then(() => angel_id); // Returner angel_id etter logging
            });
    }
    

    updateAngel(angel: Angel) {
        // Logg gammel versjon før oppdatering
        return axios
            .post(`/angel/history`, {
                angel_id: angel.angel_id,
                name: angel.name, // Kan legge til mer spesifikk logikk for å hente tidligere navn og beskrivelser
                description: angel.description,
                user_id: angel.user_id,
            })
            .then(() => {
                // Oppdater engelen etter logging
                return axios.put<null>(`/angels/${angel.angel_id}`, angel);
            });
    }

    deleteAngel(angel_id: number) {
        // Først hent engelens nåværende data for logging
        return axios
            .get<Angel>(`/angels/${angel_id}`)
            .then((res) => {
                const angel = res.data;
    
                // Logg den eksisterende tilstanden i AngelHistory
                return axios
                    .post(`/angel/history`, {
                        angel_id: angel.angel_id,
                        name: angel.name,
                        description: angel.description,
                        user_id: angel.user_id,
                    })
                    .then(() => {
                        // Slett engelen etter logging
                        return axios.delete<null>(`/angels/${angel_id}`);
                    });
            });
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
            .get<Angel[]>(`/angels/search/${query}`)
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

    getCreatedAt(angel_id: number) {
        const angelId = Number(angel_id)
        return axios
            .get<{ created_at: string }>(`/angels/${angelId}/created_at`)
            .then((res) => res.data.created_at)
            .catch((err) => {
                console.error('Error fetching created timestamp on angel: ' + angel_id, err)
                throw err;
            })
      }
  
      getUpdatedAt(angel_id: number) {
        const angelId = Number(angel_id)
        return axios
            .get<{ updated_at: string }>(`/angels/${angelId}/updated_at`)
            .then((res) => res.data.updated_at)
            .catch((err) => {
                console.error('Error fetching updated timestamp on angel: ' + angel_id, err)
                throw err;
            })
      }
}

export default new AngelService();
