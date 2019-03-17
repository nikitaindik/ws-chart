import React from 'react';
import { timeFormat } from 'd3-time-format';
import cx from 'classnames';

import { ReactComponent as TimeIcon } from '../icons/TimeIcon.svg';

import { colors } from '../../constants';

import style from './ChartLegend.module.css';

const formatter = timeFormat('%b %d, %H:%M');

const LegendIconSquare = ({ color }) => (
  <div className={style.iconWrap} style={{ background: color }} />
);

const LegendIconLine = ({ color }) => (
  <div className={cx(style.iconWrap, style.iconWrapFlex)}>
    <div className={style.iconLine} style={{ background: color }} />
  </div>
);

const LegendItem = ({ icon, label, value, primary }) => (
  <div className={style.legendItem}>
    <div>{icon}</div>
    <div>{label}:</div>
    <div className={cx({ [style.primaryValue]: primary })}>{value}</div>
  </div>
);

const ChartLegend = ({
  hoveredBarData,
  showLatestBarData,
  latestBarData,
  activeBarSize,
}) => {
  let data;

  if (!showLatestBarData && hoveredBarData) {
    data = hoveredBarData;
  } else {
    data = latestBarData;
  }

  const { added, removed, segmentSize } = data;
  const barStartTimestamp = data.timestamp;

  const formattedTime = showLatestBarData
    ? formatter(Date.now())
    : formatter(barStartTimestamp + activeBarSize);

  return (
    <div className={style.legendWrap}>
      <div className={style.column}>
        <LegendItem
          icon={<LegendIconSquare color={colors.CHART_POSITIVE_COLOR} />}
          label={'Added'}
          value={added}
        />
        <LegendItem
          icon={<LegendIconSquare color={colors.CHART_NEGATIVE_COLOR} />}
          label={'Removed'}
          value={Math.abs(removed)}
        />
      </div>
      <div className={style.column}>
        <LegendItem
          icon={<LegendIconLine color={colors.CHART_LINE_COLOR} />}
          label={'Size'}
          value={segmentSize}
          primary
        />
        <LegendItem icon={<TimeIcon />} label={'Time'} value={formattedTime} />
      </div>
    </div>
  );
};

export default ChartLegend;
