export const selectDisplayData = state =>
  (state.segments.dataBySegmentId[state.segments.activeSegmentId] &&
    state.segments.dataBySegmentId[state.segments.activeSegmentId][
      state.segments.activeBarSize
    ]) ||
  null;
