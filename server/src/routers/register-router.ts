import express from 'express';
import registerService, { Users } from '../services/register-service';

const registerrouter = express.Router();

//Registrering
// get all users
registerrouter.get('/users', (_request, response) =>{
    registerService
      .getAllUsers()
      .then((users) =>  response.send(users))
      .catch((error) => response.status(500).send(error));
});
  
// get a user
registerrouter.get('/users/:user_id', (_request, response) =>{
    const user_id = Number(_request.params.user_id);
    registerService
      .getUserById(user_id)
      .then((users) =>  response.send(users))
      .catch((error) => response.status(500).send(error));
});
  

registerrouter.post('/register', (request,response) =>{
  const {username, email, password_hash} = request.body;
  
  
  if (username && email && password_hash) {
      registerService
        .register(username, email, password_hash)
        .then((users) => { 
          response.status(201).send({ username : users });
        })
        .catch((error) => {
          console.error('Error during registration:', error);
          response.status(500).send('Error during registration');
        });
  } else {
    console.warn('Missing registration fields');
    response.status(400).send('Missing username, email, or password hash');
  }
});
  
//sjekker om brukeren allerede eksisterer
registerrouter.get('/check/users', (request, response) => {
  const {username, email} = request.query;
  
  if (username && email) {
    registerService
      .checkUserExists(String(username), String(email))
      .then((exists) => {
          response.send(exists ? 'User exists' : 'User does not exist');
      })
      .catch((error) => {
        console.error('Error checking user existens:', error);
        response.status(500).send('Error checking user existense');
      });
  }else{
    response.status(400).send('username or email are required');
  }
});

export default registerrouter;