/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext } from "react";

import { mq, textColor } from "../../css";
import { ResultsTable, Num } from "../shared/results/Results";
import { Divider } from "../shared/divider/Divider";

interface IResultBoxProps {
    guess: number;
    actual: number;
}

export const ResultBox: React.FC<IResultBoxProps> = ({ guess, actual }) => {
    const resultStyle = css({
        [mq[0]]: {
            marginBottom: "1rem",
            color: textColor
        }
    });
    const distance = Math.abs(guess - actual);

    return (
        <React.Fragment>
            <ResultsTable columns={2}>
                <div>Your Guess:</div>
                <Num>{guess}</Num>
                <div>Actual:</div>
                <Num>{actual}</Num>
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <div css={resultStyle}>
                You were off by <Num>{distance}</Num>
            </div>
        </React.Fragment>
    );
};
