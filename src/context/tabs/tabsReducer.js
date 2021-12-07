import { CHANGE_TABS,FETCH_TICKETS,FETCH_URL_ID, TICKETS_LOADED, FETCH_ERROR, UPDATE_TICKETS } from "../types";

const handlers = {
    [CHANGE_TABS]: (state, {payload}) => {
        const buttonList = state.tabsButtons.slice(0);
        buttonList[0]='unselected';
        buttonList[1]='unselected';
        buttonList[2]='unselected';
        buttonList[payload] = 'selected'

      return (        
        {...state, tabsButtons:buttonList}        
        )
      }
        ,
      [FETCH_TICKETS]: (state, {payload}) => {
        return (
          {...state, tickets: payload}
        )
      },
      [FETCH_URL_ID]: (state, {payload}) => ({...state, ticketUrlId: payload}),  
      [TICKETS_LOADED] :(state) => ({...state, loading:'hidden'}),
      [FETCH_ERROR]: (state) => ({...state, loadingError:'f'}),
      [UPDATE_TICKETS]: (state, {payload}) => ({...state, updatedTickets: payload}),
      DEFAULT: state => state
}

export const tabsReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}