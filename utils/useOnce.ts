import { useEffect, useState } from 'react';

export const useOnce = (key: string) => {
  const lsKey = `once.${key}`;
  const [used, setUsed] = useState(false);

  useEffect(() => {
    setUsed(window.localStorage.getItem(lsKey) !== null);
  }, [lsKey]);

  const markAsUsed = () => {
    localStorage.setItem(lsKey, '');
    setUsed(true);
  };

  return {
    used,
    markAsUsed,
  };
};
