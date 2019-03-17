import { get } from 'dot-prop-immutable';

import {
  LOAD_SEGMENT_LIST_REQUEST,
  LOAD_SEGMENT_LIST_SUCCESS,
  SET_ACTIVE_SEGMENT,
  RECEIVE_HISTORY,
  RECEIVE_UPDATE,
  CHANGE_MODE,
} from './actionTypes';
import { socketEventTypes } from './constants';
import api from './api';

export const loadSegmentListRequest = () => ({
  type: LOAD_SEGMENT_LIST_REQUEST,
});

export const loadSegmentListSuccess = list => ({
  type: LOAD_SEGMENT_LIST_SUCCESS,
  payload: list,
});

export const loadSegmentList = () => async dispatch => {
  dispatch(loadSegmentListRequest());

  let segmentList;

  try {
    segmentList = await api.fetchSegmentList();
  } catch (error) {
    console.error('Something is wrong with fetchSegmentList request', error);
  }

  dispatch(loadSegmentListSuccess(segmentList));
  dispatch(chooseSegment(segmentList[0].id));
};

export const setActiveSegment = segmentId => ({
  type: SET_ACTIVE_SEGMENT,
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

  const state = getState();
  const shouldLoadHistory =
    typeof get(state, `segments.byId[${segmentId}].dataByBarSize`) ===
    'undefined';

  if (shouldLoadHistory) {
    dispatch(requestHistory(segmentId));
  }
};

export const receiveHistory = (segmentId, data) => ({
  type: RECEIVE_HISTORY,
  payload: {
    segmentId,
    data,
  },
});

export const receiveUpdate = data => ({
  type: RECEIVE_UPDATE,
  payload: {
    segmentId: data.segmentId,
    timestamp: data.timestamp,
    change: data.change,
  },
});

export const changeMode = mode => ({
  type: CHANGE_MODE,
  payload: mode,
});
