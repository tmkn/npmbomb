/** @jsx jsx */
import { jsx, css, keyframes, Interpolation } from "@emotion/core";
import React, { useRef, useState, useEffect, useContext, memo } from "react";
import { Switch, Route, useRouteMatch, useParams, Redirect, useHistory } from "react-router-dom";

import {
    mq,
    serifFont,
    primaryColor,
    textColor,
    primaryColorDark,
    primaryColorLight
} from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { ResultsTable, Num } from "../shared/results/Results";
import { AppContext } from "../../App";

const guessBoxStyle = css({
    [mq[0]]: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    }
});

const inputStyle = css({
    [mq[0]]: {
        padding: "0 1rem",
        fontSize: "1rem",
        fontFamily: `"${serifFont}"`,
        maxWidth: "5rem",
        border: "1px solid #EDE7F6",
        outline: "none",
        color: `${primaryColorDark}`,
        textAlign: "center"
    }
});

const data: Map<string, IPackageInfo> = new Map();
data.set("typescript", {
    name: "typescript",
    version: "",
    dependencies: 0,
    description: "TypeScript is a language for application scale JavaScript development"
});
data.set("webpack", {
    name: "webpack",
    version: "",
    dependencies: 489,
    description:
        "Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jsx, es7, css, less, ... and your custom stuff."
});
data.set("react", {
    name: "react",
    version: "",
    dependencies: 15,
    description: "React is a JavaScript library for building user interfaces."
});

interface IGuessBoxProps {
    value?: string;
}

const GuessBox: React.FC<IGuessBoxProps> = ({ value }) => {
    const initValue: string = value ?? "";
    const [guess, setGuess] = useState(initValue);
    const [valid, setValid] = useState(Number.isNaN(parseInt(initValue)));
    const { setUserGuess } = useContext(GuessContext);

    function validate(e: React.ChangeEvent<HTMLInputElement>): void {
        const number = parseInt(e.target.value);

        setValid(Number.isNaN(number));
        if (Number.isNaN(number)) {
            setGuess("");
        } else {
            setGuess(number.toString());
        }
    }

    function doConfirm(): void {
        const number = parseInt(guess);

        if (!Number.isNaN(number)) {
            setUserGuess(number);
        }
    }

    return (
        <div css={guessBoxStyle}>
            <input css={inputStyle} value={guess} onChange={validate} />
            <div style={{ flex: "0.05" }} />
            <PrimaryButton disabled={valid} onClick={doConfirm}>
                Guess
            </PrimaryButton>
        </div>
    );
};

interface IResultBoxProps {
    guess: number;
    actual: number;
}

const ResultBox: React.FC<IResultBoxProps> = ({ guess, actual }) => {
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

const scaleDuration = 1500;
const scale = keyframes`
    from, 0%, to {
        transform: scale(1);
        color: #e0f7fa;
    }

    100% {
        transform: scale(2);
        color: ${primaryColor};
    }
`;

const countupStyle = css({
    fontSize: "3rem",
    fontFamily: `"${serifFont}"`,
    color: `${primaryColor}`,
    fontWeight: "bold",
    margin: "3rem",
    animation: `${scale} ${scaleDuration}ms ease forwards`
});

interface ICountupProps {
    target: number;
}

const Countup: React.FC<ICountupProps> = ({ target }) => {
    const duration = scaleDuration;
    const stepTime = 80;
    const steps = Math.floor(duration / stepTime);
    let addSteps = Math.floor(target / steps);

    //quick fix
    if (addSteps === 0) addSteps = 1;

    const [value, setValue] = useState<number>(0);
    useEffect(() => {
        if (value <= target) {
            const newValue = value + addSteps;
            const timer = setTimeout(
                () => setValue(newValue > target ? target : newValue),
                stepTime
            );

            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <Center>
            <div css={countupStyle}>{value}</div>
        </Center>
    );
};

const ErrorComponent: React.FC<{ pkgName: string }> = ({ pkgName }) => {
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

const Heading: React.FC<{ name: string }> = ({ name }) => {
    const {
        appState: { gameMode, guesses, remaining }
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

const LoadingIndicator: React.FC = memo(() => {
    const bounce = keyframes`
        0%, 100% { 
            transform: scale(0.0);
        }
        50% { 
            transform: scale(1.0);
        }
    `;

    const sharedStyle: Interpolation = {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        opacity: 0.6,
        position: "absolute",
        top: 0,
        left: 0,
        animation: `${bounce} 2.0s infinite ease-in-out`
    };

    const style = css({
        [mq[0]]: {
            width: "40px",
            height: "40px",
            position: "relative",
            margin: "100px auto",
            "& div:nth-child(odd)": {
                ...sharedStyle,
                backgroundColor: primaryColor
            },
            "& div:nth-child(even)": {
                ...sharedStyle,
                backgroundColor: primaryColorLight,
                animationDelay: "-1s"
            }
        }
    });

    return (
        <Center>
            <div css={style}>
                <div></div>
                <div></div>
            </div>
        </Center>
    );
});

interface IPackageInfo {
    name: string;
    version: string;
    description: string;
    dependencies: number;
}

interface IGuessContext {
    guess: number | undefined;
    setUserGuess: (guess: number) => void;
}

const GuessContext = React.createContext<IGuessContext>({
    guess: undefined,
    setUserGuess: () => {}
});

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
            setLoading(false);
            //setError(true);
            setPkgInfo(data.get(pkgName)!);
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
                    <Countup target={pkgInfo.dependencies} />
                    <h2>Results</h2>
                    <ResultBox guess={userGuess} actual={pkgInfo.dependencies} />
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
