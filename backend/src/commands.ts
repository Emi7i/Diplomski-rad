/**
 * PiCommand interface
 * These commands are for their dedicated buttons and are
 * sequentially executed when pressed.
 */
export interface PiCommand {
  id: string;
  label: string;
  destructive: boolean;
  tone: 'positive' | 'negative' | 'neutral';
  lines: string[];
}

export const commands: PiCommand[] = [
  {
    id: 'start',
    label: 'Start',
    destructive: false,
    tone: 'positive',
    lines: [
      'sudo systemctl daemon-reload',
      'sudo systemctl enable hdmi-mirror.service',
      'sudo systemctl start hdmi-mirror.service',
      'sudo systemctl enable set-edid.service',
      'sudo systemctl start set-edid.service',
    ],
  },
  {
    id: 'stop',
    label: 'Stop',
    destructive: false,
    tone: 'negative',
    lines: ['sudo systemctl stop hdmi-mirror.service', 'sudo systemctl ' +
    'stop set-edid.service'],
  },
  {
    id: 'reboot',
    label: 'Reboot',
    destructive: true,
    tone: 'negative',
    lines: ['sudo reboot'],
  },
];
