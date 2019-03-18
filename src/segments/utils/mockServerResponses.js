import { socketEventTypes } from '../constants';
import generateFakeDataForDisplay from '../utils/fakeDataGenerator';

const getSegmentSize = data => {
  const dataSample = Object.values(data)[0];
  return dataSample[dataSample.length - 1].segmentSize;
};

const handleSegmentHistoryRequest = (socket, message) => {
  const fakeData = generateFakeDataForDisplay();

  // Keep track of the current segment size so we don't drop it below zero
  let segmentSize = getSegmentSize(fakeData);

  const segmentId = message.payload;
  socket.send(
    JSON.stringify({
      type: socketEventTypes.SEGMENT_HISTORY,
      payload: {
        segmentId,
        data: fakeData,
      },
    }),
  );

  setInterval(() => {
    let change = Math.random() > 0.5 ? 1 : -1;

    const willDropBelowZero = segmentSize + change < 0;
    if (willDropBelowZero) {
      change = 1;
    }

    segmentSize += change;

    socket.send(
      JSON.stringify({
        type: socketEventTypes.SEGMENT_UPDATE,
        data: {
          segmentId,
          timestamp: Date.now(),
          change,
        },
      }),
    );
  }, 10000);
};

const mockServerResponses = (socket, message) => {
  if (message.type === socketEventTypes.REQUEST_SEGMENT_HISTORY) {
    handleSegmentHistoryRequest(socket, message);
  }
};

export default mockServerResponses;
