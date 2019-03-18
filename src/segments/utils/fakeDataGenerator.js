import { time } from '../constants';

const getUpdate = currentSegmentSize => {
  // Aiming for a slightly upward pointing chart
  const added = Math.random() > 0.89 ? 1 : 0;
  let removed = Math.random() > 0.9 ? -1 : 0;

  if (Math.abs(removed) > currentSegmentSize + added) {
    // Do not drop segment size below 0
    removed = -currentSegmentSize;
  }

  const segmentSize = currentSegmentSize + added + removed;

  return {
    added,
    removed,
    segmentSize,
  };
};

const generateDataForPeriod = (startTimestamp, endTimestamp, step) => {
  let currentSegmentSize = 0;
  const result = [];

  for (
    let currentTimestamp = startTimestamp;
    currentTimestamp < endTimestamp;
    currentTimestamp += step
  ) {
    const update = getUpdate(currentSegmentSize);
    currentSegmentSize = update.segmentSize;

    result.push({
      timestamp: currentTimestamp,
      ...update,
    });
  }

  return result;
};

const generateFakeData = days => {
  // Generates specified number of days of fake data
  // Generated data starts at the beginning of a day

  const endTimestamp = Date.now();
  const startTimestamp = new Date(
    endTimestamp - days * time.ONE_DAY_IN_MS,
  ).setHours(24, 0, 0, 0);

  return generateDataForPeriod(
    startTimestamp,
    endTimestamp,
    time.FIVE_MINUTES_IN_MS,
  );
};

const groupData = (data, inputSize, outputSize) => {
  // Groups data into arrays of given size
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
  // Reduces groups of data into a single value - bar to be drawn on the screen
  return slices.map(slice => {
    const grouped = slice.reduce((result, sliceItem, itemIndex) => {
      if (itemIndex === 0) {
        return { ...sliceItem };
      }

      result.added += sliceItem.added;
      result.removed += sliceItem.removed;
      result.segmentSize =
        result.segmentSize + sliceItem.added + sliceItem.removed;

      return result;
    }, {});

    return grouped;
  });
};

const getLastBarEndTimestamp = (data, barSize) => {
  const latestTimestamp = data[data.length - 1].timestamp;
  const dayStartTimestamp = new Date(latestTimestamp).setHours(0, 0, 0, 0);
  const barsElapsedSinceDayStart = Math.ceil(
    (latestTimestamp - dayStartTimestamp) / barSize,
  );

  return dayStartTimestamp + barsElapsedSinceDayStart * barSize;
};

const trimData = (data, period, barSize) => {
  // Trims data to a specified period
  // Trimmed data doesn't start in the middle of the bar

  const lastBarEndTimestamp = getLastBarEndTimestamp(data, barSize);
  const trimmedDataStartTimestamp = lastBarEndTimestamp - period;

  const pieceSize = data[1].timestamp - data[0].timestamp;
  const latestTimestamp = data[data.length - 1].timestamp;

  const piecesToCutCount =
    (latestTimestamp - trimmedDataStartTimestamp) / pieceSize + 1;

  const trimmedData = data.slice(-piecesToCutCount);

  return trimmedData;
};

const reduceDataForDisplay = (
  data,
  outputSize,
  inputSize = time.FIVE_MINUTES_IN_MS,
) => {
  return batchData(groupData(data, inputSize, outputSize));
};

const generateFakeDataForDisplay = () => {
  // Generate multiple days of small pieces of data. These small pieces will be reduced into bars.
  const fakeData = generateFakeData(30);

  // Trim data since we will not show all of it
  const last30DaysData = trimData(
    fakeData,
    30 * time.ONE_DAY_IN_MS,
    time.ONE_DAY_IN_MS,
  );
  const last7DaysData = trimData(
    fakeData,
    time.SEVEN_DAYS_IN_MS,
    time.SIX_HOURS_IN_MS,
  );
  const last1DayData = trimData(
    fakeData,
    time.ONE_DAY_IN_MS,
    time.ONE_HOUR_IN_MS,
  );
  const last1HourData = trimData(
    fakeData,
    time.ONE_HOUR_IN_MS,
    time.FIVE_MINUTES_IN_MS,
  );

  // Reduce generated pieces of data into bars of selected size
  const groupedBy1Day = reduceDataForDisplay(
    last30DaysData,
    time.ONE_DAY_IN_MS,
  );
  const groupedBy6Hours = reduceDataForDisplay(
    last7DaysData,
    time.SIX_HOURS_IN_MS,
  );
  const groupedBy1Hour = reduceDataForDisplay(
    last1DayData,
    time.ONE_HOUR_IN_MS,
  );
  const groupedBy5Mins = reduceDataForDisplay(
    last1HourData,
    time.FIVE_MINUTES_IN_MS,
  );

  return {
    [time.ONE_DAY_IN_MS]: groupedBy1Day,
    [time.SIX_HOURS_IN_MS]: groupedBy6Hours,
    [time.ONE_HOUR_IN_MS]: groupedBy1Hour,
    [time.FIVE_MINUTES_IN_MS]: groupedBy5Mins,
  };
};

export default generateFakeDataForDisplay;
