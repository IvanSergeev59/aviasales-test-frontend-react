import React from 'react';
import './App.scss';
import Header from './components/header';
import Content from './components/content';
import { FilterState } from './context/filter/filterState';
import { TabsState } from './context/tabs/tabsState';

function App() {
  return (
    <TabsState>
      <FilterState>        
          <Header />
          <Content />     
      </FilterState>
      </TabsState>

  );
}

export default App;
