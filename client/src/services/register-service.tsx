import axios from "axios";
axios.defaults.baseURL = 'http://localhost:3000';

export type Users = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
};

class RegisterService {
    // Henter en bruker basert på user_id
    private normalizeDate(date: string | Date): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().split('.')[0]; // Fjerner millisekunder for konsistens
    }
    getAllUsers() {
        return axios.get<Users[]>('/users').then((response) => {
            return response.data.map(user => ({
                ...user,
                created_at: this.normalizeDate(user.created_at), // Normaliser dato
            }));
        });
    }

    // Henter en bruker basert på user_id
    getUserById(user_id: number) {
        return axios.get<Users>(`/users/${user_id}`).then((response) => {
            return {
                ...response.data,
                created_at: this.normalizeDate(response.data.created_at), // Normaliser dato
            };
        });
    }
}

export default new RegisterService();