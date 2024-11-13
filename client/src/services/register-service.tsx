import axios from "axios";

export type Users = {
   user_id: number;
   username: string;
   email: string;
   password_hash: string;
   created_at: Date; 
};

class RegisterService {
    get(user_id: number){
        return axios
            .get<Users>('/users' + user_id)
            .then((response) => response.data);
    }
    getAll() {
        return axios
            .get<Users[]>('/users/')
            .then((response) => response.data);
    }

    registerUser( username:string, email:string, password_hash:string ){
        return axios
            .post('/users/register', {username, email, password_hash})
            .then((response) => response.data)
            .catch((error) => {
                console.error("Error during registration", error);
                throw error;
            });
    }
}

export default new RegisterService();
