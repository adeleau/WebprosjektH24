import express from 'express';
import SeriesService, { Series } from "./services/series-service"

const router = express.Router();

router.get("/series", (_req, res) => {
  SeriesService.getAll()
  .then((seriesList) => {res.send(seriesList)})
  .catch((err) => {res.status(500).send(err)})
});

export default router;