/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { mq, sansSerifFont, textColor, secondaryColor } from "../../../css";
import { TextLink } from "../link/TextLink";

const footerStyle = css({
    [mq[0]]: {
        display: "flex",
        fontFamily: `"${sansSerifFont}"`,
        fontSize: "1rem",
        justifyContent: "center",
        marginTop: "4rem",
        marginBottom: "2rem",
        color: `${textColor}`,
        "& a": {
            textDecoration: "underline",
            textDecorationColor: secondaryColor
        }
    }
});

const Footer: React.FC = () => {
    return (
        <div css={footerStyle}>
            <span>
                hecho con ♥️ por <TextLink href="https://twitter.com/tmkndev">@tmkndev</TextLink>
            </span>
        </div>
    );
};

export default Footer;
