const { wrapText, helpers } = require('../utils');
const renderLines = require('./render-lines');
const onClick = require('./on-click');
const iconLink = require('./components/icon-link');
const settingsIcon = require('./components/settings-icon');

const CHART_NODE_CLASS = 'org-chart-node';
const PERSON_LINK_CLASS = 'org-chart-person-link';
const PERSON_NAME_CLASS = 'org-chart-person-name';
const PERSON_TITLE_CLASS = 'org-chart-person-title';
const PERSON_DEPARTMENT_CLASS = 'org-chart-person-dept';
const PERSON_REPORTS_CLASS = 'org-chart-person-reports';

const renderNodeCard = (nodeEnter, config) => {
  const {
    svgroot,
    svg,
    tree,
    animationDuration,
    nodeWidth,
    nodeHeight,
    nodePaddingX,
    nodePaddingY,
    nodeBorderRadius,
    backgroundColor,
    nameColor,
    titleColor,
    reportsColor,
    borderColor,
    avatarWidth,
    lineDepthY,
    treeData,
    sourceNode,
    onPersonLinkClick,
    handleEdit,
    handleMove,
    handleAdd,
    nodeProps,
  } = config;

  // Person Card Shadow
  const cardShadow = nodeEnter
    .append('rect')
    .attr('class', 'card-shadow')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .attr('fill-opacity', 0.05)
    .attr('stroke-opacity', 0.025)
    .attr('filter', 'url(#boxShadow)');

  // Person Card Container
  const cardContainer = nodeEnter
    .append('rect')
  // .attr('class', 'org-chart-container')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('id', (d) => d.id)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .style('cursor', helpers.getCursorForNode)
    .attr('class', 'box');

  const namePos = {
    x: nodePaddingX * 1.4 + avatarWidth,
    y: nodePaddingY * 1.8,
  };

  // Person's Name
  const cardPrimaryText = nodeEnter
    .append('text')
    .attr('class', `${PERSON_NAME_CLASS} unedited`)
    .attr('x', namePos.x)
    .attr('y', namePos.y)
    .attr('dy', '.3em')
    .style('cursor', 'pointer')
    .style('fill', nameColor)
    .style('font-size', 16)
    .text((d) => d.nodeProps.primaryText);

  // Person's Reports
  const SOPsText = nodeEnter
    .append('text')
    .attr('class', PERSON_REPORTS_CLASS)
    .attr('x', namePos.x)
  // .attr('y', namePos.y + nodePaddingY + heightForTitle)
    .attr('y', 50)
    .attr('dy', '.9em')
    .style('font-size', 14)
    .style('font-weight', 500)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    // .text((d) => `${d.itemMap.deptSOPs.allIds.length} SOPs`);
    .text((d) => `${d.itemMap.SOPIds.length} SOPs`);

  // Person's Reports
  const usersText = nodeEnter
    .append('text')
    .attr('class', PERSON_REPORTS_CLASS)
    .attr('x', 130)
  // .attr('y', namePos.y + nodePaddingY + heightForTitle)
    .attr('y', 50)
    .attr('dy', '.9em')
    .style('font-size', 14)
    .style('font-weight', 500)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    // .text((d) => `${d.itemMap.deptUsers.allIds.length} Users`);
    .text((d) => `${d.itemMap.userIds.length} Users`);
  // .text(helpers.getTextForTitle)

  // Person's Avatar
  const avatar = nodeEnter
    .append('circle')
    .attr('cx', 33)
    .attr('cy', 40)
    .attr('r', '20')
    .attr('fill', 'gray');

  // Person's Department
  const departmentText = nodeEnter
    .append('text')
  // .attr('class', getDepartmentClass)
    .attr('x', 33)
    .attr('y', 33)
    .attr('dy', '.9em')
    .style('fill', 'white')
    .style('font-weight', 600)
    .style('font-size', 16)
    .attr('text-anchor', 'middle')
    .text((d) => d.nodeProps.primaryText
      .split(' ')
      .map((el) => el.charAt(0).toUpperCase())
      .join(''));
  // .text(helpers.getTextForDepartment)

  // Person's Link
  const plusLink = nodeEnter
    .append('a')
    .attr('class', PERSON_LINK_CLASS)
  // .attr('xlink:href', d => d.person.link || 'https://lattice.com')
  // .attr('xlink:href', d => 'https://lattice.com')
    .on('click', (datum) => {
      console.log('ADDING NEW NODE!');
      // console.log('d3.event:', d3.event);
      d3.event.stopPropagation();
      // // TODO: fire link click handler
      if (onPersonLinkClick) {
        // handleAdd(datum, d3.event);
      }
    });

  settingsIcon({
    svg: plusLink,
    x: nodeWidth - 28,
    y: nodeHeight - 66,
    config,
  });

  // Person's Link
  const personLink = nodeEnter
    .append('a')
    .attr('class', PERSON_LINK_CLASS)
  // .attr('xlink:href', d => d.person.link || 'https://lattice.com')
  // .attr('xlink:href', d => 'https://lattice.com')
    .on('click', (datum) => {
      console.log('d3.event:', d3.event);
      d3.event.stopPropagation();
      // TODO: fire link click handler
      if (onPersonLinkClick) {
        onPersonLinkClick(datum, d3.event);
      }
    });

  iconLink({
    svg: personLink,
    x: nodeWidth - 28,
    y: nodeHeight - 28,
  });
};


function render(config) {
  const {
    svgroot,
    svg,
    tree,
    animationDuration,
    nodeWidth,
    nodeHeight,
    nodePaddingX,
    nodePaddingY,
    nodeBorderRadius,
    backgroundColor,
    nameColor,
    titleColor,
    reportsColor,
    borderColor,
    avatarWidth,
    lineDepthY,
    treeData,
    sourceNode,
    onPersonLinkClick,
    handleEdit,
    handleMove,
    handleAdd,
    nodeProps,
    collapseAllInitial,
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
    .attr('transform', (d) => {
      // console.log('d:', d);
      if (d.isCollapsed) return;
      return `translate(${parentNode.x0}, ${parentNode.y0})`;
    })
    // .attr('transform', (d) => {
    //   if (!collapseAllInitial) { `translate(${parentNode.x0}, ${parentNode.y0})`; }
    // })
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
  const nodeExit = node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', (d) => `translate(${parentNode.x},${parentNode.y})`)
    .remove();

  // Update the links
  const link = svg.selectAll('path.link').data(links, (d) => d.target.id);

  // Wrap the title texts
  const wrapWidth = 140;

  // svg.selectAll('text.unedited.' + PERSON_TITLE_CLASS).call(wrapText, wrapWidth)
  svg.selectAll(`text.unedited.${PERSON_NAME_CLASS}`).call(wrapText, wrapWidth);

  // Render lines connecting nodes
  renderLines(config);

  // Stash the old positions for transition.
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function getDepartmentClass(d) {
  const { person } = d;
  const deptClass = person.department ? person.department.toLowerCase() : '';

  return [PERSON_DEPARTMENT_CLASS, deptClass].join(' ');
}

module.exports = render;
