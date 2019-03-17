import React from 'react';

import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryVoronoiContainer,
} from 'victory';

import style from './Chart.module.css';

const Chart = ({ data, setActiveBarData, setIsHovered }) => (
  <div
    className={style.chartWrap}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <VictoryChart
      animate={false}
      padding={{ top: 20, left: 30, right: 30, bottom: 50 }}
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
        style={{ data: { fill: '#6c59d3' } }}
        // animate
      />
      <VictoryBar
        data={data}
        x="timestamp"
        y="removed"
        name="removed"
        style={{ data: { fill: '#999ea1' } }}
        // animate
      />
      <VictoryLine
        data={data}
        x="timestamp"
        y="segmentSize"
        name="segmentSize"
        interpolation="natural"
        style={{ data: { stroke: '#008af7' } }}
        // animate
      />
      <VictoryScatter
        data={data}
        x="timestamp"
        y="segmentSize"
        size={(datum, active) => (active ? 5 : 0)}
        style={{
          data: { fill: '#008af7', stroke: '#fff', strokeWidth: '1px' },
        }}
        // animate
      />
    </VictoryChart>
  </div>
);

export default Chart;
