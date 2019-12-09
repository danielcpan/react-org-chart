const { createElement, useEffect } = require('react');
const { init } = require('../chart');

const TreeChart = ({
  id, tree, width, height, ...options
}) => {
  console.log('id:', id);
  console.log('tree:', tree);
  console.log('width:', width);
  console.log('height:', height);
  console.log('options:', options);
  useEffect(() => {
    init({ id: `#${id}`, data: tree, ...options });
  }, [tree]);

  return createElement('div', { id, style: { width, height } });
};

module.exports = TreeChart;
