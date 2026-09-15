import { Client, type ClientChannel } from 'ssh2';
import { EventEmitter } from 'node:events';
import { config } from './config.js';

export type ShellStatus = 'connecting' | 'connected' | 'disconnected';

class PiShell extends EventEmitter {
    private conn: Client | null = null;
    private stream: ClientChannel | null = null;
    private status: ShellStatus = 'disconnected';
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

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
            console.log('[ssh] connected, opening shell');
            conn.shell({ term: 'xterm' }, (err, stream) => {
                if (err) {
                    console.error(`[ssh] shell error: ${err.message}`);
                    this.emit('data', `\r\n[ssh] shell error: ${err.message}\r\n`);
                    conn.end();
                    return;
                }
                this.stream = stream;
                this.setStatus('connected');

                // sudo prompts go straight through unanswered; the user types the password themselves
                stream.on('data', (chunk: Buffer) => this.emit('data', chunk.toString('utf8')));
                stream.stderr.on('data', (chunk: Buffer) =>
                    this.emit('data', chunk.toString('utf8')),
                );
                stream.on('close', () => {
                    this.stream = null;
                    conn.end();
                });
            });
        });

        conn.on('error', (err) => {
            console.error(`[ssh] connection error: ${err.message}`);
            this.emit('data', `\r\n[ssh] connection error: ${err.message}\r\n`);
        });

        conn.on('close', () => {
            console.log('[ssh] connection closed, retrying in 5s');
            this.conn = null;
            this.stream = null;
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

    write(text: string) {
        if (this.stream && this.status === 'connected') this.stream.write(text);
    }

    runLines(lines: string[]) {
        for (const line of lines) this.write(`${line}\n`);
    }
}

export const piShell = new PiShell();
