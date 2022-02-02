/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { mq } from "../../../css";

const style = css({
    margin: "0 auto",
    [mq[0]]: {
        maxWidth: "300px"
    },
    [mq[1]]: {
        maxWidth: "700px"
    },
    [mq[2]]: {
        maxWidth: "900px"
    }
});

const Content: React.FC = ({ children }) => {
    return <div css={style}>{children}</div>;
};

export default Content;
