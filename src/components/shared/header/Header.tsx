/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";

import { mq, serifFont, headerFont, secondaryColor } from "../../../css";

const style = css({
    [mq[0]]: {
        maxWidth: "300px",
        flexDirection: "column",
        alignItems: "left",
        margin: "1rem auto 0",
        fontSize: "2rem",
        fontFamily: `"${headerFont}"`,
        height: "4rem",
        display: "flex",
        "& a": {
            flex: 1,
            color: secondaryColor
        }
    },
    [mq[1]]: {
        maxWidth: "700px",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 0
    },
    [mq[2]]: {
        maxWidth: "900px"
    }
});

const titleStyle = css({
    [mq[0]]: {
        flex: 1
        /*WebkitTextStroke: "1px black",
        WebkitTextFillColor: "white"*/
        /*background: "linear-gradient(to right, cyan, orange)",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        WebkitBackgroundClip: "text"*/
    }
});

const subTitleStyle = css({
    [mq[0]]: {
        fontSize: "1rem",
        flex: 1,
        fontFamily: `"${serifFont}"`,
        fontWeight: 400
    }
});

const bombStyle = css({
    [mq[0]]: {
        fontSize: "1.6rem"
    }
});

const Header: React.FC = () => {
    return (
        <div css={style}>
            <Link to="/">
                <div css={titleStyle}>
                    npmb<span css={bombStyle}>💣</span>mb
                </div>
            </Link>
            <div css={subTitleStyle}>Guess NPM dependencies</div>
        </div>
    );
};

export default Header;
