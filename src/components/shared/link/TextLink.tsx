/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

import { mq, secondaryColor } from "../../../css";

export const TextLink: React.FC<{ href: string }> = ({ children, href }) => {
    const style = css({
        [mq[0]]: {
            textDecoration: "underline",
            textDecorationColor: secondaryColor
        }
    });

    return (
        <a css={style} href={href}>
            {children}
        </a>
    );
};

export const ClickLink: React.FC<{ onClick: () => void }> = ({ children, onClick }) => {
    const style = css({
        [mq[0]]: {
            textDecoration: "underline",
            textDecorationColor: secondaryColor,
            color: secondaryColor,
            cursor: "pointer"
        }
    });

    return (
        <span css={style} onClick={onClick}>
            {children}
        </span>
    );
};