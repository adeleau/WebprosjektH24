import axios from "axios";
// This is formated from he same was as the mandatory assigments
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
    // user_name: string;
    series_id: number;
};
export type Angel_History = {
    angelhistory_id: number;
    angel_id?: number;
    description: string;
    user_id: string;
    updated_at?: Date;
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
        const angelId = Number(angel_id);
        return axios
          .get<Angel>(`/angels/${angelId}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Error fetching angel with id ${angelId}:`, err);
            throw err;
          });
      }
      
    createAngel(angel: Omit<Angel, 'angel_id' | 'created_at' | 'updated_at'>): Promise<Angel> {
        return axios
          .post<Angel>('/angels', angel)
          .then((response) => response.data)
          .catch((error) => {
            console.error('Error creating angel:', error);
            throw error;
          });
      }

      updateAngel(updatedAngel: Partial<Angel>) {
        return axios
          .put<Angel>(`/angels/${updatedAngel.angel_id}`, updatedAngel)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Error updating angel with id ${updatedAngel.angel_id}:`, err);
            throw err;
          });
      }

       // Increment views for an angel
      incrementViews(angelId: number) {
        return axios
          .put<Angel>(`/angels/${angelId}/increment-views`)
          .then((response) => response.data);
      }

  /*updateAngel(angel: Angel) {
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
    }*/


    // Delete an angel by angel_id
    deleteAngel(angel_id: number): Promise<void> {
        return axios
          .delete(`/angels/${angel_id}`)
          .then(() => {
          })
          .catch((err) => {
            console.error(`Error deleting angel with ID ${angel_id}:`, err.response?.data || err.message);
            throw err;
          });
    };
    
    //get angels by series_id
    getBySeries(series_id: number) {
        return axios
            .get<Angel[]>(`/series/${series_id}`) 
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching angels for series with id ${series_id}:`, err);
                throw err;
            });
    }

    //get angel count by series_id
    getAngelCount(series_id: number): Promise<number> {
      return axios
        .get<{ count: number }>(`/series/${series_id}/count`)
        .then((res) => {
          return res.data.count;
        })
        .catch((err) => {
          console.error(`Error fetching angel count for series_id ${series_id}: `, err);
          throw err;
        })
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
          }

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

getPopular(): Promise<Angel[]> {
    return axios
      .get<Angel[]>("/popular")
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error fetching popular angels:", err);
        throw err;
      });
    }
    //Getting AngelHistory we used the same methods as the rest for services.tsx
    getAngelHistory(angel_id: number): Promise<Angel_History[]> {
      return axios
        .get<Angel_History[]>(`/angels/${angel_id}/history`)
        .then((res) => res.data)
        .catch((err) => {
          console.error(`Error fetching history for angel ID ${angel_id}:`, err);
          throw err;
        });
    }
}
export default new AngelService();
