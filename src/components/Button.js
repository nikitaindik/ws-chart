import React from 'react';
import cx from 'classnames';

import style from './Button.module.css';

const Button = ({ onClick, children, isActive }) => {
  const className = cx(style.button, { [style.active]: isActive });
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
