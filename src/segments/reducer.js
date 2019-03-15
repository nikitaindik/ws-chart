import {
  LOAD_SEGMENT_LIST_REQUEST,
  LOAD_SEGMENT_LIST_SUCCESS,
  SET_ACTIVE_SEGMENT,
  RECEIVE_HISTORY,
  RECEIVE_UPDATE,
  CHANGE_MODE,
} from './actionTypes';

const initialState = {
  isListLoaded: false,
  activeSegmentId: null,
  activeBarSize: null,
  byId: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_SEGMENT_LIST_REQUEST:
      return {
        ...state,
        isListLoaded: false,
      };
    case LOAD_SEGMENT_LIST_SUCCESS:
      const byId = {};
      payload.forEach(segment => (byId[segment.id] = { name: segment.name }));
      return {
        ...state,
        isListLoaded: true,
        byId,
      };
    case SET_ACTIVE_SEGMENT:
      return {
        ...state,
        activeSegmentId: payload,
      };
    case RECEIVE_HISTORY:
      const activeBarSize = state.activeBarSize || Object.keys(payload.data)[0];
      return {
        ...state,
        activeBarSize,
        byId: {
          ...state.byId,
          [payload.segmentId]: {
            ...state.byId[payload.segmentId],
            dataByBarSize: payload.data,
          },
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

      const barSizes = Object.keys(state.byId[segmentId].dataByBarSize);
      const updatedSegmentData = barSizes.reduce(
        (updatedSegmentData, barSize) => {
          const bars = state.byId[segmentId].dataByBarSize[barSize];
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
        ...state,
        byId: {
          ...state.byId,
          [payload.segmentId]: {
            ...state.byId[payload.segmentId],
            dataByBarSize: updatedSegmentData,
          },
        },
      };
    case CHANGE_MODE:
      return {
        ...state,
        activeBarSize: payload,
      };
    default:
      return state;
  }
};
