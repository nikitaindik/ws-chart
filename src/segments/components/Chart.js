import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { receiveHistory, receiveUpdate, changeMode } from '../actions';
import { socketEventTypes } from '../constants';

import { selectDisplayData } from '../selectors';

import socketModule from '../../setupSocket';

import Button from '../../components/Button';

const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
const sixHoursInMs = 6 * 60 * 60 * 1000;
const oneHourInMs = 1 * 60 * 60 * 1000;

const mapStateToProps = state => ({
  availableData: selectDisplayData(state),
  activeBarSize: state.segments.activeBarSize,
});

const mapDispatchToProps = dispatch => ({
  changeMode: mode => dispatch(changeMode(mode)),
  dispatch,
});

const ChartContainer = ({
  activeBarSize,
  availableData,
  dispatch,
  changeMode,
}) => {
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
      <ChartModeControls
        activeBarSize={activeBarSize}
        onChangeModeClick={changeMode}
      />
    </>
  );
};

const ConnectedChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartContainer);

export default ConnectedChartContainer;

const ChartModeControls = ({ activeBarSize, onChangeModeClick }) => {
  return (
    <div>
      <div>
        <Button
          isActive={activeBarSize === 86400000}
          onClick={() => onChangeModeClick(oneDayInMs)}
        >
          Last 30 days
        </Button>
        <Button
          isActive={activeBarSize === 21600000}
          onClick={() => onChangeModeClick(sixHoursInMs)}
        >
          Last 7 days
        </Button>
        <Button
          isActive={activeBarSize === 3600000}
          onClick={() => onChangeModeClick(oneHourInMs)}
        >
          Last 24 hours
        </Button>
        <Button
          isActive={activeBarSize === 300000}
          onClick={() => onChangeModeClick(300000)}
        >
          Last 60 minutes
        </Button>
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
      labels={d => new Date(d.timestamp).toString()}
      labelComponent={<VictoryTooltip />}
    />
  </VictoryChart>
);
