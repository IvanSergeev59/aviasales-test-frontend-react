import React, { useContext, useEffect } from "react";
import "./tickets-list.scss";
import { TabsContext } from "../../context/tabs/tabsContext";


const TicketsList = () => {
    const {getTickets} = useContext(TabsContext);

    useEffect(() => {
        getTickets()}, []);

    const Ticket = () =>  {
        const {tickets, loading, loadingError} = useContext(TabsContext)
      
        
        
            const onTickets = () => {
                getTickets();
                
            }
           

            const TicketListContainer = () =>{
                return (
               <React.Fragment>
                <button onClick={onTickets} />
                                        {loadingError
                                        ?
                                        <h2>Возникла проблема при загрузке</h2>
                                        :<div>
                                            {!loading && !loadingError
                                                ?
                                                tickets.slice(0,5).map(function(ticket, index)  {
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
                                                            <p>В ПУТИ</p>
                                                            <p>{ticket.to_hours}ч {ticket.to_mins}м</p>
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
                                                            <p>В ПУТИ</p>
                                                            <p>{ticket.back_hours}ч {ticket.back_mins}м</p>
                                                        </div>
                                                        <div className="ticket-block">
                                                            <p>{ticket.back_transfers.length}</p>
                                                            <p>{ticket.back_transfers.stops}</p>
                                                        </div>
                                                        </div>
                                                    
                                                
                                                        </li>
                                                    )
                                                })
                                                    : <h2>ИДЕТ ЗАГРУЗКА...</h2>
                                                }
                                                </div>
                                        }
                           
                                        
                             
                  </React.Fragment>
                )
                                    }
                                        return (
                                            <TicketListContainer />
            )
            
       
    }
    return (
        <ul className="ticket__ul">
            
            <Ticket />
        </ul>

    )
}

export default TicketsList