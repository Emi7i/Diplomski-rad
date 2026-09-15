import { Client, type ClientChannel } from 'ssh2';
import { EventEmitter } from 'node:events';
import { config } from './config.js';

export type ShellStatus = 'connecting' | 'connected' | 'disconnected';

const MAIN_SESSION_ID = 'main';
const BUFFER_LIMIT = 20000;

interface Session {
    id: string;
    label: string;
    stream: ClientChannel;
    buffer: string;
}

class PiShell extends EventEmitter {
    private conn: Client | null = null;
    private status: ShellStatus = 'disconnected';
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private sessions = new Map<string, Session>();
    private sessionCounter = 0;

    start() {
        this.connect();
    }

    reconnect() {
        console.log('[ssh] manual reconnect requested');
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.status === 'connecting') return;
        if (this.conn) this.conn.end();
        else this.connect();
    }

    private connect() {
        this.setStatus('connecting');
        console.log(
            `[ssh] connecting to ${config.pi.username}@${config.pi.host}:${config.pi.port}...`,
        );
        const conn = new Client();
        this.conn = conn;

        conn.on('ready', () => {
            console.log('[ssh] connected');
            this.setStatus('connected');
            this.openSession(MAIN_SESSION_ID, 'Session 1');
        });

        conn.on('error', (err) => {
            console.error(`[ssh] connection error: ${err.message}`);
        });

        conn.on('close', () => {
            console.log('[ssh] connection closed, retrying in 5s');
            this.conn = null;
            for (const id of this.sessions.keys()) this.emit('session-closed', id);
            this.sessions.clear();
            this.sessionCounter = 0;
            this.setStatus('disconnected');
            this.scheduleReconnect();
        });

        conn.connect({
            host: config.pi.host,
            port: config.pi.port,
            username: config.pi.username,
            password: config.pi.password,
            readyTimeout: 10000,
            keepaliveInterval: 10000,
        });
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, 5000);
    }

    private setStatus(status: ShellStatus) {
        this.status = status;
        this.emit('status', status);
    }

    getStatus() {
        return this.status;
    }

    listSessions() {
        return [...this.sessions.values()].map(({ id, label, buffer }) => ({ id, label, buffer }));
    }

    createSession(label?: string, initialCommand?: string): string {
        this.sessionCounter += 1;
        const id = `session-${Date.now()}-${this.sessionCounter}`;
        this.openSession(id, label ?? `Session ${this.sessionCounter + 1}`, initialCommand);
        return id;
    }

    runInNewSession(label: string, lines: string[]): string {
        return this.createSession(label, lines.join(' && '));
    }

    private openSession(id: string, label: string, initialCommand?: string) {
        if (!this.conn || this.status !== 'connected') return;
        this.conn.shell({ term: 'xterm' }, (err, stream) => {
            if (err) {
                console.error(`[ssh] shell error: ${err.message}`);
                return;
            }
            const session: Session = { id, label, stream, buffer: '' };
            this.sessions.set(id, session);
            this.emit('session-created', { id, label });
            if (initialCommand) stream.write(`${initialCommand}\n`);

            const onChunk = (chunk: Buffer) => {
                const text = chunk.toString('utf8');
                session.buffer = (session.buffer + text).slice(-BUFFER_LIMIT);
                this.emit('session-data', id, text);
            };
            stream.on('data', onChunk);
            stream.stderr.on('data', onChunk);

            // 'close' isn't reliable for an interactive pty channel; 'exit' fires once the
            // remote shell process actually terminates (closeSession, typed `exit`, etc.)
            const cleanup = () => {
                if (!this.sessions.delete(id)) return;
                this.emit('session-closed', id);
            };
            stream.on('close', cleanup);
            stream.on('exit', cleanup);
        });
    }

    closeSession(id: string) {
        this.sessions.get(id)?.stream.close();
    }

    write(sessionId: string, text: string) {
        this.sessions.get(sessionId)?.stream.write(text);
    }

    runLines(sessionId: string, lines: string[]) {
        this.write(sessionId, `${lines.join(' && ')}\n`);
    }
}

export const piShell = new PiShell();
