import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'node:http';
import { piShell } from './ssh.js';
import { videoEvents } from './media.js';
import { commands } from './commands.js';

export function attachWebSocket(server: Server) {
    const wss = new WebSocketServer({ server, path: '/ws' });

    const broadcast = (payload: unknown) => {
        const data = JSON.stringify(payload);
        for (const client of wss.clients)
            if (client.readyState === WebSocket.OPEN) client.send(data);
    };

    piShell.on('session-data', (sessionId: string, text: string) =>
        broadcast({ type: 'console', sessionId, text }),
    );
    piShell.on('session-created', ({ id, label }: { id: string; label: string }) =>
        broadcast({ type: 'session-created', sessionId: id, label }),
    );
    piShell.on('session-closed', (sessionId: string) =>
        broadcast({ type: 'session-closed', sessionId }),
    );
    piShell.on('status', (status: string) => broadcast({ type: 'ssh-status', status }));
    videoEvents.on('status', (status: string) => broadcast({ type: 'video-status', status }));

    wss.on('connection', (ws) => {
        ws.send(JSON.stringify({ type: 'ssh-status', status: piShell.getStatus() }));

        for (const session of piShell.listSessions()) {
            ws.send(
                JSON.stringify({
                    type: 'session-created',
                    sessionId: session.id,
                    label: session.label,
                }),
            );
            if (session.buffer) {
                ws.send(
                    JSON.stringify({
                        type: 'console',
                        sessionId: session.id,
                        text: session.buffer,
                    }),
                );
            }
        }

        ws.on('message', (raw) => {
            let msg: { type?: string; text?: string; id?: string; sessionId?: string };
            try {
                msg = JSON.parse(raw.toString());
            } catch {
                return;
            }

            if (
                msg.type === 'input' &&
                typeof msg.sessionId === 'string' &&
                typeof msg.text === 'string'
            ) {
                piShell.write(msg.sessionId, msg.text);
            }

            if (
                msg.type === 'command' &&
                typeof msg.sessionId === 'string' &&
                typeof msg.id === 'string'
            ) {
                const command = commands.find((c) => c.id === msg.id);
                if (command) piShell.runLines(msg.sessionId, command.lines);
            }

            if (msg.type === 'run-command-new-session' && typeof msg.id === 'string') {
                const command = commands.find((c) => c.id === msg.id);
                if (command) piShell.runInNewSession(command.label, command.lines);
            }

            if (msg.type === 'create-session') piShell.createSession();

            if (msg.type === 'close-session' && typeof msg.sessionId === 'string') {
                piShell.closeSession(msg.sessionId);
            }

            if (msg.type === 'reconnect') piShell.reconnect();
        });
    });

    return wss;
}
