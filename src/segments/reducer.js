import { RECEIVE_HISTORY, RECEIVE_UPDATE } from './actionTypes';

const initialState = {
  byId: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_HISTORY:
      return {
        byId: {
          ...state.byId,
          [payload.segmentId]: payload.data,
        },
      };
    case RECEIVE_UPDATE:
      // Cases:
      // 1. Totally new bar: (last bar start timestamp + bar size) < event timestamp
      // 2. Update for last bar: (last bar start timestamp <= event timestamp && event timestamp <= last bar start timestamp + bar size)
      // EDGE CASES!
      // 3. Update for historic bar: last bar start timestamp > event timestamp

      const { segmentId, change } = payload;
      const updateTimestamp = payload.timestamp;

      const barSizes = Object.keys(state.byId[segmentId]);
      const updatedSegmentData = barSizes.reduce(
        (updatedSegmentData, barSize) => {
          const bars = state.byId[segmentId][barSize];
          const latestBarStartTimestamp = bars[bars.length - 1].timestamp;
          const latestBarEndTimestamp =
            latestBarStartTimestamp + Number(barSize);

          const isNewBar = latestBarEndTimestamp < updateTimestamp;
          const isUpdateForLatestBar =
            latestBarStartTimestamp <= updateTimestamp &&
            updateTimestamp <= latestBarEndTimestamp;

          let updatedBars;
          const latestBar = bars[bars.length - 1];
          if (isNewBar) {
            const newBar = {
              added: change > 0 ? change : 0,
              removed: change < 0 ? change : 0,
              segmentSize: latestBar.segmentSize + change,
              timestamp: latestBarEndTimestamp,
            };
            updatedBars = [...bars, newBar];
          } else if (isUpdateForLatestBar) {
            const updatedLatestBar = {
              ...latestBar,
            };

            updatedLatestBar.added =
              change > 0
                ? updatedLatestBar.added + change
                : updatedLatestBar.added;
            updatedLatestBar.removed =
              change < 0
                ? updatedLatestBar.removed + change
                : updatedLatestBar.removed;

            updatedLatestBar.segmentSize += change;

            updatedBars = [...bars.slice(0, -1), updatedLatestBar];
          }

          return {
            ...updatedSegmentData,
            [barSize]: updatedBars,
          };
        },
        {},
      );

      return {
        byId: {
          ...state.byId,
          [payload.segmentId]: updatedSegmentData,
        },
      };
    default:
      return state;
  }
};
