const { wrapText, helpers } = require('../utils');
const renderLines = require('./render-lines');
const onClick = require('./on-click');
const iconLink = require('./components/icon-link');
const settingsIcon = require('./components/settings-icon');
const hasChildIcon = require('./components/has-child-icon');

const CHART_NODE_CLASS = 'org-chart-node';
const PERSON_LINK_CLASS = 'org-chart-person-link';
const PERSON_NAME_CLASS = 'org-chart-person-name';
const PERSON_TITLE_CLASS = 'org-chart-person-title';
const PERSON_REPORTS_CLASS = 'org-chart-person-reports';

const renderNodeCard = (nodeEnter, config) => {
  const {
    nodeWidth,
    nodeHeight,
    nodePaddingX,
    nodePaddingY,
    nodeBorderRadius,
    hasSettings,
    backgroundColor,
    nameColor,
    titleColor,
    reportsColor,
    borderColor,
    avatarWidth,
    treeData,
    onPersonLinkClick,
  } = config;

  const isRoot = (d) => d.parentId === treeData.parentId;

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
    x: nodePaddingX + 8 + avatarWidth,
    y: nodePaddingY + 8,
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

  nodeEnter
    .append('text')
    .attr('class', `${PERSON_TITLE_CLASS} unedited`)
    .attr('x', namePos.x)
    .attr('y', (d) => {
      let y = namePos.y + nodePaddingY + 4;
      if (d.nodeProps.primaryText.length > 19) y += 16;
      return y;
    })
    .attr('dy', '0.1em')
    .style('font-size', 14)
    .style('cursor', 'pointer')
    .style('fill', titleColor)
    .text((d) => d.nodeProps.secondaryText);

  const firstBulletText = nodeEnter.append('text')
    .attr('class', PERSON_REPORTS_CLASS)
    .attr('x', namePos.x)
    .attr('y', ({ nodeProps: { primaryText, secondaryText } }) => {
      let y = namePos.y + nodePaddingY;
      if (primaryText && primaryText.length > 19) y += 18;
      if (secondaryText && secondaryText.length > 0) y += 16;
      if (secondaryText && secondaryText.length > 19) y += 16;
      return y;
    })
    .attr('dy', '.3em')
    .style('font-size', 12)
    .style('font-weight', 500)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    .text(({ nodeProps: { firstBullet } }) => (firstBullet ? `• ${firstBullet}` : null));

  const secondBulletText = nodeEnter.append('text')
    .attr('class', PERSON_REPORTS_CLASS)
    .attr('x', namePos.x)
    .attr('y', ({ nodeProps: { primaryText, secondaryText } }) => {
      let y = namePos.y + nodePaddingY + 12;
      if (primaryText && primaryText.length > 19) y += 18;
      if (secondaryText && secondaryText.length > 0) y += 16;
      if (secondaryText && secondaryText.length > 19) y += 16;
      return y;
    })
    .attr('dy', '.3em')
    .style('font-size', 12)
    .style('font-weight', 500)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    .text(({ nodeProps: { secondBullet } }) => (secondBullet ? `• ${secondBullet}` : null));

  const grayBackground = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png';
  // Person's Avatar
  const avatar = nodeEnter
    .append('image')
    .attr('width', avatarWidth)
    .attr('height', avatarWidth)
    .attr('x', nodePaddingX)
    .attr('y', nodePaddingY)
    .attr('stroke', 'gray')
    .attr('src', ({ nodeProps: { avatarSrc } }) => (avatarSrc || grayBackground))
    .attr('xlink:href', ({ nodeProps: { avatarSrc } }) => (avatarSrc || grayBackground))
    .attr('clip-path', 'url(#avatarClip)');

  const getAvatarText = (d) => {
    if (d.nodeProps.avatarSrc) return null;
    if (d.nodeProps.avatarText) return d.nodeProps.avatarText;
    return d.nodeProps.primaryText
      .split(' ').slice(0, 2)
      .map((el) => el.charAt(0).toUpperCase())
      .join('');
  };
  // Person's Department
  const departmentText = nodeEnter
    .append('text')
    .attr('x', 33)
    .attr('y', 25)
    .attr('dy', '.9em')
    .style('fill', 'white')
    .style('font-weight', 600)
    .style('font-size', 16)
    .attr('text-anchor', 'middle')
    .text((d) => getAvatarText(d));

  const nodeId = nodeEnter
    .append('text')
    .attr('x', 33)
    .attr('y', 57)
    .attr('dy', '.9em')
    .style('fill', (d) => d.nodeProps.idColor || 'black')
    .style('font-weight', 600)
    .style('font-size', 11)
    .attr('text-anchor', 'middle')
    .text((d) => `#${d.id}`);

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
  // Person's Link
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
      // TODO: fire link click handler
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
    .attr('transform', (d) => {
      if (d.isCollapsed) return;
      return `translate(${parentNode.x0}, ${parentNode.y0})`;
    })
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

  svg.selectAll(`text.unedited.${PERSON_TITLE_CLASS}`).call(wrapText, wrapWidth);
  svg.selectAll(`text.unedited.${PERSON_NAME_CLASS}`).call(wrapText, wrapWidth);

  // Render lines connecting nodes
  renderLines(config);

  // Stash the old positions for transition.
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

module.exports = render;
