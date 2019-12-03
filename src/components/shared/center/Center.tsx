/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const centerStyle = css({
    display: "flex",
    flex: 1,
    justifyContent: "center"
});

export const Center: React.FC = ({ children }) => {
    return <div css={centerStyle}>{children}</div>;
};
