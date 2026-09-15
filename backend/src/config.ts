import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') });

function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

export const config = {
    pi: {
        host: required('PI_HOST', process.env.PI_HOST),
        port: Number(process.env.PI_PORT ?? 22),
        username: required('PI_USERNAME', process.env.PI_USERNAME),
        password: required('PI_PASSWORD', process.env.PI_PASSWORD),
    },
    server: {
        port: Number(process.env.BACKEND_PORT ?? 3000),
        corsOrigin: process.env.FRONTEND_URL || undefined,
    },
    media: {
        rtmpPort: Number(process.env.RTMP_PORT ?? 1935),
        httpPort: Number(process.env.MEDIA_HTTP_PORT ?? 8000),
        app: process.env.STREAM_APP ?? 'live',
        key: process.env.STREAM_KEY ?? 'hdmi',
    },
};
