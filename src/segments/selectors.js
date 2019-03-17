export const selectDisplayData = state => {
  const activeSegmentId = state.segments.activeSegmentId;
  const activeBarSize = state.segments.activeBarSize;

  return (
    (state.segments.byId[activeSegmentId] &&
      state.segments.byId[activeSegmentId].dataByBarSize &&
      state.segments.byId[activeSegmentId].dataByBarSize[activeBarSize]) ||
    null
  );
};

export const selectSegments = state =>
  state.segments.list.allIds.map(
    segmentId => state.segments.list.byId[segmentId],
  );
