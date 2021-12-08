import React, { useReducer} from "react";
import { TabsContext } from './tabsContext';
import axios from 'axios'
import { tabsReducer } from "./tabsReducer";
import {CHANGE_TABS, FETCH_TICKETS, TICKETS_LOADED, FETCH_ERROR, UPDATE_TICKETS} from "../types";

export const TabsState = ({children}) => {
    const initialState = {
        tabsButtons : [ 'selected', 'unselected', 'unselected'],
        tabId: '0',
        loading: 'showed',
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

    //after changing tabs sorting tickets again
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

    //sorting tickets by choosen chackboxes
    const sortTransfers = (arr, filters) => {
        let sortedArr = arr;
            // choosen all transfer checkboxes
            if (filters[0]==="selected"){sortedArr = arr;}     

            else {

            // remove tickets without transfers    
            if (filters[1] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="БЕЗ ПЕРЕСАДОК" || item.back_transfers.length==="БЕЗ ПЕРЕСАДОК"));                
            }  

            // remove tickets with 1 transfer
            if (filters[2] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="1 ПЕРЕСАДКА" || item.back_transfers.length==="1 ПЕРЕСАДКА"));                
            }  

            // remove tickets with 2 transfer
            if (filters[3] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="2 ПЕРЕСАДКИ" || item.back_transfers.length==="2 ПЕРЕСАДКИ"));                
            }  

            // remove tickets with 3 transfer
            if (filters[4] === 'unselected') {
                sortedArr = sortedArr.filter((item) => !(item.to_transfers.length==="3 ПЕРЕСАДКИ" || item.back_transfers.length==="3 ПЕРЕСАДКИ"));                
            }           

        }
        
        //sorting tickets by choosen tab
        sorting[tabId](sortedArr);

        //dispatch sorted tickets by transfers and tabs
        dispatch(({type: UPDATE_TICKETS, payload: sortedArr}))
        
    }
    
    // calculation finish hours mins 
    const calculateFlyingHours = (start_hours, duration_hours, start_mins, duration_mins) => {
        // get summ flying hours 
        let hours = calculateFlyingTime(start_hours, duration_hours);    
        
        //get summ flying minutes
        let mins = calculateFlyingTime(start_mins, duration_mins);

        
        let time ={hours, mins}        

        // if minutes more than 59 add 1 hour to summ time
        if(time.mins > 59) {
            time.mins=(time.mins)%60;
            time.hours=time.hours +1;
        }        

        // arrived at next day
        if(time.hours>23) {time.hours = (time.hours)%24;}

        // add '0' to displayed hours
        if(time.hours < 10) {time.hours = '0' + time.hours}

        // add '0' to displayed minutes
        if(time.mins < 10) { time.mins = '0' + time.mins}
        return time
    }   

    // transform transfers lentgh to displayed text
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

        // forward fly counts of transfers
        transfers.to = transfers_length(tickets.segments[0].stops);

        // back fly counts of transfers
        transfers.back = transfers_length(tickets.segments[1].stops);
        return transfers
    }

    // getting starting tickets from server
    const getTickets = async () => {

        // get uniq id for next get fetch
        axios.get('https://front-test.beta.aviasales.ru/search')
        .then((res) => {
           
            return res.data.searchId
        })
        .catch((error) => {
            dispatch(({type: FETCH_ERROR, payload: error}))
        })
        // get arr with all tickets from server
        .then((res) => {            
            axios.get(`https://front-test.beta.aviasales.ru/tickets?searchId=${res}`)
            
        .catch((error) => {
            
            dispatch(({type: FETCH_ERROR, payload: error}))
        })
            
            .then((res) => {
               loaded()
                // transform getted arr with all tickets 
                let ticketList = res.data.tickets.map(function(ticket) {

                    //getting duration of forward fly in hours
                    let duration_to_hours = Math.floor((ticket.segments[0].duration)/60);
                    //getting duration of forward fly in minutes
                    let duration_to_mins = (ticket.segments[0].duration)%60;

                    //getting duration of back fly in hours
                    let duration_back_hours = Math.floor((ticket.segments[1].duration)/60);

                    //getting duration of back fly in minutes
                    let duration_back_mins = (ticket.segments[1].duration)%60;

                    //getting start hours of forward fly from tickets arr
                    let to_time_start_hour = ticket.segments[0].date.substr(ticket.segments[0].date.indexOf('T')+1,2);

                    //getting start minutes of forward fly from tickets arr
                    let to_time_start_min = ticket.segments[0].date.substr(ticket.segments[0].date.indexOf('T')+4,2);

                    //getting start hours of back fly from tickets arr
                    let back_time_start_hour = ticket.segments[0].date.substr(ticket.segments[1].date.indexOf('T')+1,2);

                    //getting start minutes of back fly from tickets arr
                    let back_time_start_min = ticket.segments[0].date.substr(ticket.segments[1].date.indexOf('T')+4,2);

                    // getting an object with duration hours and minutes of forward fly
                    let toFlyingTimes = calculateFlyingHours(to_time_start_hour, duration_to_hours,
                        to_time_start_min, duration_to_mins);

                     // getting an object with duration hours and minutes of back fly
                    let backFlyingTimes = calculateFlyingHours(back_time_start_hour, duration_back_hours,
                        back_time_start_min, duration_back_mins);

                    //getting an object of forward and back transfers: counts of transfers and transfers points
                    let transfers = transfers__length_func(ticket);
                    

                    return {
                        //ticket price
                        price: ticket.price,

                        //flying company logo
                        carrier_logo: ticket.carrier,

                        //city of forward fly
                        to_origin: ticket.segments[0].origin,

                        //destination city of forward fly
                        to_destination: ticket.segments[0].destination,

                        //city of back fly
                        back_origin: ticket.segments[1].origin,

                        //destination city of back fly
                        back_destination: ticket.segments[1].origin,

                        //hours duration of forward fly
                        to_hours: duration_to_hours,

                        //minutes duration of forward fly
                        to_mins: duration_to_mins,

                        //hours duration of forward fly
                        back_hours: duration_back_hours,

                        //minutes duration of forward fly
                        back_mins: duration_back_mins,

                        // sum of forward and back flying time
                        duration_sum: ticket.segments[0].duration + ticket.segments[1].duration,

                        //object of forward transfers: counts of transfers and transfers points
                        to_transfers: transfers.to,   

                        //object of back transfers: counts of transfers and transfers points
                        back_transfers: transfers.back,

                        //start hours of forward fly
                        to_time_start_hour: to_time_start_hour,

                        //start minutes of forward fly
                        to_time_start_min: to_time_start_min,

                        //start hours of back fly
                        back_time_start_hour,

                        //start minutes of back fly
                        back_time_start_min,

                        // object with duration hours and minutes of forward fly
                        toFlyingTimes,

                        // object with duration hours and minutes of back fly
                        backFlyingTimes,                
                        
                    }
                })
                
                // firstly sorting tickets by cheap price
                sortCheaper(ticketList);
                
                dispatch(({type: FETCH_TICKETS, payload: ticketList}));
            })
           
        })
       
    }


    const {tabsButtons, tickets, loading, loadingError, updatedTickets, tabId, buttonAddLoading} = state;

    //3 types of sorting
    const sorting = [sortCheaper, sortFaster, sortCheapAndFast];

    return (
        <TabsContext.Provider value={{tabsButtons, onChangeTabs, getTickets, tickets, loading, loadingError, sorting, updatedTickets, sortTransfers, tabId, buttonAddLoading}}>
            {children}
        </TabsContext.Provider>
    )
}