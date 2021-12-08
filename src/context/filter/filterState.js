import React, {useReducer} from "react";
import {FilterContext} from './filterContext';
import { filterReducer } from "./filterReducer";
import {CHANGE_CHECKBOX} from '../types'

export const FilterState = ({children}) => {
    //default : all checkbox on
    const initialState = {
        filters: ['selected', 'selected',
        'selected',
        'selected',
        'selected'
        ]
    }
    const [state, dispatch] = useReducer(filterReducer, initialState);

    const onChangeCheckbox = (item) => dispatch(({type: CHANGE_CHECKBOX, payload:item}))
    
    const {filters} = state;

        return (
            <FilterContext.Provider value={{
                filters, onChangeCheckbox
            }}>
                {children}
            </FilterContext.Provider>
        )
}