import { get } from 'dot-prop-immutable';

export const selectActiveBarSize = state => state.segments.activeBarSize;

export const selectActiveSegmentId = state => state.segments.activeSegmentId;

export const selectDisplayData = state => {
  const activeSegmentId = selectActiveSegmentId(state);
  const activeBarSize = selectActiveBarSize(state);

  return get(
    state,
    `segments.byId.${activeSegmentId}.dataByBarSize.${activeBarSize}`,
    null,
  );
};

export const selectSegments = state =>
  state.segments.list.allIds.map(
    segmentId => state.segments.list.byId[segmentId],
  );

export const selectIsListLoaded = state => state.segments.list.isLoaded;
