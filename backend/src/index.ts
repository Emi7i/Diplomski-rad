import express from 'express';
import cors from 'cors';
import http from 'node:http';
import {config} from './config.js';
import {piShell} from './ssh.js';
import {startMediaServer} from './media.js';
import {attachWebSocket} from './ws.js';
import {commands} from './commands.js';

const app = express();
app.use(cors({origin: config.server.corsOrigin ?? true}));

app.get('/api/health', (_req, res) => res.json({ok: true}));

// Frontend only gets id/label/destructive; the actual shell commands stay server-side.
app.get('/api/commands', (_req, res) => {
    res.json(commands.map(({id, label, destructive, tone}) => ({
        id,
        label,
        destructive,
        tone
    })));
});

const server = http.createServer(app);
attachWebSocket(server);

server.listen(config.server.port, () => console.log(`backend listening on :${config.server.port}`));

startMediaServer();
piShell.start();
