import {WebSocketServer, WebSocket} from 'ws';
import type {Server} from 'node:http';
import {piShell} from './ssh.js';
import {videoEvents} from './media.js';
import {commands} from './commands.js';

export function attachWebSocket(server: Server) {
    const wss = new WebSocketServer({server, path: '/ws'});

    const broadcast = (payload: unknown) => {
        const data = JSON.stringify(payload);
        for (const client of wss.clients) if (client.readyState === WebSocket.OPEN) client.send(data);
    };

    piShell.on('data', (text: string) => broadcast({type: 'console', text}));
    piShell.on('status', (status: string) => broadcast({
        type: 'ssh-status',
        status
    }));
    videoEvents.on('status', (status: string) => broadcast({
        type: 'video-status',
        status
    }));

    wss.on('connection', (ws) => {
        ws.send(JSON.stringify({
            type: 'ssh-status',
            status: piShell.getStatus()
        }));

        ws.on('message', (raw) => {
            let msg: { type?: string; text?: string; id?: string };
            try {
                msg = JSON.parse(raw.toString());
            } catch {
                return;
            }

            if (msg.type === 'input' && typeof msg.text === 'string') piShell.write(msg.text);

            if (msg.type === 'command' && typeof msg.id === 'string') {
                const command = commands.find((c) => c.id === msg.id);
                if (command) piShell.runLines(command.lines);
            }

            if (msg.type === 'reconnect') piShell.reconnect();
        });
    });

    return wss;
}
