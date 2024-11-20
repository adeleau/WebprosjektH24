import axios from "axios";

export type Wishlist = {
    user_id: number;
    angel_id: number;
}

class WishlistService {
    
    // Get all likes for the logged-in user
    getUserWishlist(userId: number): Promise<Wishlist[]> {
        return axios
            .get<Wishlist[]>(`/${userId}/wishlist`)  // Endpoint adjustment
            .then((response) => response.data)
            .catch((error) => { console.log(error); return []; });
    }

// Add a like
addWishlist(userId: number, angelId: number): Promise<void> {
    return axios
        .post(`/${userId}/wishlist`, { angelId })  // Updated path and body parameter
        .then(() => console.log("Wish added"))
        .catch((error) => console.log(error));
}

    // Remove a like
    removeWishlist(userId: number, angelId: number): Promise<void> {
        return axios
            .delete(`/${userId}/wishlist`, { data: { seriesId: angelId } })  // Updated path and body parameter
            .then(() => console.log("Wish removed"))
            .catch((error) => console.log(error));
    }
}

export default new WishlistService();
