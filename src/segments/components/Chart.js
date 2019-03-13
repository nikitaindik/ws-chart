import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { requestHistory, receiveHistory, receiveUpdate } from '../actions';

import socketModule from '../../setupSocket';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from 'victory';

const mapStateToProps = state => ({
  availableData: state.segments.byId[123]
    ? state.segments.byId[123][1 * 60 * 60 * 1000]
    : null,
});

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(requestHistory()),
  receiveUpdate: () => dispatch(receiveUpdate()),
  dispatch,
});

const ChartContainer = ({ availableData, loadData, dispatch }) => {
  useEffect(() => {
    socketModule.subscribe(event => {
      switch (event.type) {
        case 'history':
          dispatch(receiveHistory(event.data));
          break;
        case 'update':
          dispatch(receiveUpdate(event.data));
          break;
        default:
      }
    });
  }, []);
  return (
    <>
      {availableData ? <Chart data={availableData} /> : <div>Loading...</div>}
      <ChartModeControls onLoadDataClick={loadData} />
    </>
  );
};

const ConnectedChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartContainer);

export default ConnectedChartContainer;

const ChartModeControls = ({ onLoadDataClick }) => {
  return (
    <div>
      <button onClick={onLoadDataClick}>Load data</button>
      {/* <button onClick={this.changeMode.bind(null, 'month')}>
        Last 30 days
      </button>
      <button onClick={this.changeMode.bind(null, 'week')}>Last 7 days</button>
      <button onClick={this.changeMode.bind(null, 'day')}>Last day</button> */}
    </div>
  );
};

const Chart = ({ data }) => (
  <VictoryChart domainPadding={20} scale={{ x: 'time' }}>
    <VictoryAxis offsetY={50} />
    <VictoryAxis
      animate
      dependentAxis
      style={{
        grid: {
          stroke: '#999ea1',
          opacity: 0.5,
        },
      }}
    />
    <VictoryBar
      data={data}
      x="timestamp"
      y="added"
      name="added"
      style={{ data: { fill: '#6c59d3' } }}
      animate={true}
    />
    <VictoryBar
      data={data}
      x="timestamp"
      y="removed"
      name="removed"
      style={{ data: { fill: '#999ea1' } }}
      animate={true}
    />
    <VictoryLine
      data={data}
      x="timestamp"
      y="segmentSize"
      name="segmentSize"
      interpolation="natural"
      style={{ data: { stroke: '#008af7' } }}
      animate
    />
    <VictoryScatter
      data={data}
      x="timestamp"
      y="segmentSize"
      style={{ data: { fill: '#008af7' } }}
      animate
    />
  </VictoryChart>
);
