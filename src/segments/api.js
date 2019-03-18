const fetchSegmentList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'Tomato lovers', id: '10' },
        { name: 'Lemon aficionados', id: '20' },
        { name: 'Banana people', id: '30' },
      ]);
    }, 3000);
  });
};

export default {
  fetchSegmentList,
};
