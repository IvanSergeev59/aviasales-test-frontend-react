import React, { Fragment } from "react";
import './content.scss';
import Filter from "../filter";

const Content = () => {
    return (
        <React.Fragment>
            <Filter />
            <Tickets />
        </React.Fragment>
    )
}

export default Content