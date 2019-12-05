/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useRef, useState, useContext, useEffect } from "react";

import { primaryColor, serifFont } from "../../css";
import { Center } from "../shared/center/Center";

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

export const CountUp: React.FC<ICountupProps> = ({ target }) => {
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
