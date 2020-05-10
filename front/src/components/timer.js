import React, { useState, useEffect } from 'react';

const Timer = ({}) => {
  const [seconds, setSeconds] = useState(20);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if(seconds<=0){
        setActive(false)
    }
    if (active) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!active && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active, seconds]);

  return (

      <div >
        {seconds}s
      </div>

  );
};

export default Timer;
