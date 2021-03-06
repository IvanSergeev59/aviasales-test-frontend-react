import React, { useContext, useEffect, useState } from "react";
import "./tickets-list.scss";
import { TabsContext } from "../../context/tabs/tabsContext";
import { FilterContext } from "../../context/filter/filterContext";

const TicketsList = () => {
    const {tickets, loading, loadingError, getTickets, sortTransfers, updatedTickets, buttonAddLoading} = useContext(TabsContext);  
    
    const {filters} = useContext(FilterContext);

    // counts of rendering tickets
    const [showTicketsLength, setAddTicketsLength] = useState(5);

    // show or hidden button whitch adding rendered tickets
    const [buttonShowed, setButtonHidden] = useState('showed');

    // based loaded tickets
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getTickets()}, []);

    // update rendering tickets - user change checkbox
    useEffect(() => {
        sortTransfers(tickets, filters); setButtonHidden('showed'); setAddTicketsLength(5) }, // eslint-disable-next-line react-hooks/exhaustive-deps 
        [filters]);  
   
    // rendering 1-5 tickets and if tickets arr has'nt more tickets, hidden button
    const onButtonAddTickets = () => {
        if (showTicketsLength<updatedTickets.length ) {setAddTicketsLength(showTicketsLength+5)} else {setButtonHidden('hidden')};
        if (showTicketsLength+5>updatedTickets.length) {setButtonHidden('hidden')}
    }

    const Ticket = () => {
        return (
        updatedTickets.slice(0,showTicketsLength).map(function(ticket, index)  {
            return (
                <li className="ticket" key={index}>
                    <div className ="ticket__header">
                        <p>{ticket.price} &#8381;</p>
                        <img className={ticket.carrier_logo} alt={ticket.carrier_logo}></img>
                    </div>
                    <div className="ticket__to-from">
                        <div className="ticket-block">
                            <p>{ticket.to_origin}-{ticket.to_destination}</p>
                            <p>{ticket.to_time_start_hour}:{ticket.to_time_start_min} -
                            {ticket.toFlyingTimes.hours}:{ticket.toFlyingTimes.mins}</p>
                        </div>
                        <div className="ticket-block">
                            <p>?? ????????</p>
                            <p>{ticket.to_hours}?? {ticket.to_mins}??</p>
                        </div>
                        <div className="ticket-block">
                            <p>{ticket.to_transfers.length}</p>
                            <p>{ticket.to_transfers.stops}</p>
                        </div>
                    </div>
                    <div className="ticket__to-from">
                        <div className="ticket-block">
                            <p>{ticket.back_origin}-{ticket.back_destination}</p>
                            <p>{ticket.back_time_start_hour}:{ticket.back_time_start_min}
                            - {ticket.backFlyingTimes.hours}:{ticket.backFlyingTimes.mins}</p>
                        </div>
                        <div className="ticket-block">
                            <p>?? ????????</p>
                            <p>{ticket.back_hours}?? {ticket.back_mins}??</p>
                        </div>
                        <div className="ticket-block">
                            <p>{ticket.back_transfers.length}</p>
                            <p>{ticket.back_transfers.stops}</p>
                        </div>
                    </div>                                      
                </li> 
                    
                )
            })
        )
    }
    const LoadingError = () => {
        return (                    
            <div>
                <h2 className={loadingError}>???????????????? ???????????????? ?????? ????????????????</h2>
                <button className={loadingError} onClick={() => getTickets()}>?????????????????? ????????????????</button>
            </div>
        )
    }
    const Loading = () => {
        return (
            <h2 className={loading}>???????? ????????????????...</h2>
        )
    }

    const Button = () => {
        let buttonClass = `${buttonAddLoading} ${buttonShowed}`
        return (
            <button className={buttonClass} onClick={() => onButtonAddTickets()}>???????????????? ?????? 5 ??????????????</button>
        )
    }
            
    return (
        <ul className="ticket__ul"> 
            <Loading />                        
            <LoadingError />
            <Ticket />
            <Button />
                            
        </ul>
    )                
            
              
}
export default TicketsList