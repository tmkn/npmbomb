/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { sansSerifFont, primaryColorDark, secondaryColorLight, mq } from "../../../css";

const infoStyle = css({
    [mq[0]]: {
        display: "flex",
        flexDirection: "column",
        fontFamily: `"${sansSerifFont}"`,
        padding: "2rem",
        backgroundColor: `${secondaryColorLight}`,
        color: `${primaryColorDark}`,
        margin: 0,
        marginBottom: "2rem"
    }
});

export const Info: React.FC = ({ children }) => {
    return <div css={infoStyle}>{children}</div>;
};
