import { css } from "@emotion/core";

const breakpoints = [320, 768, 1200] as const;

export const mq = breakpoints.map(bp => `@media (min-width: ${bp}px)`) as [
    mobile: string,
    tablet: string,
    desktop: string
];

export const serifFont = "Roboto Slab";
export const sansSerifFont = "Open Sans";
export const headerFont = "Muli";
export const monospaceFont = `'Roboto Mono', monospace;`;

export const primaryColor = "#673AB7";
export const primaryColorLight = "#9575cd";
export const primaryColorDark = "#311B92";

export const secondaryColor = "#0097a7";
export const secondaryColorLight = "#e0f7fa";

export const textColor = "#616161";

export const hideOnMobile = css({
    [mq[0]]: {
        display: "none"
    },
    [mq[1]]: {
        display: "inline"
    }
});

export const mobileOnly = css({
    [mq[0]]: {
        display: "inline"
    },
    [mq[1]]: {
        display: "none"
    }
});

export const globalFocusStyle = css({
    [mq[0]]: {
        "&:focus": {
            outlineColor: `${secondaryColor}`,
            outlineOffset: `0.5rem`,
            outlineStyle: `dotted`
        }
    }
});
