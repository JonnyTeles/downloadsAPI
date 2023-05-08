import { Router } from "express";
import { youtubeRoutes } from "./youtube.routes";

const routes = Router()

routes.use("/youtube", youtubeRoutes)

export { routes }