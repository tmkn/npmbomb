/** @jsx jsx */
import { jsx, css, keyframes, Interpolation } from "@emotion/core";
import React, { memo } from "react";

import { mq, primaryColor, primaryColorLight } from "../../../css";
import { Center } from "../center/Center";

export const LoadingIndicator: React.FC = memo(() => {
    const bounce = keyframes`
        0%, 100% { 
            transform: scale(0.0);
        }
        50% { 
            transform: scale(1.0);
        }
    `;

    const sharedStyle: Interpolation = {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        opacity: 0.6,
        position: "absolute",
        top: 0,
        left: 0,
        animation: `${bounce} 2.0s infinite ease-in-out`
    };

    const style = css({
        [mq[0]]: {
            width: "40px",
            height: "40px",
            position: "relative",
            margin: "100px auto",
            "& div:nth-child(odd)": {
                ...sharedStyle,
                backgroundColor: primaryColor
            },
            "& div:nth-child(even)": {
                ...sharedStyle,
                backgroundColor: primaryColorLight,
                animationDelay: "-1s"
            }
        }
    });

    return (
        <Center>
            <div css={style}>
                <div></div>
                <div></div>
            </div>
        </Center>
    );
});
