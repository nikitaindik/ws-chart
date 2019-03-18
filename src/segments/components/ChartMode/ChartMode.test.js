import React from 'react';
import { render } from 'react-testing-library';

import ChartMode from './ChartMode';

test('ChartMode snapshot', () => {
  const mockedProps = {
    activeBarSize: '360000',
    onChangeModeClick: jest.fn(),
  };

  const { container } = render(<ChartMode {...mockedProps} />);
  expect(container).toMatchSnapshot();
});
