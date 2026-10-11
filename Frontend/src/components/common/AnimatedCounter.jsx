import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ value, end, duration = 1200, prefix = '', suffix = '' }) => {
  const target = parseFloat(end !== undefined ? end : value) || 0;
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth cubic-out easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * easeOut;

      setCount(current);

      if (progress < 1) {
        countRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    countRef.current = requestAnimationFrame(step);

    return () => {
      if (countRef.current) cancelAnimationFrame(countRef.current);
    };
  }, [target, duration]);

  const formattedCount = Math.round(count).toLocaleString('en-US');

  return (
    <span className="font-mono tabular-nums tracking-tight">
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

export default AnimatedCounter;
