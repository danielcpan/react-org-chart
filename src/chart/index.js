const d3 = require('d3');
const { collapse } = require('../utils');
const render = require('./render');
const renderUpdate = require('./render-update');
const defaultConfig = require('./config');

function init(options) {
  // Merge options with the default config
  const config = {
    ...defaultConfig,
    ...options,
    treeData: options.data,
  };

  if (!config.id) {
    console.error('react-org-chart: missing id for svg root');
    return;
  }

  const {
    id,
    treeData,
    lineType,
    margin,
    nodeWidth,
    nodeHeight,
    nodeSpacing,
    shouldResize,
    collapseAllInitial,
  } = config;

  // Calculate how many pixel nodes to be spaced based on the
  // type of line that needs to be rendered
  config.lineDepthY = nodeHeight + 40;
  if (lineType === 'angle') config.lineDepthY += 20;

  // Get the root element
  const elem = document.querySelector(id);

  if (!elem) {
    console.error(`react-org-chart: svg root DOM node not found (id: ${id})`);
    return;
  }

  // Reset in case there's any existing DOM
  elem.innerHTML = '';

  const elemWidth = elem.offsetWidth;
  const elemHeight = elem.offsetHeight;

  // Setup the d3 tree layout
  config.tree = d3.layout
    .tree()
    .nodeSize([nodeWidth + nodeSpacing, nodeHeight + nodeSpacing]);

  // Calculate width of a node with expanded children
  const children = treeData.children || treeData._children;
  const childrenWidth = children ? parseInt(children.length * nodeWidth / 2) : 0;

  // Add svg root for d3
  const svgroot = d3
    .select(id)
    .append('svg')
    .attr('width', elemWidth)
    .attr('height', elemHeight)
    .on('click', (d) => {
      const allMenus = d3.selectAll('.settings-menu-container')
        .style('opacity', 0)
        .style('visibility', 'visible');
      allMenus[0].forEach(({ __data__ }) => { __data__.isMenuOpen = false; });
    });

  // Add our base svg group to transform when a user zooms/pans
  const svg = svgroot
    .append('g')
    .attr(
      'transform',
      `translate(${
        parseInt(
          childrenWidth + (elemWidth - childrenWidth * 2) / 2 - margin.left / 2,
        )
      },${
        20
      })`,
    );

  // Center the viewport on initial load
  treeData.x0 = 0;
  treeData.y0 = elemHeight / 2;

  // Collapse all of the children on initial load
  if (collapseAllInitial && treeData.children && treeData.children.length) {
    treeData.children.forEach(collapse);
  }

  // Connect core variables to config so that they can be
  // used in internal rendering functions
  config.svg = svg;
  config.svgroot = svgroot;
  config.render = render;
  config.isMenuOpen = false;

  // // Defined zoom behavior
  const zoom = d3.behavior
    .zoom()
    // Define the [zoomOutBound, zoomInBound]
    .scaleExtent([0.4, 2])
    .duration(50)
    .on('zoom', renderUpdate(config));

  // Attach zoom behavior to the svg root
  svgroot.call(zoom);

  // Define the point of origin for zoom transformations
  zoom.translate([
    parseInt(
      childrenWidth + (elemWidth - childrenWidth * 2) / 2 - margin.left / 2,
    ),
    20,
  ]);

  // Add listener for when the browser or parent node resizes
  const resize = () => {
    if (!elem) {
      global.removeEventListener('resize', resize);
      return;
    }

    svgroot.attr('width', elem.offsetWidth).attr('height', elem.offsetHeight);
  };

  if (shouldResize) {
    global.addEventListener('resize', resize);
  }

  // Start initial render
  render(config);

  // Update DOM root height
  d3.select(id).style('height', elemHeight + margin.top + margin.bottom);
}

module.exports = {
  init,
};
