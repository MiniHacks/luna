export const sleep = (n: number): Promise<void> =>
  new Promise((r) => {
    setTimeout(r, n);
  });
