import express from "express";
import registerService from "../services/register-service";

const registerrouter = express.Router();

registerrouter.get("/users", async (_req, res) => {
  try {
    const users = await registerService.getAllUsers();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

registerrouter.get("/users/:user_id", async (req, res) => {
  const user_id = Number(req.params.user_id);
  try {
    const user = await registerService.getUserById(user_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
});

registerrouter.post("/register", async (req, res) => {
  const { username, email, password_hash } = req.body;
  if (!username || !email || !password_hash) {
    return res.status(400).send("Missing fields");
  }
  try {
    const user = await registerService.register(username, email, password_hash);
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send("Error during registration");
  }
});

registerrouter.get("/check/users", async (req, res) => {
  const { username, email } = req.query;
  if (!username || !email) {
    return res.status(400).send("Missing username or email");
  }
  try {
    const exists = await registerService.checkUserExists(
      String(username),
      String(email)
    );
    res.status(200).send(exists ? "User exists" : "User does not exist");
  } catch (err) {
    res.status(500).send("Error checking user existence");
  }
});

export default registerrouter;
