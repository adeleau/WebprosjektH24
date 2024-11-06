import axios from "axios";

// Angel type to represent individual angel details
export type Angel = {
    angel_id: number;
    name: string;
    image: string;
};

// Props type for individual angel cards
export type AngelCardProps = {
    angel: Angel;
};

// AngelService class to interact with the backend API
class AngelService {
    // Fetch all angels
    getAll() {
        return axios.get<Array<Angel>>("/angels")
            .then((res) => res.data)
            .catch((err) => {
                console.error("Error fetching angels:", err);
                throw err;
            });
    }

    // Fetch a single angel by ID
    getById(id: number) {
        return axios.get<Angel>(`/angels/${id}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching angel with id ${id}:`, err);
                throw err;
            });
    }
}

export default new AngelService();
