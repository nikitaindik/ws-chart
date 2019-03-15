const fetchSegmentList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'Tomato lovers', id: 10 },
        { name: 'Lemon aficionados', id: 20 },
      ]);
    }, 3000);
  });
};

export default {
  fetchSegmentList,
};
