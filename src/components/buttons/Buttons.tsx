/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { mq } from "../../css";

export const PrimaryButton: React.FC = ({ children }) => {
    return <button>{children}</button>;
};
