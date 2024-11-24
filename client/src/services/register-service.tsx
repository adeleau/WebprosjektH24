import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

class RegisterService {
  async register(username: string, email: string, password_hash: string) {
    return axios.post("/register", { username, email, password_hash });
  }

  async checkUserExists(username: string, email: string) {
    return axios.get("/check/users", {
      params: { username, email },
    });
  }
}

export default new RegisterService();
