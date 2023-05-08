import { Router } from "express";
import { YoutubeController } from "../controllers/youtubeController";

const youtubeController = new YoutubeController()
const youtubeRoutes = Router()

youtubeRoutes.get('/info', youtubeController.response)
youtubeRoutes.get('/download', youtubeController.downloadMp4)
youtubeRoutes.get('/download2', youtubeController.downloadMp3)


export { youtubeRoutes }