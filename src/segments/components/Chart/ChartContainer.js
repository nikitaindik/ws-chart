import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { receiveHistory, receiveUpdate } from '../../actions';
import { socketEventTypes } from '../../constants';

import { selectDisplayData, selectActiveBarSize } from '../../selectors';

import webSocketConnection from '../../../core/webSocketConnection';

import ChartLegend from '../ChartLegend/ChartLegend';
import Chart from './Chart';
import ChartModeContainer from '../ChartMode/ChartModeContainer';

import mockWebSocketServer from '../../../core/mockWebSocketServer';
import mockServerResponses from '../../utils/mockServerResponses';

if (process.env.REACT_APP_USE_MOCK_SERVER === 'true') {
  // Use mock server for development, real server - for production
  mockWebSocketServer.subscribe(mockServerResponses);
}

const handleSocketEvents = dispatch => {
  return webSocketConnection.subscribe(event => {
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

const ChartContainer = ({ dataToDisplay, activeBarSize, dispatch }) => {
  useEffect(() => handleSocketEvents(dispatch), []);

  const [hoveredBarData, setHoveredBarData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!dataToDisplay) {
    return null;
  }

  const latestBarData = dataToDisplay[dataToDisplay.length - 1];
  const isHoveringOverLastBar =
    hoveredBarData && hoveredBarData.timestamp === latestBarData.timestamp;

  return (
    <>
      <ChartLegend
        hoveredBarData={hoveredBarData}
        showLatestBarData={!isHovered || isHoveringOverLastBar}
        latestBarData={latestBarData}
        isHoveringOverLastBar={isHoveringOverLastBar}
        activeBarSize={activeBarSize}
      />
      <Chart
        data={dataToDisplay}
        setActiveBarData={setHoveredBarData}
        setIsHovered={setIsHovered}
      />
      <ChartModeContainer />
    </>
  );
};

const mapStateToProps = state => ({
  dataToDisplay: selectDisplayData(state),
  activeBarSize: selectActiveBarSize(state),
});

export default connect(mapStateToProps)(ChartContainer);
