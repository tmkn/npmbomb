import * as React from "react";

import '../styles/main.css';

const Header: React.FC = () => <>
    <div className="header">
        <div className="innerheader container">
            <div className="logo">npmbomb</div>
            <div className="caption">Guess JavaScript dependencies</div>
        </div>
    </div>
</>;
const foo = {
    a: 3,
    b:2
}
const Footer: React.FC = () => <>
    <div className="footer">
        <div className="container">
        made with luv ❤️ by tmkn
        </div>
    </div>
</>;

const Main: React.FC = ({children}) => <>
    <div className="main">
        {children}
    </div>
</>;

const Home = () => <>
    <Header />
    <Main>
        <div className="container mx-auto text-center">
            <h1 className="font-medium text-3xl text-blue-500">NPM Bomb</h1>
            <p></p>
        </div>
    </Main>
    <Footer />
</>;

export default Home;