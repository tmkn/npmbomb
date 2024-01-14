/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { PropsWithChildren } from "react";

import { primaryColor, mq } from "../../../css";

const highlightStyle = css({
    [mq[0]]: {
        color: `${primaryColor}`
    }
});

export const Highlight: React.FC<PropsWithChildren> = ({ children }) => (
    <span css={highlightStyle}>{children}</span>
);
