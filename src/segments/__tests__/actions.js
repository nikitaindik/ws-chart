import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { socketEventTypes } from '../constants';

import {
  SET_ACTIVE_SEGMENT,
  LOAD_SEGMENT_LIST_REQUEST,
  LOAD_SEGMENT_LIST_SUCCESS,
} from '../actionTypes';

import { requestHistory, chooseSegment, loadSegmentList } from '../actions';

const sendMessageMock = jest.fn();
const middlewares = [thunk.withExtraArgument({ sendMessage: sendMessageMock })];
const mockStore = configureMockStore(middlewares);

describe('Segments module thunks', () => {
  afterEach(() => {
    sendMessageMock.mockReset();
  });

  test('requestHistory - calls sendMessage with proper parameters', () => {
    const store = mockStore({});
    store.dispatch(requestHistory('10'));

    expect(sendMessageMock).toBeCalledWith(
      socketEventTypes.REQUEST_SEGMENT_HISTORY,
      '10',
    );
  });

  test('chooseSegment - sets active segment', () => {
    const initialState = {
      segments: {
        activeBarSize: 2,
        activeSegmentId: null,
        byId: {},
        list: {
          allIds: [],
          byId: {},
          isLoaded: true,
        },
      },
    };

    const store = mockStore(initialState);
    store.dispatch(chooseSegment('10'));

    const expectedActions = [{ type: SET_ACTIVE_SEGMENT, payload: '10' }];

    expect(store.getActions()).toEqual(expectedActions);
  });

  test("chooseSegment - loads history for segment if it's not in the state", () => {
    const initialState = {
      segments: {
        activeBarSize: 2,
        activeSegmentId: null,
        byId: {},
        list: {
          allIds: [],
          byId: {},
          isLoaded: true,
        },
      },
    };

    const store = mockStore(initialState);
    store.dispatch(chooseSegment('10'));

    expect(sendMessageMock).toBeCalledWith(
      socketEventTypes.REQUEST_SEGMENT_HISTORY,
      '10',
    );
  });

  test("chooseSegment - does NOT load history for segment if it's already in the state", () => {
    const initialState = {
      segments: {
        activeBarSize: 2,
        activeSegmentId: '10',
        byId: {
          10: {
            dataByBarSize: {
              2: [{ added: 2, removed: 0, segmentSize: 2, timestamp: 0 }],
            },
          },
        },
        list: {
          allIds: ['10', '20'],
          byId: {
            10: { id: '10', name: 'Tomato lovers' },
          },
          isLoaded: true,
        },
      },
    };

    const store = mockStore(initialState);
    store.dispatch(chooseSegment('10'));

    expect(sendMessageMock).not.toBeCalled();
  });

  test('loadSegmentList - dispatches all required actions', () => {
    const initialState = {
      segments: {
        activeBarSize: 2,
        activeSegmentId: '10',
        byId: {
          10: {
            dataByBarSize: {
              2: [{ added: 2, removed: 0, segmentSize: 2, timestamp: 0 }],
            },
          },
        },
        list: {
          allIds: ['10', '20'],
          byId: {
            10: { id: '10', name: 'Tomato lovers' },
          },
          isLoaded: true,
        },
      },
    };

    const store = mockStore(initialState);

    const expectedActions = [
      { type: LOAD_SEGMENT_LIST_REQUEST },
      {
        payload: [
          { id: '10', name: 'Tomato lovers' },
          { id: '20', name: 'Lemon aficionados' },
        ],
        type: LOAD_SEGMENT_LIST_SUCCESS,
      },
      { payload: '10', type: SET_ACTIVE_SEGMENT },
    ];

    return store.dispatch(loadSegmentList()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
