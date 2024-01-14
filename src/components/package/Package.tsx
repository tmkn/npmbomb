/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/react";
import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useParams, Navigate, useNavigate } from "react-router-dom";

import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { IGuessContext, GuessContext } from "./guess/GuessContext";
import { NotFound } from "./ErrorComponent";
import { ResultBox } from "./ResultBox";
import { CountUp, scaleDuration } from "./CountUp";
import { PackageHeading } from "./Heading";
import { mq, primaryColor, secondaryColor, serifFont } from "../../css";
import { setPackageTitle } from "../../title";
import { AppContext } from "../../AppContext";
import { getPackageInfo, IPackageInfo } from "./PackageData";
import { getNameVersion } from "../../Common";
import { GuessRadioGroup } from "./guess/GuessRadioGroup";

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
    const history = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<IPackageInfo>({
        name: ``,
        version: ``,
        description: ``,
        distinctDependencies: 0,
        dependencies: 0,
        directDependencies: 0,
        tree: {
            data: [],
            tree: {
                id: 0
            }
        }
    });

    useEffect(() => {
        //keep track if there was a rerender while we fetched the data
        let unmounted = false;

        (async () => {
            try {
                const [name, version] = getNameVersion(pkgName);

                setLoading(true);
                setError(false);

                if (version === "") {
                    const availableVersion = await getAvailableVersion(name);

                    if (!unmounted) {
                        setLoading(false);
                    }
                    history(`/package/${availableVersion}`);
                } else {
                    const pkgInfo = await getPackageInfo(pkgName, scope);

                    if (!unmounted) {
                        setLoading(false);
                        setData(pkgInfo);
                    }
                }
            } catch {
                setLoading(false);
                setError(true);
            }
        })();

        return () => {
            unmounted = true;
        };
    }, [pkgName]);

    return {
        data,
        loading,
        error
    };
}

type IRouteParams = {
    routePkgName: string;
    routeScope?: string;
};

export const Package: React.FC = () => {
    const history = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { routePkgName = "foo", routeScope } = useParams<IRouteParams>();
    const { appState, setAppState } = useContext(AppContext);
    const [userGuess, setUserGuess] = useState<number | undefined>();
    const { data: pkgInfo, loading, error } = useDataLoader(routePkgName, routeScope);
    const guessContext: IGuessContext = {
        package: pkgInfo,
        guess: undefined,
        setUserGuess: value => setUserGuess(value)
    };

    useEffect(() => {
        if (loading === false) setIsLoading(false);
        setPackageTitle(`${pkgInfo.name}@${pkgInfo.version}`);
    }, [`${pkgInfo.name}@${pkgInfo.version}`]);

    if (error) return <NotFound pkgName={routePkgName} />;

    if (isLoading) return <LoadingIndicator />;

    /* istanbul ignore next */
    function onNext(): void {
        const { guesses, remaining } = appState;

        remaining.shift();

        setUserGuess(undefined);
        setAppState({
            ...appState,
            remaining: remaining,
            guesses: [
                ...guesses,
                {
                    pkgName: routeScope ? `${routeScope}/${routePkgName}` : routePkgName,
                    actualDependencies: pkgInfo.dependencies,
                    guess: userGuess!
                }
            ]
        });

        if (remaining.length === 0) {
            history("/results");
        } else {
            history(`/package/${remaining[0]}`);
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
            <PackageHeading packageName={routePkgName} scope={routeScope} />
            <Info>{pkgInfo.description}</Info>
            <h2>How many total dependencies?</h2>
            {typeof userGuess === "undefined" && <GuessRadioGroup />}
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
                                    <NextLabel />
                                </PrimaryButton>
                            </Center>
                        </div>
                    )}
                </React.Fragment>
            )}
        </GuessContext.Provider>
    );
};

const NextLabel: React.FC = () => {
    const { appState } = useContext(AppContext);
    const current = appState.guesses.length + 1;
    const all = appState.guesses.length + appState.remaining.length;
    const showResults = current === all;
    const nextLabel = showResults ? "Results" : `Next [${current}/${all}]`;

    return <React.Fragment>{nextLabel}</React.Fragment>;
};

/* istanbul ignore next */
export default () => {
    return (
        <Routes>
            <Route path={`:routePkgName`} element={<Package />} />

            <Route path={`:routeScope/:routePkgName`} element={<Package />} />

            <Route path={`*`} element={<Navigate to="/" />} />
        </Routes>
    );
};
