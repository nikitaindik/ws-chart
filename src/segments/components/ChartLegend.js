import React from 'react';
import { timeFormat } from 'd3-time-format';
import cx from 'classnames';

import TimeIcon from './TimeIcon';
import style from './ChartLegend.module.css';

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

const ChartLegend = ({ activeBarData, showLatestBarData, latestBarData }) => {
  let data;

  if (!showLatestBarData && activeBarData) {
    data = activeBarData;
  } else {
    data = latestBarData;
  }

  const { added, removed, segmentSize, timestamp } = data;

  const formatter = timeFormat('%b %d, %H:%M');
  const formattedTime = formatter(timestamp);

  return (
    <div className={style.legendWrap}>
      <div className={style.column}>
        <LegendItem
          icon={<LegendIconSquare color="#6c59d3" />}
          label={'Added'}
          value={added}
        />
        <LegendItem
          icon={<LegendIconSquare color="#999ea1" />}
          label={'Removed'}
          value={Math.abs(removed)}
        />
      </div>
      <div className={style.column}>
        <LegendItem
          icon={<LegendIconLine color="#008af7" />}
          label={'Size'}
          value={segmentSize}
          primary
        />
        {!showLatestBarData && (
          <LegendItem
            icon={<TimeIcon />}
            label={'Time'}
            value={formattedTime}
          />
        )}
      </div>
    </div>
  );
};

export default ChartLegend;
