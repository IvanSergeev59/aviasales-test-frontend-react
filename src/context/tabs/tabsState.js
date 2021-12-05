import React, { useReducer} from "react";
import { TabsContext } from './tabsContext';
import axios from 'axios'
import { tabsReducer } from "./tabsReducer";
import {CHANGE_TABS, FETCH_TICKETS, TICKETS_LOADED, FETCH_ERROR} from "../types";

export const TabsState = ({children}) => {
    const initialState = {
        tabsButtons : [ 'selected', 'unselected', 'unselected'],
        loading: 'f',
        ticketUrlId:'',
        loadingError:'hidden',
        tickets:[]
    }

    const [state, dispatch] = useReducer (tabsReducer, initialState);

    // tickets successfully loaded
    const loaded = () => dispatch(({type:TICKETS_LOADED}))

    // user change tabs button
    const onChangeTabs = (item) => dispatch(({type: CHANGE_TABS, payload: item}));  

    // calculation arrivet time 
    const calculateFlyingTime = (start, duration) => {
        const sum = Number(start)+Number(duration);
        return sum
    }

    const sortCheaper = (arr) => {

        arr.sort((a,b) => {
            return a.price - b.price
        })
        return arr
    }

    const sortFaster = (arr) => {
        arr.sort((a,b) => {
            return a.duration_sum - b.duration_sum
        })
        return arr
    }

    // calculation finish hours mins 
    const calculateFlyingHours = (start_hours, duration_hours, start_mins, duration_mins) => {
        let hours = calculateFlyingTime(start_hours, duration_hours);
       
        let mins = calculateFlyingTime(start_mins, duration_mins);
        let time ={hours,mins}
        const overmins = (time) => {
            if(time.mins > 59) {
               time.mins=(time.mins)%60;
               time.hours=time.hours +1;
              
               return time  ;                
                } return time         }
        time =overmins(time);
        if(time.hours>23) {time.hours = (time.hours)%24; console.log('ololo')}
        if(time.hours < 10) {time.hours = '0' + time.hours}
        if(time.mins < 10) { time.mins = '0' + time.mins}
        return time
    }   

    //
    const transfers__length_func = (tickets) => {
        let transfers ={};
        
        const transfers_length = (transfers) => {
            if (transfers.length === 0) {
               return {
                   length: 'БЕЗ ПЕРЕСАДОК',
                   stops: ''
               }
            }
            if (transfers.length === 1) {
                return {
                    length: '1 ПЕРЕСАДКА',
                    stops: transfers[0]
 
                }
            }
            if (transfers.length === 2) {
                return {
                    length: `${transfers.length} ПЕРЕСАДКИ`,
                    stops: transfers[0] + ', ' + transfers[1]
                }
            }
            if (transfers.length === 3) {
                return {
                    length: `${transfers.length} ПЕРЕСАДКИ`,
                    stops: transfers[0] + ', ' + transfers[1] + ', ' + transfers[2] 
                }
            }
        }
        transfers.to = transfers_length(tickets.segments[0].stops);
        transfers.back = transfers_length(tickets.segments[1].stops);
        return transfers
    }

    const getTickets = async () => {
        axios.get('https://front-test.beta.aviasales.ru/search')
        .then((res) => {
           
            return res.data.searchId
        })
        .catch((error) => {
            dispatch(({type: FETCH_ERROR, payload: error}))
        })
       
        .then((res) => {
            
            axios.get(`https://front-test.beta.aviasales.ru/tickets?searchId=${res}`)
            
        .catch((error) => {
            
            dispatch(({type: FETCH_ERROR, payload: error}))
        })
            .then((res) => {
               loaded()
                let ticketList = res.data.tickets.map(function(ticket) {
                    let duration_to_hours = Math.floor((ticket.segments[0].duration)/60);
                    let duration_to_mins = (ticket.segments[0].duration)%60;
                    let duration_back_hours = Math.floor((ticket.segments[1].duration)/60);
                    let duration_back_mins = (ticket.segments[1].duration)%60;
                    let to_time_start_hour = ticket.segments[0].date.substr(ticket.segments[0].date.indexOf('T')+1,2);
                    let to_time_start_min = ticket.segments[0].date.substr(ticket.segments[0].date.indexOf('T')+4,2);
                    let back_time_start_hour = ticket.segments[0].date.substr(ticket.segments[1].date.indexOf('T')+1,2);
                    let back_time_start_min = ticket.segments[0].date.substr(ticket.segments[1].date.indexOf('T')+4,2);
                    let toFlyingTimes = calculateFlyingHours(to_time_start_hour, duration_to_hours,
                        to_time_start_min, duration_to_mins);
                    let backFlyingTimes = calculateFlyingHours(back_time_start_hour, duration_back_hours,
                        back_time_start_min, duration_back_mins);
                    let transfers = transfers__length_func(ticket);
                    let duration_sum = ticket.segments[0].duration + ticket.segments[1].duration

                    return {
                        price: ticket.price,
                        carrier_logo: ticket.carrier,
                        to_origin: ticket.segments[0].origin,
                        to_destination: ticket.segments[0].destination,
                        back_origin: ticket.segments[1].origin,
                        back_destination: ticket.segments[1].origin,
                        to_hours: duration_to_hours,
                        to_mins: duration_to_mins,
                        back_hours: duration_back_hours,
                        back_mins: duration_back_mins,
                        duration_sum,
                        to_transfers: transfers.to,
                       
                        back_transfers: transfers.back,
                        to_time_start_hour: to_time_start_hour,
                        to_time_start_min: to_time_start_min,
                        backFlyingTimes,
                        toFlyingTimes,
                        back_time_start_hour,
                        back_time_start_min,
                        
                    }
                }
                )
              
                console.log(ticketList)
                const ololo = sortFaster(ticketList);
                console.log(ololo)
                dispatch(({type: FETCH_TICKETS, payload: ololo}));
            })
           
        })
       
    }


    const {tabsButtons, tickets, loading, loadingError} = state;

    return (
        <TabsContext.Provider value={{tabsButtons, onChangeTabs, getTickets, tickets, loading, loadingError}}>
            {children}
        </TabsContext.Provider>
    )
}