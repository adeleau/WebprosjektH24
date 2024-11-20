import axios from "axios";

export type Likes = {
    user_id: number;
    angel_id: number;
}

class LikesService {
    
    // Get all likes for the logged-in user
    getUserLikes(userId: number): Promise<Likes[]> {
        return axios
            .get<Likes[]>(`/${userId}/likes`)  // Endpoint adjustment
            .then((response) => response.data)
            .catch((error) => { console.log(error); return []; });
    }

    // Add a like
    addLike(userId: number, angelId: number): Promise<void> {
    return axios
        .post(`/${userId}/likes`, { angelId })  
        .then((response) => response.data)
        .catch((error) => console.log(error));
}

    // Remove a like
    removeLike(userId: number, angelId: number): Promise<void> {
        return axios
            .delete(`/${userId}/likes`, { data: { seriesId: angelId } }) 
            .then((response) => response.data)
            .catch((error) => console.log(error));
    }
}

export default new LikesService();
