import { useState } from 'react';

export const useOpen = () => {
  const [opened, setOpened] = useState(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const toggle = () => setOpened((value) => !value);

  return {
    opened,
    open,
    close,
    toggle,
  };
};
