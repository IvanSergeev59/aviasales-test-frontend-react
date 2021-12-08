import React, { useReducer} from "react";
import { TabsContext } from './tabsContext';
import axios from 'axios'
import { tabsReducer } from "./tabsReducer";
import {CHANGE_TABS, FETCH_TICKETS, TICKETS_LOADED, FETCH_ERROR, UPDATE_TICKETS} from "../types";

export const TabsState = ({children}) => {
    const initialState = {
        tabsButtons : [ 'selected', 'unselected', 'unselected'],
        tabId: '0',
        loading: 'f',
        ticketUrlId:'',
        loadingError:'hidden',
        tickets:[], 
        updatedTickets:[],
        buttonAddLoading: 'hidden'
    }

    const [state, dispatch] = useReducer (tabsReducer, initialState);

    // tickets successfully loaded
    const loaded = () => dispatch(({type:TICKETS_LOADED}))

    // user change tabs button
    const onChangeTabs = (item) =>  {
    dispatch(({type: CHANGE_TABS, payload: item})); 
    sorting[item](updatedTickets)
    }

    // calculation arrived time 
    const calculateFlyingTime = (start, duration) => {
        const sum = Number(start)+Number(duration);
        return sum
    }
    // sorting tickets by cost
    const sortCheaper = (arr) => {

        arr.sort((a,b) => {
            return a.price - b.price
        })
        dispatch(({type: UPDATE_TICKETS, payload: arr}))
    }
    // sorting tickets by duration
    const sortFaster = (arr) => {
        arr.sort((a,b) => {
            return a.duration_sum - b.duration_sum
        })
        dispatch(({type: UPDATE_TICKETS, payload: arr}))
    }

    // sorting tickets by cost and duration
    const sortCheapAndFast = (arr) => {
        sortCheaper(arr);       
        dispatch(({type: UPDATE_TICKETS, payload: arr}))
    }

    const sortTransfers = (arr, filters) => {
        let sortedArr = arr;
            if (filters[0]==="selected"){             
            sortedArr = arr;       }     
            else {
            if (filters[1] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="БЕЗ ПЕРЕСАДОК" || item.back_transfers.length==="БЕЗ ПЕРЕСАДОК"));                
            }  
            if (filters[2] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="1 ПЕРЕСАДКА" || item.back_transfers.length==="1 ПЕРЕСАДКА"));                
            }  
            if (filters[3] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="2 ПЕРЕСАДКИ" || item.back_transfers.length==="2 ПЕРЕСАДКИ"));                
            }  
            if (filters[4] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="3 ПЕРЕСАДКИ" || item.back_transfers.length==="3 ПЕРЕСАДКИ"));                
            }           

        }
        sorting[tabId](sortedArr);
        dispatch(({type: UPDATE_TICKETS, payload: sortedArr}))
        
    }
    
    // calculation finish hours mins 
    const calculateFlyingHours = (start_hours, duration_hours, start_mins, duration_mins) => {
        let hours = calculateFlyingTime(start_hours, duration_hours);       
        let mins = calculateFlyingTime(start_mins, duration_mins);
        let time ={hours,mins}        
        if(time.mins > 59) {
            time.mins=(time.mins)%60;
            time.hours=time.hours +1;
        }        
        if(time.hours>23) {time.hours = (time.hours)%24;}
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
                })
                
                sortCheaper(ticketList);
                
                dispatch(({type: FETCH_TICKETS, payload: ticketList}));
            })
           
        })
       
    }


    const {tabsButtons, tickets, loading, loadingError, updatedTickets, tabId, buttonAddLoading} = state;
    const sorting = [sortCheaper, sortFaster, sortCheapAndFast]
    return (
        <TabsContext.Provider value={{tabsButtons, onChangeTabs, getTickets, tickets, loading, loadingError, sorting, updatedTickets, sortTransfers, tabId, buttonAddLoading}}>
            {children}
        </TabsContext.Provider>
    )
}