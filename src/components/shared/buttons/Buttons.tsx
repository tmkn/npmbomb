/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq, sansSerifFont, primaryColor, primaryColorLight } from "../../../css";

const buttonStyle = css({
    [mq[0]]: {
        display: "flex",
        flex: 1,
        backgroundColor: `${primaryColorLight}`,
        color: "white",
        fontFamily: `"${sansSerifFont}"`,
        justifyContent: "center",
        padding: "0.5rem 0",
        cursor: "pointer",
        ":hover": {
            backgroundColor: `${primaryColor}`
        }
    },
    [mq[1]]: {
        width: "10vw",
        flex: "unset"
    },
    [mq[2]]: {}
});

interface IPrimaryButtonProps {
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
}

export const PrimaryButton: React.FC<IPrimaryButtonProps> = ({ children, onClick, disabled }) => {
    const isDisabled = disabled ?? false;

    const disabledStyle = css({
        [mq[0]]: {
            backgroundColor: "#e8eaf6",
            ":hover": {
                backgroundColor: "#e8eaf6"
            }
        }
    });

    const styles = [buttonStyle];
    if (isDisabled) styles.push(disabledStyle);

    function onClickImpl(e: React.MouseEvent<HTMLDivElement>) {
        if (!isDisabled && onClick) onClick(e);
    }

    return (
        <div css={styles} onClick={onClickImpl}>
            {children}
        </div>
    );
};
