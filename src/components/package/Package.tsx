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
import { NotFound } from "./ErrorComponent";
import { ResultBox } from "./ResultBox";
import { CountUp, scaleDuration } from "./CountUp";
import { Heading } from "./Heading";
import { mq, primaryColor, secondaryColor, serifFont } from "../../css";
import { setPackageTitle } from "../../title";

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

const exactMatchMargin = css({
    [mq[0]]: {
        marginBottom: `1.5rem`
    }
});

export function getNameVersion(pkg: string): [string, string] {
    const parts = pkg.split("@");

    if (parts.length < 2) {
        return [parts[0], ""];
    }

    return [parts[0], parts[1]];
}

export interface IPackageInfo {
    name: string;
    version: string;
    description: string;
    dependencies: number;
    distinctDependencies: number;
    directDependencies: number;
}

async function getPackageInfo(pkgName: string, scope: string | undefined): Promise<IPackageInfo> {
    const dataUrl: string = scope ? `${scope}/${pkgName}` : pkgName;
    const resp = await fetch(`/data/${dataUrl}.json`);
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

interface IDataLoaderResponse {
    data: IPackageInfo;
    error: boolean;
    loading: boolean;
}

function useDataLoader(pkgName: string, scope: string | undefined): IDataLoaderResponse {
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<IPackageInfo>({
        name: ``,
        version: ``,
        description: ``,
        distinctDependencies: 0,
        dependencies: 0,
        directDependencies: 0
    });

    async function loadData() {
        try {
            const [name, version] = getNameVersion(pkgName);

            setLoading(true);
            setError(false);

            if (version === "") {
                const availableVersion = await getAvailableVersion(name);

                setLoading(false);
                history.push(`/package/${availableVersion}`);
            } else {
                const pkgInfo = await getPackageInfo(pkgName, scope);

                setLoading(false);
                setData(pkgInfo);
            }
        } catch {
            setLoading(false);
            setError(true);
        }
    }

    useEffect(() => {
        loadData();
    }, [pkgName]);

    return {
        data,
        loading,
        error
    };
}

const Package: React.FC = () => {
    const history = useHistory();
    const { pkgName, scope } = useParams<{ pkgName: string; scope?: string }>();
    const { appState, setAppState } = useContext(AppContext);
    const [userGuess, setUserGuess] = useState<number | undefined>();
    const { data: pkgInfo, loading, error } = useDataLoader(pkgName, scope);
    const guessContext: IGuessContext = {
        package: pkgInfo,
        guess: undefined,
        setUserGuess: value => setUserGuess(value)
    };

    useEffect(() => {
        setPackageTitle(`${pkgInfo.name}@${pkgInfo.version}`);
    });

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

            history.push(`/package/${_remaining[0]}`);
        }
    }

    const fadeIn = keyframes`
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    `;

    const nextStyle = css({
        [mq[0]]: {
            opacity: 0,
            animation: `${fadeIn} 1500ms ease forwards`,
            animationDelay: `${scaleDuration}ms`
        }
    });

    return (
        <GuessContext.Provider value={guessContext}>
            <Heading packageName={pkgName} scope={scope} />
            <Info>{pkgInfo.description}</Info>
            <h2>How many dependencies?</h2>
            {typeof userGuess === "undefined" && <GuessBox />}
            {typeof userGuess !== "undefined" && (
                <React.Fragment>
                    <CountUp target={pkgInfo.dependencies} userGuess={userGuess} />
                    {userGuess === pkgInfo.dependencies && (
                        <Center>
                            <div css={[exactMatchStyle, exactMatchMargin]}>
                                Congratulations, exact match!
                            </div>
                        </Center>
                    )}
                    <ResultBox
                        guess={userGuess}
                        actual={pkgInfo.dependencies}
                        distinct={pkgInfo.distinctDependencies}
                    />
                    {appState.inGameMode && typeof userGuess !== "undefined" && (
                        <div css={nextStyle}>
                            <Center>
                                <PrimaryButton onClick={onNext}>
                                    <Next />
                                </PrimaryButton>
                            </Center>
                        </div>
                    )}
                </React.Fragment>
            )}
        </GuessContext.Provider>
    );
};

const Next: React.FC = () => {
    const { appState } = useContext(AppContext);
    const current = appState.guesses.length + 1;
    const all = appState.guesses.length + appState.remaining.length;
    const showResults = current === all;
    const nextLabel = showResults ? "Results" : "Next";

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
            <Route exact path={`${match.path}/:pkgName`}>
                <Package />
            </Route>
            <Route exact path={`${match.path}/:scope/:pkgName`}>
                <Package />
            </Route>
            <Route path={match.path}>
                <Redirect to="/" />
            </Route>
        </Switch>
    );
};
