/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { mq } from "../../../css";

const dividerStyle = css({
    [mq[0]]: {
        height: "0px",
        borderBottom: "1px solid #ececec",
        display: "flex",
        flex: 1
    }
});

interface IDividerProps {
    margin: string;
}

export const Divider: React.FC<IDividerProps> = ({ margin }) => (
    <div css={dividerStyle} style={{ margin }}></div>
);
