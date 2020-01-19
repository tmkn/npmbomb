/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

import { primaryColor } from "../../../css";

const highlightStyle = css({
    color: `${primaryColor}`
});

export const Highlight: React.FC = ({ children }) => <span css={highlightStyle}>{children}</span>;
