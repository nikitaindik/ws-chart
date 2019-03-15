import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { receiveHistory, receiveUpdate, changeMode } from '../actions';
import { socketEventTypes } from '../constants';

import { selectDisplayData } from '../selectors';

import socketModule from '../../setupSocket';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from 'victory';

const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
const sixHoursInMs = 6 * 60 * 60 * 1000;
const oneHourInMs = 1 * 60 * 60 * 1000;

const mapStateToProps = state => ({
  availableData: selectDisplayData(state),
});

const mapDispatchToProps = dispatch => ({
  changeMode: mode => dispatch(changeMode(mode)),
  dispatch,
});

const ChartContainer = ({ availableData, dispatch, changeMode }) => {
  useEffect(() => {
    socketModule.subscribe(event => {
      switch (event.type) {
        case socketEventTypes.SEGMENT_HISTORY:
          const { segmentId, data } = event.payload;
          dispatch(receiveHistory(segmentId, data));
          break;
        case socketEventTypes.SEGMENT_UPDATE:
          dispatch(receiveUpdate(event.data));
          break;
        default:
      }
    });
  }, []);

  if (!availableData) {
    return null;
  }

  return (
    <>
      <Chart data={availableData} />
      <ChartModeControls onChangeModeClick={changeMode} />
    </>
  );
};

const ConnectedChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartContainer);

export default ConnectedChartContainer;

const ChartModeControls = ({ onChangeModeClick }) => {
  return (
    <div>
      <div>
        <button onClick={() => onChangeModeClick(oneDayInMs)}>
          Last 30 days
        </button>
        <button onClick={() => onChangeModeClick(sixHoursInMs)}>
          Last 7 days
        </button>
        <button onClick={() => onChangeModeClick(oneHourInMs)}>Last day</button>
      </div>
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