import axios from "axios";

export type Angel = {
    angel_id: number; 
    name: string;
    image: string;
};

export type AngelCardProps = {
    angel: Angel;
};

class AngelService {
    getAll() {
        return axios.get<Array<Angel>>("/angels")
            .then((res) => res.data)
            .catch((err) => {
                console.error("Error fetching angels:", err);
                throw err;
            });
    }

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
