import React, { Component } from 'react';

import ChartContainer from './segments/components/ChartContainer';
import SegmentList from './segments/components/SegmentListContainer';

import style from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={style.appWrap}>
        <div className={style.sidebarSection}>
          <SegmentList />
        </div>
        <div className={style.chartSection}>
          <ChartContainer />
        </div>
      </div>
    );
  }
}

export default App;
