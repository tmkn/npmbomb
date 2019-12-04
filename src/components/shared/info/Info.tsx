/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { sansSerifFont, primaryColorDark, secondaryColorLight } from "../../../css";

const infoStyle = css({
    fontFamily: `"${sansSerifFont}"`,
    padding: "2rem",
    backgroundColor: `${secondaryColorLight}`,
    color: `${primaryColorDark}`,
    margin: 0,
    marginBottom: "2rem"
});

export const Info: React.FC = ({ children }) => {
    return <p css={infoStyle}>{children}</p>;
};
