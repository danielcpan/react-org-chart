const wrapText = require('./wrap-text');
const renderLines = require('./render-lines');
const onClick = require('./on-click');
const iconLink = require('./components/icon-link');
const settingsIcon = require('./components/settings-icon');
const hasChildIcon = require('./components/has-child-icon');

// const CHART_NODE_CLASS = 'org-chart-node';
// const PERSON_LINK_CLASS = 'org-chart-person-link';

const CHART_NODE_CLASS = 'org-chart-node';
const PERSON_LINK_CLASS = 'org-chart-person-link';
const PERSON_NAME_CLASS = 'org-chart-person-name';
const PERSON_TITLE_CLASS = 'org-chart-person-title';

const renderNodeCard = (nodeEnter, config) => {
  const {
    nodeWidth,
    nodeHeight,
    hasSettings,
    treeData,
    onPersonLinkClick,
    renderItem,
  } = config;
  const isRoot = (d) => d.id === treeData.id;

  renderItem({ svg: nodeEnter, config, wrapText });


  const hasChildSvg = nodeEnter
    .append('a')
    .attr('class', PERSON_LINK_CLASS)
    .attr('id', (d) => `has-child-icon-${d.id}`)
    .style('visibility', (d) => (d.hasChild && !isRoot(d) && !d.children ? 'visible' : 'hidden'));

  hasChildIcon({
    svg: hasChildSvg,
    x: nodeWidth - 126,
    y: nodeHeight,
    config,
  });

  if (hasSettings) {
    const settingsLink = nodeEnter
      .append('a')
      .attr('class', PERSON_LINK_CLASS)
      .on('click', () => d3.event.stopPropagation());

    settingsIcon({
      svg: settingsLink,
      x: nodeWidth - 28,
      y: 10,
      config,
    });
  }

  // Person's Link
  const personLink = nodeEnter
    .append('a')
    .attr('class', PERSON_LINK_CLASS)
    .on('click', (datum) => {
      d3.event.stopPropagation();
      if (onPersonLinkClick) onPersonLinkClick(datum, d3.event);
    });

  iconLink({
    svg: personLink,
    x: nodeWidth - 28,
    y: nodeHeight - 28,
  });
};


function render(config) {
  const {
    svg,
    tree,
    animationDuration,
    backgroundColor,
    borderColor,
    lineDepthY,
    treeData,
    sourceNode,
  } = config;

  // Compute the new tree layout.
  const nodes = tree.nodes(treeData).reverse();
  const links = tree.links(nodes);

  config.links = links;
  config.nodes = nodes;

  // Normalize for fixed-depth.
  nodes.forEach((d) => {
    d.y = d.depth * lineDepthY;
  });

  // Update the nodes
  const node = svg
    .selectAll(`g.${CHART_NODE_CLASS}`)
    .data(nodes.filter((d) => d.id), (d) => d.id);

  const parentNode = sourceNode || treeData;

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .insert('g')
    .attr('class', CHART_NODE_CLASS)
    .attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`)
    .on('click', onClick(config));

  renderNodeCard(nodeEnter, config);


  // Transition nodes to their new position.
  const nodeUpdate = node
    .transition()
    .duration(animationDuration)
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  nodeUpdate
    .select('rect.box')
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor);

  // Transition exiting nodes to the parent's new position.
  node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', (d) => `translate(${parentNode.x},${parentNode.y})`)
    .remove();

  // Update the links
  svg.selectAll('path.link').data(links, (d) => d.target.id);

  const wrapWidth = 140;

  if (config.wrapPrimary) {
    svg
      .selectAll(`text.unedited.${PERSON_NAME_CLASS}`)
      .call(wrapText, wrapWidth);
  }

  if (config.wrapSecondary) {
    svg
      .selectAll(`text.unedited.${PERSON_TITLE_CLASS}`)
      .call(wrapText, wrapWidth);
  }

  // Render lines connecting nodes
  renderLines(config);

  // Stash the old positions for transition.
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

module.exports = render;
