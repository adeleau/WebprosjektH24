import axios from "axios";

export type Users = {
   user_id: number;
   username: string;
   email: string;
   password_hash: string;
   created_at: Date; 
};

class LoginService {
    get(user_id: number){
        return axios
            .get<Users>('/users/' + user_id)
            .then((response) => response.data)
    }

getAll() {
    return axios
        .get<Users[]>('/users/')
        .then((response) => response.data)
};

}


