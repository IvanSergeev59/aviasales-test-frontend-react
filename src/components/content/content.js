import React from "react";
import './content.scss';
import Filter from "../filter";
import Tickets from "../tickets";

const Content = () => {
    return (
        <section className="content" >
            <Filter/>
            <Tickets />
        </section>
    )
}

export default Content