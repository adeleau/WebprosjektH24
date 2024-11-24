import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

//la inn nå
export type Users = {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  //created_at: string;
};
//la innn nå

class RegisterService {
  
  async register(username: string, email: string, password_hash: string) {
    return axios.post("/register", { username, email, password_hash });
  }

  // private normalizeDate(date: string | Date): string {
  //   const d = typeof date === 'string' ? new Date(date) : date;
  //   return d.toISOString().split('.')[0]; // Normalize to remove milliseconds
  //}
//la inn nå
getAllUsers() {
    return axios.get<Users[]>('/users').then((response) => {
        return response.data.map(user => ({
            ...user,
           // created_at: /*this.normalizeDate(*/user.created_at/*)*/, // Normaliser dato
        }));
    });
}

// Henter en bruker basert på user_id
getUserById(user_id: number) {
    return axios.get<Users>(`/users/${user_id}`).then((response) => {
        return {
            ...response.data,
            //created_at: /*this.normalizeDate(*/response.data.created_at/*)*/, // Normaliser dato
        };
    });
}  
//la inn nå

  async checkUserExists(username: string, email: string) {
    return axios.get("/check/users", {
      params: { username, email },
    });
  }
}

export default new RegisterService();
