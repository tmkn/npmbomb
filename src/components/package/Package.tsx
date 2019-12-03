/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useRef, useState, useEffect } from "react";
import { Switch, Route, useRouteMatch, useParams, Redirect } from "react-router-dom";

import { mq } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/Info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { ResultsTable, Number } from "../shared/results/Results";

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
        fontFamily: "Roboto Slab",
        maxWidth: "5rem",
        border: "1px solid #EDE7F6",
        outline: "none",
        color: "#311B92",
        textAlign: "center"
    }
});

const GuessBox: React.FC = () => {
    return (
        <div css={guessBoxStyle}>
            <input css={inputStyle} />
            <div style={{ flex: "0.05" }} />
            <PrimaryButton onClick={() => console.log("guessed")}>Guess</PrimaryButton>
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
                <Number>{guess}</Number>
                <div>Actual:</div>
                <Number>{actual}</Number>
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <div style={{ color: "#616161" }}>
                You were off by <Number>56</Number>
            </div>
        </React.Fragment>
    );
};

const scaleDuration = 1500;
const scale = keyframes`
    from, 0%, to {
        transform: scale(1);
    }

    100% {
        transform: scale(2);
    }
`;

const countupStyle = css({
    fontSize: "3rem",
    fontFamily: "Roboto Slab",
    color: "#673AB7",
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

const Package: React.FC = () => {
    let { pkgName } = useParams<{ pkgName: string }>();

    return (
        <React.Fragment>
            <h1>{pkgName}</h1>
            <Info>TypeScript is a language for application scale JavaScript development</Info>
            <h2>How many dependencies?</h2>
            <GuessBox />
            <Countup number={548} target={758} />
            <h2>Results</h2>
            <ResultBox guess={123} actual={569} />
            <Center>
                <PrimaryButton onClick={() => console.log(`todo next`)}>Next</PrimaryButton>
            </Center>
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
