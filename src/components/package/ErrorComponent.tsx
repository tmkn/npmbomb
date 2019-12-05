/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AppContext } from "../../App";
import { mq, textColor } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";

export const ErrorComponent: React.FC<{ pkgName: string }> = ({ pkgName }) => {
    const { setAppState } = useContext(AppContext);
    const history = useHistory();

    const style = css({
        [mq[0]]: {
            color: textColor,
            margin: "1rem 0",
            flex: 1,
            backgroundColor: "#FBE9E7",
            padding: "1rem"
        }
    });

    function onClick(): void {
        setAppState({
            gameMode: false,
            guesses: [],
            remaining: []
        });
        history.push("/");
    }

    return (
        <React.Fragment>
            <h1>{pkgName}</h1>
            <Center>
                <div css={style}>
                    <span>Whoops, couldn't load data!</span>
                </div>
            </Center>
            <Center>
                <PrimaryButton onClick={onClick}>Home</PrimaryButton>
            </Center>
        </React.Fragment>
    );
};
