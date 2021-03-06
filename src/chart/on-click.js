const d3 = require('d3');
const { collapse } = require('../utils');

module.exports = onClick;

const collpaseChildren = ({ config, datum }) => {
  config.callerMode = 0;
  datum._children = datum.children;
  datum.children = null;
  d3.selectAll(`#has-child-icon-${datum.id}`).transition()
    .duration(200)
    .style('visibility', 'visible')
    .style('opacity', 1);
};

const expandChildren = ({ config, datum }) => {
  config.callerMode = 1;
  datum.children = datum._children;
  datum._children = null;
  d3.select(`#has-child-icon-${datum.id}`)
    .style('visibility', 'hidden')
    .style('opacity', 0);
};

const handleCollapseExpand = ({ config, datum }) => {
  config.callerNode = datum;
  if (datum.children) collpaseChildren({ config, datum });
  else expandChildren({ config, datum });
};

function onClick(config = {}) {
  const { loadChildren, render, onPersonClick } = config;

  return (datum) => {
    console.log('clicked:', datum);
    if (onPersonClick) {
      const result = onPersonClick(datum, d3.event);

      // If the `onPersonClick` handler returns `false`
      // Cancel the rest of this click handler
      if (typeof result === 'boolean' && !result) return;
    }

    const hasLoadedChildren = datum.children || datum._children;
    if (!hasLoadedChildren && datum.hasChild) {
      if (!loadChildren) {
        console.error(
          'react-org-chart.onClick: loadChildren() not found in config',
        );
        return;
      }

      const result = loadChildren(datum);
      const handler = handleChildrenResult(config, datum);

      // Check if the result is a promise and render the children
      if (result.then) return result.then(handler);
      return handler(result);
    }

    handleCollapseExpand({ config, datum });

    // Pass in the clicked datum as the sourceNode which
    // tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: datum,
    });
  };
}

// function handleChildrenResult(config, datum) {
function handleChildrenResult(config, datum) {
  const { tree, render } = config;

  return (children) => {
    const result = { ...datum, children };

    // Collapse the nested children
    children.forEach(collapse);

    result.children.forEach((child) => {
      if (!tree.nodes(datum)[0]._children) tree.nodes(datum)[0]._children = [];

      child.x = datum.x;
      child.y = datum.y;
      child.x0 = datum.x0;
      child.y0 = datum.y0;

      tree.nodes(datum)[0]._children.push(child);
    });

    handleCollapseExpand({ config, datum });

    // Pass in the newly rendered datum as the sourceNode
    // which tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: result,
    });
  };
}
