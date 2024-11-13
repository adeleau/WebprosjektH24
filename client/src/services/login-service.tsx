import axios from "axios";

export type Users = {
   user_id: number;
   username: string;
   email: string;
   password_hash: string;
   created_at: Date; 
};

class LoginService{
    loginUser(username:string, password:string){
        return axios 
            .post(//må sette inn riktig endpoint,{username, password});
            .then((response) => response.data)
            .catch((error) => {
                console.error("Error during login:", error);
                throw error;
            });
    }

}   










export default new Login;
/*class LoginService {
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

}*/




