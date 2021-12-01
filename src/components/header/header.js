import React from "react";
import "./header.scss";
import logo from '../../images/logo.png';

const Header = () => {
    return (
        <header>
            <img src={logo} alt="logo"/>
        </header>
    )
}

export default Header