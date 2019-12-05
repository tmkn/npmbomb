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
