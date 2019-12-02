/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../css";

const style = css({
    margin: "0 auto",
    "font-size": "2rem",
    "font-family": "'Muli', sans-serif",
    height: "4rem",
    display: "flex",
    alignItems: "center",
    [mq[0]]: {
        maxWidth: "300px"
    },
    [mq[1]]: {
        maxWidth: "700px"
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
    "font-family": "'Roboto Slab', serif",
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
