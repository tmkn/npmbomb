/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const infoStyle = css({
    fontFamily: "Open Sans",
    padding: "2rem",
    backgroundColor: "#e0f7fa",
    color: "#311B92",
    margin: 0,
    marginBottom: "2rem"
});

export const Info: React.FC = ({ children }) => {
    return <p css={infoStyle}>{children}</p>;
};
