export interface Tool {
    id: string;
    title: string;
    description: string;
    path: string;
    createdAt: string;
}

export const tools: Tool[] = [
    {
        id: 'sun-angle-compass',
        title: 'Sun Angle Compass',
        description: "Track the sun's azimuth, elevation, and today's insolation curve.",
        path: '/tools/sun-angle-compass',
        createdAt: '2026-01-03T13:17:21-05:00',
    },
    {
        id: 'random-picker',
        title: 'Random Picker',
        description: "Can't decide? Input your options and let the dice decide for you.",
        path: '/tools/random-picker',
        createdAt: '2026-01-03T14:44:14-05:00',
    },
    {
        id: 'days-until-calculator',
        title: 'Days Until Calculator',
        description: 'Count down to important dates with days, weeks, and months.',
        path: '/tools/days-until-calculator',
        createdAt: '2026-01-05T10:00:00-05:00',
    },
];
