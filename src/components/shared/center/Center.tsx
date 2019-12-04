/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../../css";

const centerStyle = css({
    [mq[0]]: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        "& a": {
            flex: 1
        }
    },
    [mq[1]]: {
        "& a": {
            flex: "unset"
        }
    }
});

export const Center: React.FC = ({ children }) => {
    return <div css={centerStyle}>{children}</div>;
};
