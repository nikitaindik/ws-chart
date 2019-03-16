const getChange = currentSegmentSize => {
  const added = Math.random() > 0.9 ? 1 : 0;
  const removed = Math.min(currentSegmentSize, Math.random() > 0.9 ? 1 : 0);
  const segmentSize = currentSegmentSize + added - removed;

  return {
    added,
    removed,
    segmentSize,
  };
};

// TODO: Use d3-time interval.range to generate timestamps?
const generateFakeData = days => {
  // Gens (days + half day of data)
  // Generated data starts at the beginning of a day
  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
  const fiveMinsInMs = 5 * 60 * 1000;

  // Data for 16th of May means state of data at the end of 16th of May
  const endTimestamp = Date.now();
  const startTimestamp = new Date(endTimestamp - days * oneDayInMs).setHours(
    24,
    0,
    0,
    0,
  );

  let currentSegmentSize = 0;
  const result = [];

  for (
    let currentTimestamp = startTimestamp;
    currentTimestamp < endTimestamp;
    currentTimestamp += fiveMinsInMs
  ) {
    const change = getChange(currentSegmentSize);
    currentSegmentSize = change.segmentSize;
    result.push({
      timestamp: currentTimestamp,
      ...change,
    });
  }

  return result;
};

const groupData = (data, inputSize, outputSize) => {
  // Groups 5 minute data into arrays of given size
  const groupSize = outputSize / inputSize;

  const groupedByIndex = data.reduce(
    (groupedByIndex, currentItem, currentItemIndex) => {
      const itemIndex = Math.floor(currentItemIndex / groupSize);
      if (groupedByIndex.hasOwnProperty(itemIndex)) {
        groupedByIndex[itemIndex].push(currentItem);
      } else {
        groupedByIndex[itemIndex] = [currentItem];
      }
      return groupedByIndex;
    },
    {},
  );

  const slicedData = Object.values(groupedByIndex);

  return slicedData;
};

const batchData = slices => {
  const groups = slices.map(slice => {
    const grouped = slice.reduce((result, sliceItem, itemIndex) => {
      if (itemIndex === 0) {
        return { ...sliceItem };
      }

      result.added += sliceItem.added;
      result.removed += sliceItem.removed;
      result.segmentSize =
        result.segmentSize + sliceItem.added - sliceItem.removed;

      return result;
    }, {});

    return grouped;
  });

  return groups;
};

const flipRemovedSign = data => {
  return data.map(item => {
    return {
      ...item,
      removed: -item.removed,
    };
  });
};

// 30 days grouped by 1 day: 29.5 days starting at current bar end - 30 days
// 7 days grouped by 6 hours: 6.5 days starting at current bar end - 7 days
// 1 day grouped by 1 hour: 23.5 hours starting at current bar end - 24 hours
const trimData = (data, period, barSize) => {
  const pieceSize = data[1].timestamp - data[0].timestamp;
  const latestTimestamp = data[data.length - 1].timestamp;
  const dayStartTimestamp = new Date(latestTimestamp).setHours(0, 0, 0, 0);
  const barsElapsedSinceDayStart = Math.ceil(
    (latestTimestamp - dayStartTimestamp) / barSize,
  );
  const lastBarEndTimestamp =
    dayStartTimestamp + barsElapsedSinceDayStart * barSize;

  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
  const trimmedDataStartTimestamp = lastBarEndTimestamp - period;

  const piecesToCut =
    (latestTimestamp - trimmedDataStartTimestamp) / pieceSize + 1;

  const trimmedData = data.slice(-piecesToCut);

  return trimmedData;
};

const getFakeDataForDisplay = () => {
  // Generate 29.5 days of data
  const fakeData = generateFakeData(30);

  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
  const sixHoursInMs = 6 * 60 * 60 * 1000;
  const oneHourInMs = 1 * 60 * 60 * 1000;
  const fiveMinsInMs = 5 * 60 * 1000;

  // Optionally trim data
  const last30DaysData = trimData(fakeData, 30 * oneDayInMs, oneDayInMs);
  const last7DaysData = trimData(fakeData, 7 * oneDayInMs, sixHoursInMs);
  const last1DayData = trimData(fakeData, 1 * oneDayInMs, oneHourInMs);
  const last1HourData = trimData(fakeData, oneHourInMs, fiveMinsInMs);

  const groupedBy1Day = groupData(last30DaysData, 5, 60 * 24);
  const groupedBy6Hours = groupData(last7DaysData, 5, 60 * 6);
  const groupedBy1Hour = groupData(last1DayData, 5, 60);
  const groupedBy5Mins = groupData(last1HourData, 5, 5);

  return {
    // testGroupedBy12Hours: flipRemovedSign(batchData(testGroupedBy12Hours)),
    [oneDayInMs]: flipRemovedSign(batchData(groupedBy1Day)),
    [sixHoursInMs]: flipRemovedSign(batchData(groupedBy6Hours)),
    [oneHourInMs]: flipRemovedSign(batchData(groupedBy1Hour)),
    [fiveMinsInMs]: flipRemovedSign(batchData(groupedBy5Mins)),
  };
};

export default getFakeDataForDisplay;
