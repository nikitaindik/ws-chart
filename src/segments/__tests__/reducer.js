import reducer from '../reducer';
import {
  LOAD_SEGMENT_LIST_REQUEST,
  LOAD_SEGMENT_LIST_SUCCESS,
  SET_ACTIVE_SEGMENT,
  RECEIVE_HISTORY,
  RECEIVE_UPDATE,
  CHANGE_MODE,
} from '../actionTypes';

describe('Segments module reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: [],
        byId: {},
        isLoaded: false,
      },
    });
  });

  it('should handle LOAD_SEGMENT_LIST_REQUEST', () => {
    const initialState = {
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: [],
        byId: {},
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: [],
        byId: {},
        isLoaded: false,
      },
    };

    const action = {
      type: LOAD_SEGMENT_LIST_REQUEST,
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOAD_SEGMENT_LIST_SUCCESS', () => {
    const initialState = {
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: [],
        byId: {},
        isLoaded: false,
      },
    };

    const expectedState = {
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: LOAD_SEGMENT_LIST_SUCCESS,
      payload: [
        { name: 'Tomato lovers', id: '10' },
        { name: 'Lemon aficionados', id: '20' },
      ],
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_ACTIVE_SEGMENT', () => {
    const initialState = {
      activeBarSize: null,
      activeSegmentId: null,
      byId: {},
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: null,
      activeSegmentId: '10',
      byId: {},
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: SET_ACTIVE_SEGMENT,
      payload: '10',
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RECEIVE_HISTORY', () => {
    const initialState = {
      activeBarSize: null,
      activeSegmentId: '10',
      byId: {},
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: 360000,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            360000: [{ added: 1, removed: 2, segmentSize: 3, timestamp: 123 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: RECEIVE_HISTORY,
      payload: {
        segmentId: '10',
        data: {
          360000: [{ timestamp: 123, added: 1, removed: 2, segmentSize: 3 }],
        },
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RECEIVE_UPDATE - add new bar', () => {
    const initialState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [
              { added: 1, removed: 0, segmentSize: 1, timestamp: 0 },
              { added: 1, removed: 0, segmentSize: 2, timestamp: 2 },
            ],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: RECEIVE_UPDATE,
      payload: {
        segmentId: '10',
        timestamp: 3,
        change: 1,
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RECEIVE_UPDATE - add multiple new bars', () => {
    const initialState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [
              { added: 1, removed: 0, segmentSize: 1, timestamp: 0 },
              { added: 0, removed: 0, segmentSize: 1, timestamp: 2 },
              { added: 0, removed: 0, segmentSize: 1, timestamp: 4 },
              { added: 1, removed: 0, segmentSize: 2, timestamp: 6 },
            ],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: RECEIVE_UPDATE,
      payload: {
        segmentId: '10',
        timestamp: 7,
        change: 1,
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RECEIVE_UPDATE - update last bar', () => {
    const initialState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
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
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: RECEIVE_UPDATE,
      payload: {
        segmentId: '10',
        timestamp: 1,
        change: 1,
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_MODE', () => {
    const initialState = {
      activeBarSize: 2,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
            21600000: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const expectedState = {
      activeBarSize: 21600000,
      activeSegmentId: '10',
      byId: {
        10: {
          dataByBarSize: {
            2: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
            21600000: [{ added: 1, removed: 0, segmentSize: 1, timestamp: 0 }],
          },
        },
      },
      list: {
        allIds: ['10', '20'],
        byId: {
          10: { id: '10', name: 'Tomato lovers' },
          20: { id: '20', name: 'Lemon aficionados' },
        },
        isLoaded: true,
      },
    };

    const action = {
      type: CHANGE_MODE,
      payload: 21600000,
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
