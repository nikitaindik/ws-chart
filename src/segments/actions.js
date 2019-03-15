import * as actionTypes from './actionTypes';
import { socketEventTypes } from './constants';
import api from './api';

export const loadSegmentListRequest = () => ({
  type: actionTypes.LOAD_SEGMENT_LIST_REQUEST,
});

export const loadSegmentListSuccess = list => ({
  type: actionTypes.LOAD_SEGMENT_LIST_SUCCESS,
  payload: list,
});

export const loadSegmentList = () => async dispatch => {
  dispatch(loadSegmentListRequest());

  try {
    const segmentList = await api.fetchSegmentList();
    dispatch(loadSegmentListSuccess(segmentList));
  } catch {}
};

export const setActiveSegment = segmentId => ({
  type: actionTypes.SET_ACTIVE_SEGMENT,
  payload: segmentId,
});

export const requestHistory = segmentId => (
  dispatch,
  getState,
  { sendMessage },
) => {
  sendMessage(socketEventTypes.REQUEST_SEGMENT_HISTORY, segmentId);
};

export const chooseSegment = segmentId => (dispatch, getState) => {
  dispatch(setActiveSegment(segmentId));

  const shouldLoadHistory =
    typeof getState().segments.byId[segmentId].dataByBarSize === 'undefined';

  if (shouldLoadHistory) {
    dispatch(requestHistory(segmentId));
  }
};

export const receiveHistory = (segmentId, data) => ({
  type: actionTypes.RECEIVE_HISTORY,
  payload: {
    segmentId,
    data,
  },
});

export const receiveUpdate = data => ({
  type: actionTypes.RECEIVE_UPDATE,
  payload: {
    segmentId: data.segmentId,
    timestamp: data.timestamp,
    change: data.change,
  },
});

export const changeMode = mode => ({
  type: actionTypes.CHANGE_MODE,
  payload: mode,
});
