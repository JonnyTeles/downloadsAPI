import ytdl from 'ytdl-core';
import { youtubeDTO } from './../DTO/youtubeDTO';
import * as dotenv from 'dotenv'
dotenv.config()

const COOKIE = process.env.COOKIE

export class YoutubeService {
    async youtubeResponse(url: string): Promise<youtubeDTO> {
        const info = await ytdl.getInfo(url, { requestOptions: { headers: { cookie: COOKIE } } }).catch((err): any => console.error(err));
        const videoFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
        const audio = ytdl.filterFormats(info.formats, 'audioonly');
        let mp3: any;

        for (let i = 0; i < audio.length; i++) {
            if (audio[i].mimeType?.includes('audio/mp4')) {
                mp3 = audio[i];
                break;
            }
        }
        const uniqueLinks: any = {};

        videoFormats.forEach(format => {
            const { qualityLabel, url } = format;

            if (!uniqueLinks[qualityLabel]) {
                uniqueLinks[qualityLabel] = url;
            }
        });

        const { title, viewCount, ownerChannelName, videoId } = info.videoDetails

        const links: any = [];

        videoFormats.forEach(format => {
            const { qualityLabel, url } = format;
            if (qualityLabel && !links.some((link: any) => link.quality === qualityLabel)) {
                links.push({ quality: qualityLabel, url });
            }
        });
        links.push({ quality: 'mp3', url: mp3?.url });

        const response: youtubeDTO = {
            title: title,
            viewCount: viewCount,
            ownerChannelName: ownerChannelName,
            videoId: videoId,
            channelUrl: info.videoDetails.author.channel_url,
            downloadUrl: links
        }

        return response
    }
}