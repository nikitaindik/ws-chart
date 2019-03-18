import React from 'react';

import Button from '../../../components/Button';

import { time } from '../../constants';

import style from './ChartMode.module.css';

const modes = [
  { label: 'Last 30 days', barSize: time.ONE_DAY_IN_MS },
  { label: 'Last 7 days', barSize: time.SIX_HOURS_IN_MS },
  { label: 'Last 24 hours', barSize: time.ONE_HOUR_IN_MS },
  { label: 'Last 60 minutes', barSize: time.FIVE_MINUTES_IN_MS },
];

const ChartMode = ({ activeBarSize, onChangeModeClick }) => (
  <div className={style.wrap}>
    {modes.map(mode => (
      <Button
        isActive={activeBarSize === mode.barSize}
        onClick={() => onChangeModeClick(mode.barSize)}
        key={mode.barSize}
      >
        {mode.label}
      </Button>
    ))}
  </div>
);

export default ChartMode;
