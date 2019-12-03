/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const dividerStyle = css({
    height: "0px",
    borderBottom: "1px solid #ececec",
    display: "flex",
    flex: 1
});

interface IDividerProps {
    margin: string;
}

export const Divider: React.FC<IDividerProps> = ({ margin }) => (
    <div css={dividerStyle} style={{ margin }}></div>
);
