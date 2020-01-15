/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useState, useEffect, useContext, createContext } from "react";
import { Switch, Route, useRouteMatch, useParams, Redirect, useHistory } from "react-router-dom";

import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { AppContext } from "../../App";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { IGuessContext, GuessContext, GuessBox } from "./GuessBox";
import { NotFound } from "./ErrorComponent";
import { ResultBox } from "./ResultBox";
import { CountUp, scaleDuration } from "./CountUp";
import { Heading } from "./Heading";
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
        animationDelay: `${scaleDuration}ms`,
        fontWeight: "bold"
    }
});

function getNameVersion(pkg: string): [string, string] {
    const parts = pkg.split("@");

    if (parts.length < 2) {
        return [parts[0], ""];
    }

    return [parts[0], parts[1]];
}

export interface IPackageInfo {
    name: string;
    description: string;
    dependencies: number;
    distinctDependencies?: number;
}

async function getPackageInfo(pkg: string): Promise<IPackageInfo> {
    const resp = await fetch(`/data/${pkg}.json`);
    const json = await resp.json();

    return json;
}

async function getAvailableVersion(pkgName: string): Promise<string> {
    const resp = await fetch(`/data/lookup.txt`);
    const names: string[] = (await resp.text())
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.startsWith(pkgName));

    if (names.length === 0) throw new Error(`Couldn't find a version for ${pkgName}`);

    return names[0];
}

const Package: React.FC = () => {
    const history = useHistory();
    const { pkgName } = useParams<{ pkgName: string }>();
    const [name, version] = getNameVersion(pkgName);
    const { appState, setAppState } = useContext(AppContext);
    const [userGuess, setUserGuess] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pkgInfo, setPkgInfo] = useState<IPackageInfo>({
        name: "",
        dependencies: 0,
        description: ""
    });
    const guessContext: IGuessContext = {
        guess: undefined,
        setUserGuess: value => setUserGuess(value)
    };

    useEffect(() => {
        if (version === "") {
            getAvailableVersion(pkgName)
                .then(pkgInfo => {
                    setLoading(false);
                    history.push(`/package/${pkgInfo}`);
                })
                .catch(_ => {
                    setLoading(false);
                    setError(true);
                });
        } else {
            getPackageInfo(pkgName)
                .then(pkgInfo => {
                    setLoading(false);
                    setPkgInfo(pkgInfo);
                })
                .catch(_ => {
                    setLoading(false);
                    setError(true);
                });
        }
    }, [pkgName]);

    if (loading) return <LoadingIndicator />;

    if (error) return <NotFound pkgName={pkgName} />;

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

    return (
        <GuessContext.Provider value={guessContext}>
            <Heading name={`${name}@${version}`} />
            <Info>{pkgInfo.description}</Info>
            <h2>How many dependencies?</h2>
            {typeof userGuess === "undefined" && <GuessBox />}
            {typeof userGuess !== "undefined" && (
                <React.Fragment>
                    <CountUp target={pkgInfo.dependencies} userGuess={userGuess} />
                    {userGuess === pkgInfo.dependencies && (
                        <Center>
                            <div css={exactMatchStyle}>Congratulations, exact match!</div>
                        </Center>
                    )}
                    {userGuess !== pkgInfo.dependencies && (
                        <React.Fragment>
                            <ResultBox guess={userGuess} actual={pkgInfo.dependencies} distinct={pkgInfo.distinctDependencies ?? -1337} />
                        </React.Fragment>
                    )}
                    {appState.inGameMode && (
                        <Center>
                            <PrimaryButton onClick={onNext}>
                                <Next />
                            </PrimaryButton>
                        </Center>
                    )}
                </React.Fragment>
            )}
        </GuessContext.Provider>
    );
};

const Next: React.FC = () => {
    const { appState } = useContext(AppContext);
    const showResults = appState.remaining.length === 0;
    const nextLabel = showResults ? "Results" : "Next";
    const current = appState.guesses.length + 1;
    const all = appState.guesses.length + appState.remaining.length;

    return (
        <React.Fragment>
            {nextLabel}{" "}
            {!showResults && (
                <React.Fragment>
                    [{current}/{all}]
                </React.Fragment>
            )}
        </React.Fragment>
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
