import express, { NextFunction, Request, Response } from "express";
import logger from 'morgan'
import "express-async-errors"
import cors from 'cors'
import { routes } from "./routes";
import { AppError } from './error/AppError';
import fs from 'fs';
import https from 'https';

const file = fs.readFileSync('./3969C06766DE24A8843D74E38B842C9B.txt')
const key = fs.readFileSync('private.key')
const cert = fs.readFileSync('certificate.crt')
const app = express()
const port = 3000

const cred = {
    key,
    cert
}

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(routes)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "Error",
            message: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error -  ${err.message}`
    })
})
app.get('/.well-known/pki-validation/3969C06766DE24A8843D74E38B842C9B.txt', (req: Request, res: Response) => {
    res.sendFile('/home/ubuntu/API/3969C06766DE24A8843D74E38B842C9B.txt')
})
app.listen(port, () => console.log('API downloads rodando na porta 3000...🚀'));

const httpsServer = https.createServer(cred, app)
httpsServer.listen(8443)