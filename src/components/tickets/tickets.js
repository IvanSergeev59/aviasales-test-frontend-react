import React from "react";
import "./tickets.scss";
import Tabs from "../tabs";
import TicketsList from "../tickets-list";
const Tickets = () => {
    return (
        <section className="tickets">
            <Tabs />
            <TicketsList />
        </section>
    )
}
export default Tickets