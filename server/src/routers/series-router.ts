import express from 'express';
import seriesService, { Series } from "../services/series-service"
import angelService, { Angel } from "../services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "../services/angelcomment-service"
import postService, { Post, PostComment } from "../services/post-service" //legg til postlikes
import registerService from '../services/register-service';
import { AxiosPromise } from 'axios';
import userService from '../services/user-service';

const seriesrouter = express.Router();

// SERIES
// get all series 
seriesrouter.get("/series", (_request, response) => {
    seriesService
    .getAll()
    .then((seriesList) => {response.send(seriesList)})
    .catch((error) => {response.status(500).send(error)})
});
 
 // get spesific series
 //seriesrouter.get('/series/:name', (request, response) => {
 //  const name = String(request.params.name);
 //  seriesService
 //    .get(name)
 //    .then((series) => (series ? response.send(series) : response.status(404).send('Series not found')))
 //    .catch((error) => response.status(500).send(error));
 // });
 
//get name of series by id
seriesrouter.get('/series/name/:id',(req, res) =>{
   seriesService.getName(Number(req.params.id))
     .then((name) => res.send(name))
     .catch((err) => res.status(500).send(err))
})

export default seriesrouter;