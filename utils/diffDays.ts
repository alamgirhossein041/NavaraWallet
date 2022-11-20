const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const diffDays = (end: any) => {
  const date: any = new Date(end);
  return Math.round(Math.abs((Date.now() - date) / oneDay));
};

export default diffDays;
