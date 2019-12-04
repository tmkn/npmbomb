/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Switch, Route, useRouteMatch, useParams, Redirect } from "react-router-dom";

import { mq, serifFont, primaryColor, textColor, primaryColorDark } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { ResultsTable, Num } from "../shared/results/Results";

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

interface IGuessBoxProps {
    value?: string;
}

const GuessBox: React.FC<IGuessBoxProps> = ({ value }) => {
    const initValue: string = value ?? "";
    const [guess, setGuess] = useState(initValue);
    const [valid, setValid] = useState(Number.isNaN(parseInt(initValue)));
    const { setUserGuess } = useContext(PackageContext);

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
            console.log(`guessed`, guess);
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
    return (
        <React.Fragment>
            <ResultsTable columns={2}>
                <div>Your Guess:</div>
                <Num>{guess}</Num>
                <div>Actual:</div>
                <Num>{actual}</Num>
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <div style={{ color: `${textColor}` }}>
                You were off by <Num>56</Num>
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
    number: number;
    target: number;
}

const Countup: React.FC<ICountupProps> = ({ number, target }) => {
    const duration = scaleDuration;
    const stepTime = 80;
    const steps = Math.floor(duration / stepTime);
    const addSteps = Math.floor(target / steps);

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

interface IPackageContext {
    guess: number | undefined;
    setUserGuess: (guess: number) => void;
}

const PackageContext = React.createContext<IPackageContext>({
    guess: undefined,
    setUserGuess: () => {}
});

const Package: React.FC = () => {
    const { pkgName } = useParams<{ pkgName: string }>();
    const [userGuess, setUserGuess] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);
    const context: IPackageContext = {
        guess: undefined,
        setUserGuess: value => setUserGuess(value)
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) return <div>loading</div>;

    return (
        <PackageContext.Provider value={context}>
            <h1>{pkgName}</h1>
            <Info>TypeScript is a language for application scale JavaScript development</Info>
            <h2>How many dependencies?</h2>
            <GuessBox />
            {typeof userGuess !== "undefined" && (
                <React.Fragment>
                    <Countup number={userGuess} target={758} />
                    <h2>Results</h2>
                    <ResultBox guess={userGuess} actual={569} />
                    <Center>
                        <PrimaryButton onClick={() => console.log(`todo next`)}>Next</PrimaryButton>
                    </Center>
                </React.Fragment>
            )}
        </PackageContext.Provider>
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
