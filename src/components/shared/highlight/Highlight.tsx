/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

import { primaryColor, mq } from "../../../css";

const highlightStyle = css({
    [mq[0]]: {
        color: `${primaryColor}`
    }
});

export const Highlight: React.FC = ({ children }) => <span css={highlightStyle}>{children}</span>;
