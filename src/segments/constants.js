export const socketEventTypes = {
  REQUEST_SEGMENT_HISTORY: 'REQUEST_SEGMENT_HISTORY',
  SEGMENT_HISTORY: 'SEGMENT_HISTORY',
  SEGMENT_UPDATE: 'SEGMENT_UPDATE',
};

export const colors = {
  CHART_POSITIVE_COLOR: '#6c59d3',
  CHART_NEGATIVE_COLOR: '#999ea1',
  CHART_LINE_COLOR: '#008af7',
};

const ONE_MINUTE_IN_MS = 60 * 1000;
const FIVE_MINUTES_IN_MS = 5 * ONE_MINUTE_IN_MS;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
const SIX_HOURS_IN_MS = 6 * ONE_HOUR_IN_MS;
const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
const SEVEN_DAYS_IN_MS = 7 * ONE_DAY_IN_MS;

export const time = {
  ONE_MINUTE_IN_MS,
  FIVE_MINUTES_IN_MS,
  SIX_HOURS_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_DAY_IN_MS,
  SEVEN_DAYS_IN_MS,
};
