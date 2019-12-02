const breakpoints = [320, 768, 1200] as const;

export const mq = breakpoints.map(bp => `@media (min-width: ${bp}px)`);
