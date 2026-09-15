import NodeMediaServer from 'node-media-server';
import { EventEmitter } from 'node:events';
import { config } from './config.js';

export const videoEvents = new EventEmitter();

const streamPath = `/${config.media.app}/${config.media.key}`;

export function startMediaServer() {
    const nms = new NodeMediaServer({
        rtmp: {
            port: config.media.rtmpPort,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60,
        },
        http: { port: config.media.httpPort, allow_origin: '*' },
    });

    nms.on('postPublish', (_id: string, path: string) => {
        if (path === streamPath) videoEvents.emit('status', 'live');
    });
    nms.on('donePublish', (_id: string, path: string) => {
        if (path === streamPath) videoEvents.emit('status', 'offline');
    });

    nms.run();
    return nms;
}
