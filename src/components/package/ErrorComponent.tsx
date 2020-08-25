/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Sentry from "@sentry/browser";

import { AppContext } from "../../App";
import { mq, textColor } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { TextLink, ClickLink } from "../shared/link/TextLink";
import { Highlight } from "../shared/highlight/Highlight";

export const ErrorComponent: React.FC<{ pkgName: string }> = ({ pkgName, children }) => {
    const { setAppState } = useContext(AppContext);
    const history = useHistory();

    /* istanbul ignore next */
    function onClick(): void {
        setAppState({
            inGameMode: false,
            guesses: [],
            remaining: [],
            packages: []
        });
        history.push("/");
    }

    return (
        <React.Fragment>
            <h1>{pkgName}</h1>
            <ErrorBanner>{children}</ErrorBanner>
            <Center>
                <PrimaryButton onClick={onClick}>Home</PrimaryButton>
            </Center>
        </React.Fragment>
    );
};

export const ErrorBanner: React.FC = ({ children }) => {
    const style = css({
        [mq[0]]: {
            color: textColor,
            margin: "1rem 0",
            flex: 1,
            backgroundColor: "#FBE9E7",
            padding: "1rem"
        }
    });

    return (
        <Center>
            <div css={style}>{children}</div>
        </Center>
    );
};

export const NotFound: React.FC<{ pkgName: string }> = ({ pkgName }) => {
    const [sentFeedback, setFeedback] = useState<boolean>(false);

    /* istanbul ignore next */
    function proposePackage() {
        Sentry.configureScope(function (scope) {
            scope.setExtra("pkg", pkgName);
        });
        Sentry.captureMessage(`Propose ${pkgName}`);
        setFeedback(true);
    }

    return (
        <ErrorComponent pkgName={pkgName}>
            <span>Whoops, couldn't find data for this package!</span>
            <br />
            {!sentFeedback && (
                <span>
                    <ClickLink onClick={proposePackage}>Propose this package</ClickLink>
                </span>
            )}
            {sentFeedback && (
                <span>
                    Package <Highlight>{pkgName}</Highlight> was proposed!
                </span>
            )}
        </ErrorComponent>
    );
};
