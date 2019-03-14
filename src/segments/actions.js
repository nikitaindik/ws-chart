import * as actionTypes from './actionTypes';

export const chooseSegment = segmentId => ({
  type: actionTypes.CHOOSE_SEGMENT,
  payload: segmentId,
});

export const requestHistory = () => (dispatch, getState, { sendMessage }) => {
  sendMessage('YO');
};

export const receiveHistory = data => ({
  type: actionTypes.RECEIVE_HISTORY,
  payload: {
    segmentId: 123,
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
