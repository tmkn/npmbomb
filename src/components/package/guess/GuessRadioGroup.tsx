/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useRef, useState, useContext, useEffect } from "react";
import shuffle from "lodash.shuffle";

import { PrimaryButton } from "../../shared/buttons/Buttons";
import { mq, serifFont, primaryColorDark, monospaceFont } from "../../../css";
import { LoadingIndicator } from "../../shared/loading/LoadingIndicator";
import { fetchAvailablePackages } from "../../index/Index";
import { ErrorBanner } from "../ErrorComponent";
import { GuessContext } from "./GuessContext";
import { getPackageInfo } from "../PackageData";

export const GuessRadioGroup: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [choices, setChoices] = useState<Set<string>>(new Set());
    const [guess, setGuess] = useState<string | undefined>();
    const { setUserGuess, package: pkgInfo } = useContext(GuessContext);

    const style = css({
        [mq[0]]: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`
        }
    });

    const radioStyle = css({
        [mq[0]]: {
            display: `flex`,
            color: primaryColorDark,
            fontFamily: monospaceFont,
            fontSize: `1.2rem`,
            alignItems: `center`,
            whiteSpace: `pre`
        }
    });

    const paddingStyle = css({
        [mq[0]]: {
            marginTop: `1rem`
        }
    });

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                const packages = await fetchAvailablePackages();
                const randomPackages = shuffle(packages).slice(0, 3);
                const packageInfos = await Promise.all(
                    randomPackages.map(pkg => getPackageInfo(pkg, undefined))
                );
                const choices = new Set(packageInfos.map(info => info.dependencies.toString()));
                setChoices(new Set(shuffle([pkgInfo.dependencies.toString(), ...choices])));

                setIsLoading(false);
            } catch {
                setIsLoading(false);
                setIsError(true);
            }
        })();
    }, [`${pkgInfo.name}@${pkgInfo.version}`]);

    function doConfirm(): void {
        if (typeof guess !== "undefined") {
            const number = parseInt(guess);

            if (!Number.isNaN(number)) {
                setUserGuess(number);
            }
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setGuess(e.target.value);
    }

    function submitOnEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") doConfirm();
    }

    if (isLoading) return <LoadingIndicator />;

    if (isError) return <ErrorBanner>Something went wrong</ErrorBanner>;

    const padding: number = [pkgInfo.dependencies.toString(), ...choices].reduce(
        (prev, current) => (current.length > prev ? current.length : prev),
        0
    );

    return (
        <React.Fragment>
            <div css={style} onKeyUp={submitOnEnter}>
                {[...choices].map((option, i) => {
                    const key = `count${option}${i}`;

                    return (
                        <div key={key} css={radioStyle}>
                            <input
                                id={key}
                                type="radio"
                                name="count"
                                value={option}
                                onChange={onChange}
                            />
                            <label htmlFor={key}>{option.padStart(padding)}</label>
                        </div>
                    );
                })}
            </div>
            <div css={[style, paddingStyle]}>
                <PrimaryButton disabled={isLoading} onClick={doConfirm}>
                    Guess
                </PrimaryButton>
            </div>
        </React.Fragment>
    );
};
