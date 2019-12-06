/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React from "react";

import { mq, textColor } from "../../css";
import { ResultsTable, Num } from "../shared/results/Results";
import { Divider } from "../shared/divider/Divider";
import { scaleDuration } from "./CountUp";

interface IResultBoxProps {
    guess: number;
    actual: number;
}

export const ResultBox: React.FC<IResultBoxProps> = ({ guess, actual }) => {
    const fadeIn = keyframes`
        from {
            height: 0;
            opacity: 0;
        }

        to {
            height: auto;
            opacity: 1;
        }
    `;

    const containerStyle = css({
        [mq[0]]: {
            //display: "none",
            opacity: 0,
            height: 0,
            animation: `${fadeIn} 500ms ease forwards`,
            animationDelay: `${scaleDuration}ms`
        }
    });

    const resultStyle = css({
        [mq[0]]: {
            marginBottom: "1rem",
            color: textColor
        }
    });

    const distance = Math.abs(guess - actual);

    return (
        <div css={containerStyle}>
            <h2>Results</h2>
            <Divider margin={"1rem 0"} />
            <ResultsTable columns={2}>
                <div>Your Guess:</div>
                <Num>{guess}</Num>
                <div>Actual:</div>
                <Num>{actual}</Num>
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <div css={resultStyle}>
                <React.Fragment>
                    You were off by <Num>{distance}</Num>
                </React.Fragment>
            </div>
        </div>
    );
};
