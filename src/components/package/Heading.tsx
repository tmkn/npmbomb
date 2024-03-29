/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useContext } from "react";

import { AppContext } from "../../AppContext";
import { getNameVersion } from "../../Common";
import { mq, serifFont, primaryColor } from "../../css";

interface IPackageHeadingProps {
    packageName: string;
    scope: string | undefined;
}

export const PackageHeading: React.FC<IPackageHeadingProps> = ({ packageName, scope }) => {
    const {
        appState: { inGameMode: gameMode, guesses, remaining }
    } = useContext(AppContext);
    const headerStyle = css({
        [mq[0]]: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            paddingBottom: "1rem",
            "& h1": {
                flex: 1
            },
            "& span": {
                fontFamily: serifFont,
                color: primaryColor,
                marginRight: "1rem"
            },
            "& div": {
                display: "flex"
            }
        }
    });

    const current: number = guesses.length + 1;
    const all: number = guesses.length + remaining.length;
    const title: string = scope ? `${scope}/${packageName}` : packageName;
    const downloadUrl: string = scope
        ? `${scope}/${getNameVersion(packageName)[0]}`
        : getNameVersion(packageName)[0];

    return (
        <div css={headerStyle}>
            <h1>{title}</h1>
            {gameMode && (
                <span>
                    [{current}/{all}]
                </span>
            )}
            <div>
                <img src={`https://img.shields.io/npm/dw/${downloadUrl}?style=for-the-badge`} />
            </div>
        </div>
    );
};
