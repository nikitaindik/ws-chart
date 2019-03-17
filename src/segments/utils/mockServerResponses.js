import { socketEventTypes } from '../constants';
import getFakeDataForDisplay from '../utils/fakeData';

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

const mockServerResponses = (socket, message) => {
  if (message.type === socketEventTypes.REQUEST_SEGMENT_HISTORY) {
    handleSegmentHistoryRequest(socket, message);
  }
};

export default mockServerResponses;
