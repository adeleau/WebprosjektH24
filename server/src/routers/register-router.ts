import express from 'express';
import registerService, { Users } from '../services/register-service';

const registerrouter = express.Router();

//Registrering
// get all users
registerrouter.get('/users', (_request, response) => {
  registerService
      .getAllUsers()
      .then((users) => {
          // Returner normaliserte brukere
          response.send(users.map(user => ({
              ...user,
              created_at: user.created_at.split('.')[0], // Fjern millisekunder
          })));
      })
      .catch((error) => response.status(500).send(error));
});

/*registerrouter.get('/users', (_request, response) =>{
    registerService
      .getAllUsers()
      .then((users) =>  response.send(users))
      .catch((error) => response.status(500).send(error));
});*/
  
// get a user
registerrouter.get('/users/:user_id', (req, res) => {
  const user_id = Number(req.params.user_id);
  registerService
      .getUserById(user_id)
      .then((user) => {
          if (!user) {
              return res.status(404).send('User not found');
          }
          res.status(200).send({
              ...user,
              created_at: user.created_at.split('.')[0], // Fjern millisekunder
          });
      })
      .catch(() => res.status(500).send('Error fetching user'));
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


/*
registerrouter.post('/register', (request, response) => {
  const { username, email, password_hash } = request.body;

  console.log('Received registration request:', request.body);

  if (username && email && password_hash) {
    registerService
      .register(username, email, password_hash)
      .then((user) => { 
        console.log('User registered successfully:', user);
        response.status(201).send(user); // Send direkte brukeren uten ekstra pakkestruktur
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        response.status(500).send('Error during registration');
      });
  } else {
    console.warn('Missing registration fields');
    response.status(400).send('Missing username, email, or password hash');
  }
});*/

  
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