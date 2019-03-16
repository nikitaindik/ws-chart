import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryVoronoiContainer,
} from 'victory';

import { timeFormat } from 'd3-time-format';

import { receiveHistory, receiveUpdate, changeMode } from '../actions';
import { socketEventTypes } from '../constants';

import { selectDisplayData } from '../selectors';

import socketModule from '../../setupSocket';

import Button from '../../components/Button';

import TimeIcon from './TimeIcon';

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

const LegendIconSquare = ({ color }) => (
  <div style={{ background: color, width: '16px', height: '16px' }} />
);

const LegendIconLine = ({ color }) => (
  <div
    style={{
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <div style={{ background: color, height: '3px', width: '100%' }} />
  </div>
);

const LegendItem = ({ icon, label, value, primary }) => (
  <div style={{ display: 'flex', marginBottom: '8px' }}>
    <div style={{ marginRight: '8px' }}>{icon}</div>
    <div style={{ marginRight: '8px' }}>{label}:</div>
    <div style={{ fontWeight: primary ? 'bold' : 'normal' }}>{value}</div>
  </div>
);

const Legend = ({ activeBarData }) => {
  if (!activeBarData) {
    return <div style={{ height: '100px' }}>Hover over chart</div>;
  }

  const { added, removed, segmentSize, timestamp } = activeBarData;

  const formatter = timeFormat('%b %d, %H:%M');
  const formattedTime = formatter(timestamp);

  const columnStyle = {
    padding: '20px',
    width: '200px',
  };

  return (
    <div
      style={{
        height: '100px',
        display: 'flex',
        textAlign: 'left',
        justifyContent: 'center',
      }}
    >
      <div style={columnStyle}>
        <LegendItem
          icon={<LegendIconSquare color="#6c59d3" />}
          label={'Added'}
          value={added}
        />
        <LegendItem
          icon={<LegendIconSquare color="#999ea1" />}
          label={'Removed'}
          value={Math.abs(removed)}
        />
      </div>
      <div style={columnStyle}>
        <LegendItem
          icon={<LegendIconLine color="#008af7" />}
          label={'Size'}
          value={segmentSize}
          primary
        />
        <LegendItem icon={<TimeIcon />} label={'Time'} value={formattedTime} />
      </div>
    </div>
  );
};

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

  const [activeBarData, setActiveBarData] = useState(null);

  if (!availableData) {
    return null;
  }

  return (
    <>
      <Legend activeBarData={activeBarData} />
      <div style={{ height: '400px' }}>
        <Chart data={availableData} setActiveBarData={setActiveBarData} />
      </div>
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
  );
};

const Chart = ({ data, setActiveBarData }) => (
  <VictoryChart
    padding={{ top: 0, left: 40, right: 40, bottom: 50 }}
    domainPadding={20}
    scale={{ x: 'time' }}
    height={300}
    width={700}
    containerComponent={
      <VictoryVoronoiContainer
        voronoiDimension="x"
        onActivated={points => {
          const { added, removed, segmentSize, timestamp } = points[0];
          setActiveBarData({
            added,
            removed,
            segmentSize,
            timestamp,
          });
        }}
      />
    }
  >
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
      animate
    />
    <VictoryBar
      data={data}
      x="timestamp"
      y="removed"
      name="removed"
      style={{ data: { fill: '#999ea1' } }}
      animate
    />
    <VictoryLine
      data={data}
      x="timestamp"
      y="segmentSize"
      name="segmentSize"
      interpolation="natural"
      style={{ data: { stroke: '#008af7' } }}
      // animate
    />
    <VictoryScatter
      data={data}
      x="timestamp"
      y="segmentSize"
      size={(datum, active) => (active ? 3 : 0)}
      style={{ data: { fill: '#008af7', stroke: '#fff', strokeWidth: '1px' } }}
      // animate
    />
  </VictoryChart>
);
