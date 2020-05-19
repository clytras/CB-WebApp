import { useState, useEffect } from 'react';

export default function Delayed({ children, waitBeforeShow = 300 }) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);

    return () => clearTimeout(timerId);
  }, [waitBeforeShow]);

  return isShown ? children : null;
}
