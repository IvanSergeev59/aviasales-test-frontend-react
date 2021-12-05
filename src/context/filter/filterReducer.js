import {CHANGE_CHECKBOX} from "../types";


const handlers = {
    [CHANGE_CHECKBOX] : (state, {payload}) => {
       const filters = state.filters.slice(0);
       

       if (filters[payload] === 'selected') {        
        filters[payload]  = 'unselected'
       }
       else {        
        filters[payload]  = 'selected'
       }
       
       if (filters[0] === 'selected' && payload==='0') {
           console.log('all')
            filters[1]='selected';
            filters[2]='selected';
            filters[3]='selected';
            filters[4]='selected';
       }
       if (filters[1]==='selected' && filters[2]==='selected' && filters[3]==='selected' && filters[4]==='selected'){
           filters[0]='selected'
       }
       if (filters[1]!=='selected' || filters[2]!=='selected' || filters[3]!=='selected' || filters[4]!=='selected'){
        filters[0]='unselected'
    }

      
    return (
    {...state, filters: filters}
    )
    }
    ,



    DEFAULT: state => state
}

export const filterReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state,action)
}