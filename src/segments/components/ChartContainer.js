import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { receiveHistory, receiveUpdate } from '../actions';
import { socketEventTypes } from '../constants';

import { selectDisplayData } from '../selectors';

import socketModule from '../../core/webSocketConnection';

import ChartLegend from './ChartLegend';
import Chart from './Chart';
import ChartModeContainer from './ChartModeContainer';

import mockWebSocketServer from '../../core/mockWebSocketServer';
import mockServerResponses from '../utils/mockServerResponses';

if (process.env.REACT_APP_USE_MOCK_SERVER === 'true') {
  // Use mock server for development, real server - for production
  mockWebSocketServer.subscribe(mockServerResponses);
}

const handleSocketEvents = dispatch => {
  return socketModule.subscribe(event => {
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
};

const ChartContainer = ({ availableData, dispatch }) => {
  useEffect(() => handleSocketEvents(dispatch), []);

  const [activeBarData, setActiveBarData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!availableData) {
    return null;
  }

  const latestBarData = availableData[availableData.length - 1];

  return (
    <>
      <ChartLegend
        activeBarData={activeBarData}
        showLatestBarData={!isHovered}
        latestBarData={latestBarData}
      />
      <Chart
        data={availableData}
        setActiveBarData={setActiveBarData}
        setIsHovered={setIsHovered}
      />
      <ChartModeContainer />
    </>
  );
};

const mapStateToProps = state => ({
  availableData: selectDisplayData(state),
});

export default connect(mapStateToProps)(ChartContainer);
