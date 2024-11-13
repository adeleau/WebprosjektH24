import axios from "axios";

export type Users = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
};

class RegisterService {
    // Henter en bruker basert på user_id
    get(user_id: number) {
        return axios
            .get<Users>(`/users/${user_id}`)
            .then((response) => response.data);
    }

    // Henter alle brukere
    getAll() {
        return axios
            .get<Users[]>('/users/')
            .then((response) => response.data);
    }

    // Registrerer en ny bruker
    registerUser(username: string, email: string, password_hash: string) {
        return axios
            .post('/users/register', { username, email, password_hash })
            .then((response) => response.data)
            .catch((error) => {
                console.error("Error during registration", error);
                throw error;
            });
    }

    // Sjekker om en bruker allerede eksisterer basert på brukernavn eller e-post
    checkUserExists(username: string, email: string) {
        return axios
            .get(`/users/check?username=${username}&email=${email}`)
            .then((response) => response.data.exists)  // Returnerer true/false
            .catch((error) => {
                console.error("Error checking user existence", error);
                throw error;
            });
    }
}

export default new RegisterService();
