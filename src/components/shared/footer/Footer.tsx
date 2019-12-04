/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq, sansSerifFont, textColor } from "../../../css";

const footerStyle = css({
    display: "flex",
    fontFamily: `"${sansSerifFont}"`,
    fontSize: "0.8rem",
    justifyContent: "center",
    marginTop: "4rem",
    marginBottom: "2rem",
    color: `${textColor}`
});

const Footer: React.FC = () => {
    return (
        <div css={footerStyle}>
            <span>@tmkndev</span>
        </div>
    );
};

export default Footer;
