import React, { Component } from 'react';

import Chart from './segments/components/Chart';
import SegmentList from './segments/components/SegmentList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div
        className="App"
        style={{ display: 'flex', maxWidth: '1280px', margin: '0 auto' }}
      >
        <div style={{ width: '300px' }}>
          <SegmentList />
        </div>
        <div style={{ flex: 1 }}>
          <Chart />
        </div>
      </div>
    );
  }
}

export default App;
