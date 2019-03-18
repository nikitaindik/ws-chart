import React, { Component } from 'react';

import segmentsModule from './segments';

import style from './App.module.css';

const { SegmentList, Chart } = segmentsModule.components;

class App extends Component {
  render() {
    return (
      <div className={style.appWrap}>
        <div className={style.sidebarSection}>
          <div className={style.selections}>Selections</div>
          <SegmentList />
        </div>
        <div className={style.chartSection}>
          <Chart />
        </div>
      </div>
    );
  }
}

export default App;
