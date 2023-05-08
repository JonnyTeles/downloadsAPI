import { Request, Response } from "express";
import { AppError } from "../error/AppError";
import { YoutubeService } from "../services/youtube.service";
import { NextFunction } from "express-serve-static-core";
import ytdl from "ytdl-core";
const ytb = new YoutubeService()

export class YoutubeController {
    async response(req: Request, res: Response) {
        const { url } = req.query
        if (!url) throw new AppError('URL vázia')
        try {
            const response = await ytb.youtubeResponse(String(url))
            return res.status(200).send({ response })
        } catch (err: any) {
            console.log(err);
            throw new AppError(`Erro: ${err}`, err.statusCode)
        }
    }

    async downloadMp4(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.query;
            if (!url) throw new AppError('URL vázia')

            const info = await ytdl.getInfo(String(url));
            const format = ytdl.chooseFormat(info.formats, { quality: '18', filter: 'videoandaudio' });
            const videoStream = ytdl(String(url), { format });
            ytdl.chooseFormat(info.formats, {
                filter: "audioandvideo",
            });
            res.set('Content-Type', 'video/mp4');
            videoStream.pipe(res);
        } catch (err: any) {
            console.log(err);
            next(err);
        }
    }

    async downloadMp3(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.query;
            if (!url) throw new AppError('URL vázia')

            const info = await ytdl.getInfo(String(url));
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioonly' });
            const videoStream = ytdl(String(url), { format });
            ytdl.chooseFormat(info.formats, {
                filter: "audioonly",
            });
            res.set('Content-Type', 'music/mp3');
            videoStream.pipe(res);
        } catch (err: any) {
            console.log(err);
            next(err);
        }
    }

}