export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;

  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;

  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};
