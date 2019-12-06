/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useState, useEffect, useContext } from "react";
import { Switch, Route, useRouteMatch, useParams, Redirect, useHistory } from "react-router-dom";

import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { AppContext } from "../../App";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { IGuessContext, GuessContext, GuessBox } from "./GuessBox";
import { ErrorComponent } from "./ErrorComponent";
import { ResultBox } from "./ResultBox";
import { CountUp, scaleDuration } from "./CountUp";
import { Heading } from "./Heading";
import { data } from "./data";
import { mq, primaryColor, secondaryColor, serifFont } from "../../css";

const blink = keyframes`
    from {
        visibility: visible;
        color: ${primaryColor};
        //transform: scale(1);
    }

    to {
        visibility: visible;
        color: ${secondaryColor};
        //transform: scale(1.02);
    }
`;

const exactMatchStyle = css({
    [mq[0]]: {
        fontFamily: `${serifFont}`,
        visibility: "hidden",
        color: secondaryColor,
        animation: `${blink} 1500ms ease-in-out infinite alternate`,
        animationDelay: `${scaleDuration}ms`
    }
});

export interface IPackageInfo {
    name: string;
    version: string;
    description: string;
    dependencies: number;
}

const Package: React.FC = () => {
    const history = useHistory();
    const { pkgName } = useParams<{ pkgName: string }>();
    const { appState, setAppState } = useContext(AppContext);
    const [userGuess, setUserGuess] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pkgInfo, setPkgInfo] = useState<IPackageInfo>({
        name: "",
        version: "",
        dependencies: 0,
        description: ""
    });
    const guessContext: IGuessContext = {
        guess: undefined,
        setUserGuess: value => setUserGuess(value)
    };

    useEffect(() => {
        //todo load real data
        setTimeout(() => {
            const pkgInfo = data.get(pkgName);

            setLoading(false);
            if (pkgInfo) setPkgInfo(pkgInfo);
            else setError(true);
        }, 1000);
    }, [pkgName]);

    if (loading) return <LoadingIndicator />;

    if (error) return <ErrorComponent pkgName={pkgName} />;

    function onNext(): void {
        const { guesses, remaining } = appState;

        if (remaining.length === 1) {
            setAppState({
                ...appState,
                remaining: [],
                guesses: [
                    ...guesses,
                    {
                        pkg: pkgName,
                        dependencies: pkgInfo.dependencies,
                        guess: userGuess!
                    }
                ]
            });

            history.push("/results");

            return;
        } else {
            const _remaining = remaining.slice(1);

            setUserGuess(undefined);
            setAppState({
                ...appState,
                remaining: _remaining,
                guesses: [
                    ...guesses,
                    {
                        pkg: pkgName,
                        dependencies: pkgInfo.dependencies,
                        guess: userGuess!
                    }
                ]
            });
            setLoading(true);

            history.push(`/package/${_remaining[0]}`);
        }
    }

    const nextLabel = appState.remaining.length > 1 ? "Next" : "Results";

    return (
        <GuessContext.Provider value={guessContext}>
            <Heading name={pkgInfo.name} />
            <Info>{pkgInfo.description}</Info>
            <h2>How many dependencies?</h2>
            {typeof userGuess === "undefined" && <GuessBox />}
            {typeof userGuess !== "undefined" && (
                <React.Fragment>
                    <CountUp target={pkgInfo.dependencies} />
                    {userGuess === pkgInfo.dependencies && (
                        <Center>
                            <div css={exactMatchStyle}>Congratulations, exact match!</div>
                        </Center>
                    )}
                    {userGuess !== pkgInfo.dependencies && (
                        <React.Fragment>
                            <ResultBox guess={userGuess} actual={pkgInfo.dependencies} />
                        </React.Fragment>
                    )}
                    {appState.gameMode && (
                        <Center>
                            <PrimaryButton onClick={onNext}>{nextLabel}</PrimaryButton>
                        </Center>
                    )}
                </React.Fragment>
            )}
        </GuessContext.Provider>
    );
};

export default () => {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:pkgName`}>
                <Package />
            </Route>
            <Route path={match.path}>
                <Redirect to="/" />
            </Route>
        </Switch>
    );
};
