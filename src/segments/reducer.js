import {
  LOAD_SEGMENT_LIST_REQUEST,
  LOAD_SEGMENT_LIST_SUCCESS,
  SET_ACTIVE_SEGMENT,
  RECEIVE_HISTORY,
  RECEIVE_UPDATE,
  CHANGE_MODE,
} from './actionTypes';

const initialState = {
  list: {
    isLoaded: false,
    byId: {},
    allIds: [],
  },
  activeSegmentId: null,
  activeBarSize: null,
  byId: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_SEGMENT_LIST_REQUEST:
      return handleLoadSegmentListRequest(state);
    case LOAD_SEGMENT_LIST_SUCCESS:
      return handleLoadSegmentListSuccess(state, payload);
    case SET_ACTIVE_SEGMENT:
      return handleSetActiveSegment(state, payload);
    case RECEIVE_HISTORY:
      return handleReceiveHistory(state, payload);
    case RECEIVE_UPDATE:
      return handleReceiveUpdate(state, payload);
    case CHANGE_MODE:
      return handleChangeMode(state, payload);
    default:
      return state;
  }
};

const getLargestBarSize = dataByBarSize => {
  const barSizes = Object.keys(dataByBarSize);
  return Math.max(...barSizes);
};

const handleLoadSegmentListRequest = state => ({
  ...state,
  list: {
    ...state.list,
    isLoaded: false,
  },
});

const handleLoadSegmentListSuccess = (state, payload) => {
  const byId = payload.reduce(
    (segmentsById, segment) => ({
      ...segmentsById,
      [segment.id]: { name: segment.name, id: segment.id },
    }),
    {},
  );

  const allIds = payload.map(segment => segment.id);

  return {
    ...state,
    list: {
      ...state.list,
      byId,
      allIds,
      isLoaded: true,
    },
  };
};

const handleSetActiveSegment = (state, payload) => ({
  ...state,
  activeSegmentId: payload,
});

const handleReceiveHistory = (state, payload) => {
  let activeBarSize = state.activeBarSize;

  if (!activeBarSize) {
    activeBarSize = getLargestBarSize(payload.data);
  }

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
};

const addNewBar = (bars, change, latestBarEndTimestamp) => {
  const latestBar = bars[bars.length - 1];
  const newBar = {
    added: change > 0 ? change : 0,
    removed: change < 0 ? change : 0,
    segmentSize: latestBar.segmentSize + change,
    timestamp: latestBarEndTimestamp,
  };
  return [...bars, newBar];
};

const updateLatestBar = (bars, change) => {
  const latestBar = bars[bars.length - 1];
  const updatedLatestBar = {
    ...latestBar,
  };

  updatedLatestBar.added =
    change > 0 ? updatedLatestBar.added + change : updatedLatestBar.added;
  updatedLatestBar.removed =
    change < 0 ? updatedLatestBar.removed + change : updatedLatestBar.removed;

  updatedLatestBar.segmentSize += change;

  return [...bars.slice(0, -1), updatedLatestBar];
};

const handleReceiveUpdate = (state, payload) => {
  const { segmentId, change } = payload;
  const updateTimestamp = payload.timestamp;

  const barSizes = Object.keys(state.byId[segmentId].dataByBarSize);
  const updatedSegmentData = barSizes.reduce((updatedSegmentData, barSize) => {
    const bars = state.byId[segmentId].dataByBarSize[barSize];
    const latestBarStartTimestamp = bars[bars.length - 1].timestamp;
    const latestBarEndTimestamp = latestBarStartTimestamp + Number(barSize);

    const isNewBar = latestBarEndTimestamp < updateTimestamp;

    const updatedBars = isNewBar
      ? addNewBar(bars, change, latestBarEndTimestamp)
      : updateLatestBar(bars, change);

    return {
      ...updatedSegmentData,
      [barSize]: updatedBars,
    };
  }, {});

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
};

const handleChangeMode = (state, payload) => ({
  ...state,
  activeBarSize: payload,
});
