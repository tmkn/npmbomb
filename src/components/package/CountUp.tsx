/** @jsx jsx */
import { jsx, css, keyframes, SerializedStyles } from "@emotion/core";
import React, { useRef, useState, useContext, useEffect, memo } from "react";

import { primaryColor, serifFont, mq, secondaryColor, secondaryColorLight, monospaceFont } from "../../css";
import { Center } from "../shared/center/Center";

function getBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function getString(options: string[]): string {
    const index = Math.floor(getBetween(0, options.length));

    return options[index];
}

const confettiColors = ["#ffeb3b", "#ff5722", "#cddc39", "#03a9f4"];

interface IOffset {
    left: number;
    top: number;
}

function randomizeStyle({ left, top }: IOffset): SerializedStyles {
    const fade = keyframes`
        0% {
            opacity: 1;
            transform: scale(0) rotateZ(${getBetween(60, 90)}deg);
        }

        100% {
            opacity: 0;
            transform: scale(3) rotateZ(${getBetween(90, 120)}deg) translateX(-200px);
        }
    `;

    const size = `${getBetween(6, 18)}px`;

    return css({
        [mq[0]]: {
            position: "absolute",
            opacity: 0,
            top: `${getBetween(top, top + 50)}px`,
            left: `${getBetween(left - 80, left + 80)}px`,
            width: size,
            height: size,
            backgroundColor: getString(confettiColors),
            borderRadius: "20%",
            animation: `${fade} ${getBetween(1000, 2500)}ms ease-out forwards`,
            animationDelay: `${getBetween(scaleDuration - 100, scaleDuration + 600)}ms`,
            mixBlendMode: "normal"
        }
    });
}

interface IBubbleProps {
    anchor: React.RefObject<HTMLElement>;
}

const Bubble: React.FC<IBubbleProps> = memo(({ anchor }) => {
    let offset: IOffset = {
        top: 0,
        left: 0
    };

    if (anchor.current) {
        const { left, top } = anchor.current.getBoundingClientRect();

        offset = {
            left,
            top
        };
    }

    return <div css={randomizeStyle(offset)}></div>;
});

interface IBubblesProps {
    amount: number;
    anchor: React.RefObject<HTMLElement>;
}

const Bubbles: React.FC<IBubblesProps> = memo(({ amount, anchor }) => {
    const bubbles: JSX.Element[] = [];

    for (let i = 0; i < amount; i++) bubbles.push(<Bubble key={i} anchor={anchor} />);

    return <React.Fragment>{bubbles}</React.Fragment>;
});

export const scaleDuration = 1500;
const scale = keyframes`
    from, 0%, to {
        transform: scale(1);
        color: ${secondaryColorLight};
    }

    100% {
        transform: scale(2);
        color: ${primaryColor};
    }
`;

const countupStyle = css({
    [mq[0]]: {
        fontSize: "2rem",
        fontFamily: `${monospaceFont}`,
        color: `${primaryColor}`,
        fontWeight: "bold",
        margin: "1rem",
        animation: `${scale} ${scaleDuration}ms ease forwards`
    }
});

interface ICountupProps {
    target: number;
    userGuess: number;
}

export const CountUp: React.FC<ICountupProps> = ({ target, userGuess }) => {
    const [value, setValue] = useState<number>(0);
    const counterRef = useRef<HTMLDivElement>(null);
    const [rendered, setRendered] = useState(false);

    const duration = scaleDuration;
    const stepTime = 80;
    const steps = Math.floor(duration / stepTime);
    let addSteps = Math.floor(target / steps);

    //quick fix
    if (addSteps === 0) addSteps = 1;

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

    useEffect(() => setRendered(true), []);

    return (
        <Center>
            <div ref={counterRef} css={countupStyle}>
                {value}
            </div>
            {rendered === true && target === userGuess && (
                <Bubbles amount={40} anchor={counterRef} />
            )}
        </Center>
    );
};
