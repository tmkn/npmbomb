/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useRef, useState, useContext, useEffect } from "react";

import { PrimaryButton } from "../../shared/buttons/Buttons";
import { mq, serifFont, primaryColorDark, monospaceFont } from "../../../css";
import { GuessContext } from "./GuessContext";

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

export const GuessInput: React.FC = () => {
    const initValue: string = "";
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

    function submitOnEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") doConfirm();
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
                onKeyUp={submitOnEnter}
                autoFocus
            />
            <div style={{ flex: "0.05" }} />
            <PrimaryButton disabled={valid} onClick={doConfirm}>
                Guess
            </PrimaryButton>
        </div>
    );
};
