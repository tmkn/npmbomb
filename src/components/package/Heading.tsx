/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext, useEffect } from "react";

import { AppContext } from "../../App";
import { mq, serifFont, primaryColor } from "../../css";

export const Heading: React.FC<{ name: string }> = ({ name }) => {
    const {
        appState: { inGameMode: gameMode, guesses, remaining }
    } = useContext(AppContext);
    const style = css({
        [mq[0]]: {
            display: "flex",
            alignItems: "center",
            "& h1": {
                flex: 1
            },
            "& span": {
                fontFamily: serifFont,
                color: primaryColor
            }
        }
    });

    const current = guesses.length + 1;
    const all = guesses.length + remaining.length;

    return (
        <div css={style}>
            <h1>{name}</h1>
            {gameMode && (
                <span>
                    [{current}/{all}]
                </span>
            )}
        </div>
    );
};
