import React, {useReducer} from "react";
import {FilterContext} from './filterContext';
import { filterReducer } from "./filterReducer";
import {CHANGE_CHECKBOX} from '../types'

export const FilterState = ({children}) => {
    const initialState = {
        filters: ['unselected', 'unselected',
        'unselected',
        'unselected',
        'unselected'
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