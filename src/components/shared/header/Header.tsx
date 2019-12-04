/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Link } from "react-router-dom";

import { mq, serifFont, headerFont } from "../../../css";

const style = css({
    [mq[0]]: {
        maxWidth: "300px",
        flexDirection: "column",
        alignItems: "left",
        marginTop: "1rem",
        margin: "0 auto",
        fontSize: "2rem",
        fontFamily: `"${headerFont}"`,
        height: "4rem",
        display: "flex",
        "& a": {
            flex: 1,
            color: "black"
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
    flex: 1
});

const subTitleStyle = css({
    fontSize: "1rem",
    flex: 1,
    fontFamily: `"${serifFont}"`,
    fontWeight: 400
});

const Header: React.FC = () => {
    return (
        <div css={style}>
            <Link to="/">
                <div css={titleStyle}>npmbomb</div>
            </Link>
            <div css={subTitleStyle}>Guess NPM dependencies</div>
        </div>
    );
};

export default Header;
