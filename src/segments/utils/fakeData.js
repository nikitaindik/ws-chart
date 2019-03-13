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

const generateFakeData = () => {
  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
  const fiveMinsInMs = 5 * 60 * 1000;
  const finishTimestamp = new Date().getTime();
  const startTimestamp = finishTimestamp - 30 * oneDayInMs;

  let currentSegmentSize = 0;
  const result = [];

  for (
    let currentTimestamp = startTimestamp;
    currentTimestamp < finishTimestamp;
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

const getFakeDataForDisplay = () => {
  const fakeData = generateFakeData();

  const thirtyDaysOfData = fakeData;
  const sevenDaysOfData = fakeData.slice(-(fakeData.length / 7));
  const oneDayOfData = fakeData.slice(-(fakeData.length / 30));

  const thirtyDaysGroupedBy1Day = groupData(thirtyDaysOfData, 5, 60 * 24);
  const sevenDaysGroupedBy6Hours = groupData(sevenDaysOfData, 5, 60 * 6);
  const oneDayGroupedBy1Hour = groupData(oneDayOfData, 5, 60);
  //   const thirtyDaysGroupedBy1Day = groupData(thirtyDaysOfData, 5, 60 * 24);
  //   const testGroupedBy12Hours = groupData(thirtyDaysOfData, 5, 60 * 12);
  //   const sevenDaysGroupedBy6Hours = groupData(thirtyDaysOfData, 5, 60 * 6);
  //   const oneDayGroupedBy1Hour = groupData(thirtyDaysOfData, 5, 60);

  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
  const sixHoursInMs = 6 * 60 * 60 * 1000;
  const oneHourInMs = 1 * 60 * 60 * 1000;

  return {
    // testGroupedBy12Hours: flipRemovedSign(batchData(testGroupedBy12Hours)),
    [oneDayInMs]: flipRemovedSign(batchData(thirtyDaysGroupedBy1Day)),
    [sixHoursInMs]: flipRemovedSign(batchData(sevenDaysGroupedBy6Hours)),
    [oneHourInMs]: flipRemovedSign(batchData(oneDayGroupedBy1Hour)),
  };
};

export default getFakeDataForDisplay;
