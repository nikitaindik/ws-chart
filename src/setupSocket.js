import { Server } from 'mock-socket';

import getFakeDataForDisplay from './segments/utils/fakeData';
import { socketEventTypes } from './segments/constants';

// SERVER START

const mockServer = new Server('ws://localhost:8080');

const handleSegmentHistoryRequest = (socket, message) => {
  const segmentId = message.payload;
  socket.send(
    JSON.stringify({
      type: socketEventTypes.SEGMENT_HISTORY,
      payload: {
        segmentId,
        data: getFakeDataForDisplay(),
      },
    }),
  );

  setInterval(() => {
    socket.send(
      JSON.stringify({
        type: socketEventTypes.SEGMENT_UPDATE,
        data: {
          segmentId,
          timestamp: Date.now(),
          change: Math.random() > 0.5 ? 1 : -1,
        },
      }),
    );
  }, 5000);
};

mockServer.on('connection', socket => {
  socket.on('message', message => {
    if (message.type === socketEventTypes.REQUEST_SEGMENT_HISTORY) {
      handleSegmentHistoryRequest(socket, message);
    }
  });
});

// SERVER END

// CONNECTION START

const socket = new WebSocket('ws://localhost:8080');

// CONNECTION END

const subscriptions = [];

const subscribe = callback => {
  subscriptions.push(callback);
};

const initMockServer = () => {};

const initConnection = () => {
  socket.onmessage = event => {
    const data = JSON.parse(event.data);

    subscriptions.forEach(callback => callback(data));
  };
};

const sendMessage = (type, payload) => {
  socket.send({
    type,
    payload,
  });
};

export default {
  initMockServer,
  initConnection,
  sendMessage,
  subscribe,
};

// Module's responsibilities
// - Establish connection
// - Notify listeners when new message arrives
