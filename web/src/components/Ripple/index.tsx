import React from 'react';
import './Ripple.scss';

interface RippleProps {
  children?: React.ReactNode;
}

function Ripple(props: RippleProps): React.ReactElement {
  const { children } = props;

  return (
    <div className='ripple'>
      {children}
      <div className='circle1'></div>
      <div className='circle2'></div>
      <div className='circle3'></div>
    </div>
  );
}

export default Ripple;
