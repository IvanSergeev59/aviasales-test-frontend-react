import React, { useContext} from "react";
import "./filter.scss";
import { FilterContext } from "../../context/filter/filterContext";
import backToTopButton from '../../images/backToTopButton.png'

const Filter = () => {
    const {filters, onChangeCheckbox} = useContext(FilterContext);
    
    const onChecked = (event) => {         
        const id = event.target.id;
        onChangeCheckbox(id);

    }

    return (
        <React.Fragment>
        <section className="filter">
            <h2>КОЛИЧЕСТВО ПЕРЕСАДОК</h2>
            <ul>

            <li className={filters[0]} >
                <input type="checkbox" >
                </input>
                <label id="0" onClick = {(event) => onChecked(event)}>Все</label>
            </li>
            <li className={filters[1]} >
                <input type="checkbox" >                    
                </input>
                <label  id="1" onClick = {(event) => onChecked(event)}>Без пересадок</label>
            </li>
            <li className={filters[2]}  >
                <input type="checkbox"> 
                </input>
                <label  id="2" onClick = {(event) => onChecked(event)}>1 пересадка</label>
            </li>
            <li className={filters[3]} >
                <input type="checkbox" >
                </input>
                <label   id="3" onClick = {(event) => onChecked(event)}>2 пересадки</label>
            </li>
            <li  className={filters[4]}  >
                <input type="checkbox">
                </input>
                <label    id="4" onClick = {(event) => onChecked(event)}>3 пересадки</label>
            </li>
            </ul>
        </section>
        <a href="/#"><img className="backToTopButton" alt="backToTopButton" src={backToTopButton}></img></a>
        </React.Fragment>
    )
}

export default Filter