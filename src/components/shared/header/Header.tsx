/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../../css";

const style = css({
    margin: "0 auto",
    fontSize: "2rem",
    fontFamily: "'Muli', sans-serif",
    height: "4rem",
    display: "flex",
    [mq[0]]: {
        maxWidth: "300px",
        flexDirection: "column",
        alignItems: "left",
        marginTop: "1rem"
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
    fontFamily: "'Roboto Slab', serif",
    fontWeight: 400
});

const Header: React.FC = () => {
    return (
        <div css={style}>
            <div css={titleStyle}>npmbomb</div>
            <div css={subTitleStyle}>Guess NPM dependencies</div>
        </div>
    );
};

export default Header;
