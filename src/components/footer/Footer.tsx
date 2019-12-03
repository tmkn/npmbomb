/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../css";

const footerStyle = css({
    display: "flex",
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "0.8rem",
    justifyContent: "center",
    marginTop: "4rem",
    marginBottom: "2rem",
    color: "#616161"
});

const Footer: React.FC = () => {
    return (
        <div css={footerStyle}>
            <span>@tmkndev</span>
        </div>
    );
};

export default Footer;
