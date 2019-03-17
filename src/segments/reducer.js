import { set } from 'dot-prop-immutable';

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

const handleLoadSegmentListRequest = state =>
  set(state, 'list.isLoaded', false);

const handleLoadSegmentListSuccess = (state, payload) => {
  const byId = payload.reduce(
    (segmentsById, segment) => ({
      ...segmentsById,
      [segment.id]: { name: segment.name, id: segment.id },
    }),
    {},
  );

  const allIds = payload.map(segment => segment.id);

  return set(state, 'list', {
    ...state.list,
    byId,
    allIds,
    isLoaded: true,
  });
};

const handleSetActiveSegment = (state, payload) =>
  set(state, 'activeSegmentId', payload);

const handleReceiveHistory = (state, payload) => {
  let activeBarSize = state.activeBarSize;

  if (!activeBarSize) {
    activeBarSize = getLargestBarSize(payload.data);
  }

  let updatedState = set(state, 'activeBarSize', activeBarSize);
  updatedState = set(
    updatedState,
    `byId.${payload.segmentId}.dataByBarSize`,
    payload.data,
  );

  return updatedState;
};

const handleReceiveUpdate = (state, payload) => {
  const { segmentId, change } = payload;
  const updateTimestamp = payload.timestamp;

  const barSizes = Object.keys(state.byId[segmentId].dataByBarSize);
  const updatedSegmentData = barSizes.reduce((updatedSegmentData, barSize) => {
    const bars = state.byId[segmentId].dataByBarSize[barSize];
    const latestBarStartTimestamp = bars[bars.length - 1].timestamp;
    const latestBarEndTimestamp = latestBarStartTimestamp + Number(barSize) - 1;

    const isNewBar = latestBarEndTimestamp < updateTimestamp;

    const updatedBars = isNewBar
      ? addNewBars(
          bars,
          change,
          latestBarEndTimestamp,
          updateTimestamp,
          barSize,
        )
      : updateLatestBar(bars, change);

    return {
      ...updatedSegmentData,
      [barSize]: updatedBars,
    };
  }, {});

  return set(
    state,
    `byId.${payload.segmentId}.dataByBarSize`,
    updatedSegmentData,
  );
};

const generateNewBarsForPadding = (
  segmentSize,
  latestBarEndTimestamp,
  barsToAddCount,
  barSize,
) => {
  const emptyBars = new Array(barsToAddCount).fill({});
  return emptyBars.map((bar, index) => ({
    added: 0,
    removed: 0,
    segmentSize,
    timestamp: latestBarEndTimestamp + 1 + barSize * index,
  }));
};

const addNewBars = (
  bars,
  change,
  latestBarEndTimestamp,
  updateTimestamp,
  barSize,
) => {
  const barsToAddCount = Math.ceil(
    (updateTimestamp - latestBarEndTimestamp) / barSize,
  );

  const latestBar = bars[bars.length - 1];
  const newBars = generateNewBarsForPadding(
    latestBar.segmentSize,
    latestBarEndTimestamp,
    barsToAddCount,
    barSize,
  );

  const newLatestBar = newBars[newBars.length - 1];

  newLatestBar.added = change > 0 ? change : 0;
  newLatestBar.removed = change < 0 ? change : 0;
  newLatestBar.segmentSize = latestBar.segmentSize + change;

  return [...bars, ...newBars];
};

const updateLatestBar = (bars, change) => {
  const latestBar = bars[bars.length - 1];
  const updatedLatestBar = {
    ...latestBar,
  };

  if (change > 0) {
    updatedLatestBar.added += change;
  } else {
    updatedLatestBar.removed += change;
  }

  updatedLatestBar.segmentSize += change;

  return [...bars.slice(0, -1), updatedLatestBar];
};

const handleChangeMode = (state, payload) =>
  set(state, 'activeBarSize', payload);
