import React, {useContext} from "react";
import { TabsContext } from "../../context/tabs/tabsContext" 
import "./tabs.scss";



const Tabs = () => {
    const {sorting, updatedTickets, tabsButtons, onChangeTabs} = useContext(TabsContext);
    
    
    const changeTabs = (event) => {     
        const id = event.target.id
        onChangeTabs(id);
        sorting[id](updatedTickets)
       
    }

    return (
        <div className="tabs">
            <button onClick={(event) => changeTabs(event)} id="0" className={tabsButtons[0]}>САМЫЙ ДЕШЕВЫЙ</button>
            <button onClick={(event) => changeTabs(event)} id="1"  className={tabsButtons[1]}>САМЫЙ БЫСТРЫЙ</button>
            <button onClick={(event) => changeTabs(event)} id="2"  className={tabsButtons[2]}>ОПТИМАЛЬНЫЙ</button>
        </div>
    )
}

export default Tabs