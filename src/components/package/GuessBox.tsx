/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useRef, useState, useContext } from "react";

import { PrimaryButton } from "../shared/buttons/Buttons";
import { mq, serifFont, primaryColorDark } from "../../css";
import { IPackageInfo } from "./Package";

export interface IGuessContext {
    package: IPackageInfo;
    guess: number | undefined;
    setUserGuess: (guess: number) => void;
}

export const GuessContext = React.createContext<IGuessContext>({
    package: {
        name: "",
        version: "",
        dependencies: 0,
        distinctDependencies: 0,
        directDependencies: 0,
        description: "",
        dependencyTree: {
            dependencies: [],
            name: ``,
            version: ``,
            transitiveCount: 0,
            loop: false
        }
    },
    guess: undefined,
    setUserGuess: () => {}
});

interface IGuessBoxProps {
    value?: string;
}

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
        border: "1px solid #B39DDB",
        outline: "none",
        color: `${primaryColorDark}`,
        textAlign: "center"
    }
});

export const GuessBox: React.FC<IGuessBoxProps> = ({ value }) => {
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
            <input
                css={inputStyle}
                value={guess}
                type="text"
                pattern="[0-9]"
                inputMode="numeric"
                onChange={validate}
                autoFocus
            />
            <div style={{ flex: "0.05" }} />
            <PrimaryButton disabled={valid} onClick={doConfirm}>
                Guess
            </PrimaryButton>
        </div>
    );
};
