/**
 * PiCommand interface
 * These commands are for their dedicated buttons and are
 * sequentially executed when pressed.
 */
export interface PiCommand {
    id: string;
    label: string;
    tone: 'positive' | 'negative' | 'warning' | 'neutral';
    lines: string[];
}

export const commands: PiCommand[] = [
    {
        id: 'start',
        label: 'Start',
        tone: 'positive',
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
        lines: [
            'sudo systemctl stop hdmi-mirror.service',
            'sudo systemctl ' + 'stop set-edid.service',
        ],
    },
    {
        id: 'reboot',
        label: 'Reboot',
        tone: 'warning',
        lines: ['sudo reboot'],
    },
];
