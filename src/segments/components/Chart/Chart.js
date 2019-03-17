import React from 'react';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryVoronoiContainer,
} from 'victory';

import { colors } from '../../constants';

import style from './Chart.module.css';

const Chart = ({ data, setActiveBarData, setIsHovered }) => (
  <div
    className={style.chartWrap}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <VictoryChart
      animate={false}
      padding={{ top: 20, left: 40, right: 40, bottom: 50 }}
      domainPadding={20}
      scale={{ x: 'time' }}
      height={300}
      width={700}
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          onActivated={points => {
            const { added, removed, segmentSize, timestamp } = points[0];
            setActiveBarData({
              added,
              removed,
              segmentSize,
              timestamp,
            });
          }}
        />
      }
    >
      <VictoryAxis offsetY={50} />
      <VictoryAxis
        // animate
        dependentAxis
        style={{
          grid: {
            stroke: '#999ea1',
            opacity: 0.5,
          },
        }}
      />
      <VictoryBar
        data={data}
        x="timestamp"
        y="added"
        name="added"
        style={{ data: { fill: colors.CHART_POSITIVE_COLOR } }}
        // animate
      />
      <VictoryBar
        data={data}
        x="timestamp"
        y="removed"
        name="removed"
        style={{ data: { fill: colors.CHART_NEGATIVE_COLOR } }}
        // animate
      />
      <VictoryLine
        data={data}
        x="timestamp"
        y="segmentSize"
        name="segmentSize"
        interpolation="natural"
        style={{ data: { stroke: colors.CHART_LINE_COLOR } }}
        // animate
      />
      <VictoryScatter
        data={data}
        x="timestamp"
        y="segmentSize"
        size={(datum, active) => (active ? 5 : 0)}
        style={{
          data: {
            fill: colors.CHART_LINE_COLOR,
            stroke: '#fff',
            strokeWidth: '1px',
          },
        }}
        // animate
      />
    </VictoryChart>
  </div>
);

export default Chart;
