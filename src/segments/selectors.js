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
export const selectSegments = state => {
  const segmentsIds = Object.keys(state.segments.byId);
  return segmentsIds.map(id => ({ ...state.segments.byId[id], id }));
};
