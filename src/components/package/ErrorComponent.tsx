/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AppContext } from "../../App";
import { mq, textColor } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { TextLink } from "../shared/link/TextLink";

export const ErrorComponent: React.FC<{ pkgName: string }> = ({ pkgName, children }) => {
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
            remaining: [],
            packages: []
        });
        history.push("/");
    }

    return (
        <React.Fragment>
            <h1>{pkgName}</h1>
            <Center>
                <div css={style}>{children}</div>
            </Center>
            <Center>
                <PrimaryButton onClick={onClick}>Home</PrimaryButton>
            </Center>
        </React.Fragment>
    );
};

export const NotFound: React.FC<{ pkgName: string }> = ({ pkgName }) => (
    <ErrorComponent pkgName={pkgName}>
        <span>Whoops, couldn't find data for this package!</span>
        <br />
        <span>
            If you feel this package is important you can hit me up on Twitter{" "}
            <TextLink href="https://twitter.com/tmkndev">@tmkndev</TextLink>
        </span>
    </ErrorComponent>
);

export const VersionNotFound: React.FC<{ pkgName: string }> = ({ pkgName }) => (
    <ErrorComponent pkgName={pkgName}>
        <span>Whoops, couldn't parse the version for this package!</span>
    </ErrorComponent>
);
