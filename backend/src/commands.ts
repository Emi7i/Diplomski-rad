/**
 * PiCommand interface
 * These commands are for their dedicated buttons.
 */
export interface PiCommand {
    id: string;
    label: string;
    tone: 'positive' | 'negative' | 'warning' | 'info' | 'neutral';
    lines: string[];
    // true = open a fresh session tab and run there; false = run in the main session
    newSession: boolean;
}

const video = '/dev/video0';

export const commands: PiCommand[] = [
    {
        id: 'start',
        label: 'Start',
        tone: 'positive',
        newSession: false,
        lines: [
            'sudo systemctl daemon-reload',
            'sudo systemctl enable --now set-edid.service',
            'sudo systemctl enable --now hdmi-mirror.service',
        ],
    },
    {
        id: 'stop',
        label: 'Stop',
        tone: 'negative',
        newSession: false,
        lines: ['sudo systemctl stop hdmi-mirror.service', 'sudo systemctl stop set-edid.service'],
    },
    {
        id: 'reboot',
        label: 'Reboot',
        tone: 'warning',
        newSession: false,
        lines: ['sudo reboot'],
    },
    {
        id: 'edid',
        label: 'Show EDID',
        tone: 'info',
        newSession: true,
        lines: [`v4l2-ctl -d ${video} --get-edid | edid-decode`],
    },
    {
        id: 'signal-timing',
        label: 'Signal/Timing',
        tone: 'info',
        newSession: true,
        lines: [`v4l2-ctl -d ${video} --query-dv-timings`, `v4l2-ctl -d ${video} --get-dv-timings`],
    },
    {
        id: 'format-colorspace',
        label: 'Format & Colorspace',
        tone: 'info',
        newSession: true,
        lines: [`v4l2-ctl -d ${video} --get-fmt-video`],
    },
    {
        id: 'supported-timings',
        label: 'Supported Timings',
        tone: 'info',
        newSession: true,
        lines: [`v4l2-ctl -d ${video} --list-dv-timings`],
    },
    {
        id: 'full-diagnostic',
        label: 'Full Diagnostic',
        tone: 'info',
        newSession: true,
        lines: [`v4l2-ctl -d ${video} --all`],
    },
    {
        id: 'htop',
        label: 'Htop',
        tone: 'info',
        newSession: true,
        lines: ['htop'],
    },
];
