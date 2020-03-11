const { createElement, useEffect } = require('react');
const { init } = require('..');

const TreeChart = ({
  id = 'react-org-chart', tree, width, height, isViewOnly, ...rest
}) => {
  useEffect(() => {
    init({ id: `#${id}`, data: tree, ...rest });
  }, [tree, isViewOnly]);

  return createElement('div', { id, style: { width, height } });
};

module.exports = TreeChart;
