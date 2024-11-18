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
 
//get name of series by id
seriesrouter.get('/series/name/:id',(req, res) =>{
   seriesService.getName(Number(req.params.id))
     .then((name) => res.send(name))
     .catch((err) => res.status(500).send(err))
})

// Create a new series (new route)
seriesrouter.post('/series', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Series name is required");
  }

  seriesService
    .createSeries({ name })
    .then((newSeries) => res.status(201).send(newSeries))
    .catch((error) => res.status(500).send(error));
});

// Delete a series without deleting associated angels
seriesrouter.delete('/series/:id', (req, res) => {
  const seriesId = Number(req.params.id);

  if (!seriesId) {
    return res.status(400).send('Series ID is required');
  }

  seriesService
    .deleteSeries(seriesId)
    .then(() => res.status(200).send(`Series with ID ${seriesId} deleted successfully`))
    .catch((error) => res.status(500).send(error));
});


export default seriesrouter;