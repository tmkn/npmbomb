/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import { mq, secondaryColor, primaryColor } from "../../../css";

export const TextLink: React.FC<{ href: string; target?: string }> = ({
    children,
    href,
    target
}) => {
    const style = css({
        [mq[0]]: {
            textDecoration: "underline",
            textDecorationColor: secondaryColor,
            color: primaryColor,
            cursor: "pointer"
        }
    });

    return (
        <a css={style} href={href} target={target ?? "_blank"}>
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
