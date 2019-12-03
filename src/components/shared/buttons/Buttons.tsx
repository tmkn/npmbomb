/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../../css";

const buttonStyle = css({
    [mq[0]]: {
        display: "flex",
        flex: 1,
        backgroundColor: "#9575cd",
        color: "white",
        fontFamily: "Open Sans",
        justifyContent: "center",
        padding: "0.5rem 0",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#673ab7"
        }
    },
    [mq[1]]: {
        width: "10vw",
        flex: "unset"
    },
    [mq[2]]: {}
});

interface IPrimaryButtonProps {
    onClick: () => void;
}

export const PrimaryButton: React.FC<IPrimaryButtonProps> = ({ children, onClick }) => {
    return (
        <div css={buttonStyle} onClick={onClick}>
            {children}
        </div>
    );
};
