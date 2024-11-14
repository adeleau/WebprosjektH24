import axios from "axios";

export type User = {
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
            .get<User>(`/users/${user_id}`)
            .then((response) => response.data);
    }

    // Henter alle brukere
    getAll() {
        return axios
            .get<User[]>('/users/')
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
    checkUserExists(username: string, email:string):Promise<boolean> {
        const timestamp = new Date().getTime();

        return axios.get('/user/check',{
            params: { username, email, timestamp }
        })
        .then((response) => {
            console.log('Check user exists response:', response.data);
            return response.data.exists;
        })
        .catch((error) => {
            console.error('Error checking user existense', error);
            return false;
        });
    }



}

export default new RegisterService();

//Sjekker om en bruker allerede eksisterer basert på brukernavn eller e-post
    /*checkUserExists(username: string, email: string) {
        return axios
            axios.get(`/users/check?username=${username}&email=${email}`)
            .then((response) => response.data.exists)  // Returnerer true/false
            .catch((error) => {
                console.error("Error checking user existence", error);
                throw error;
            });
    }
}*/

/*checkUserExists(username: string, email: string) {
    return axios
        .get(`/users/check?username=${username}&email=${email}&timestamp=${new Date().getTime()}`)
        .then((response) => response.data.exists)
        .catch((error) => {
            console.error("Error checking user existence", error);
            return false;
        });
    }*/