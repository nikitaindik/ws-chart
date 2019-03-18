import React from 'react';
import { render } from 'react-testing-library';

import Button from './Button';

test('Button snapshot', () => {
  const mockedProps = {
    onClick: jest.fn(),
  };

  const { container } = render(<Button {...mockedProps}>Hello!</Button>);
  expect(container).toMatchSnapshot();
});
