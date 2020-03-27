const toggleMenu = (d) => {
  d.isMenuOpen = !d.isMenuOpen;
  const allMenus = d3.selectAll('.settings-menu-container')
    .style('visibility', 'hidden')
    .style('opacity', 0);
  allMenus[0].forEach(({ __data__ }) => {
    if (__data__.id !== d.id) __data__.isMenuOpen = false;
  });
  if (d.isMenuOpen) {
    d3.select(`#settings-menu-${d.id}`).transition()
      .duration(200)
      .style('visibility', 'visible')
      .style('opacity', 1);
  } else {
    d3.select(`#settings-menu-${d.id}`)
      .style('visibility', 'hidden')
      .style('opacity', 0);
  }
};


const renderMenuOption = ({
  svg: settingsMenu, title, handleClick, config,
}) => {
  const isRoot = (d) => d.parentId === config.treeData.parentId;
  const isLeaf = (d) => !d.hasChild;

  const isAllowed = (d) => {
    if (config.isViewOnly) {
      if (isRoot(d)) return false;
      const isFocusOption = title === 'Focus';
      return isFocusOption;
    }
    if (isRoot(d)) return (['Add Child', 'Edit'].includes(title));
    if (!isLeaf(d)) return (title !== 'Delete');
    return true;
  };

  const optionContainer = settingsMenu
    .append('g')
    .attr('width', 80)
    .attr('height', 20);

  const optionBackground = optionContainer
    .append('rect')
    .attr('width', 80)
    .attr('height', 20)
    .attr('x', 0)
    .attr('y', config.height - 15)
    .style('fill', config.backgroundColor);

  const optionText = optionContainer
    .append('text')
    .attr('x', 10)
    .attr('y', config.height)
    .style('fill', 'black')
    .style('font-size', 14)
    .style('opacity', (d) => (!isAllowed(d) ? 0.5 : 1))
    .text(title);

  optionContainer
    .on('mouseover', (d) => {
      if (d.isMenuOpen) {
        optionBackground.style('fill', config.borderColor);
        optionBackground.style('cursor', (!isAllowed(d) ? 'not-allowed' : 'default'));
        optionText.style('cursor', (!isAllowed(d) ? 'not-allowed' : 'default'));
      }
    })
    .on('mouseout', (d) => {
      if (d.isMenuOpen) {
        optionBackground.style('fill', config.backgroundColor);
      }
    })
    .on('click', (datum) => {
      if (datum.isMenuOpen && isAllowed(datum)) {
        optionBackground.style('fill', config.backgroundColor);
        handleClick(datum, d3.event);
        toggleMenu(datum);
      }
    });
};

module.exports = function iconLink({
  svg, x = 5, y = 5, config,
}) {
  const isRoot = (d) => d.parentId === config.treeData.parentId;

  const container = svg
    .append('g')
    .attr('stroke', 'none')
    .attr('fill', 'none')
    .style('cursor', 'pointer')
    .append('g');

  const icon = container
    .append('g')
    .attr('id', 'icon')
    .attr('fill', '#92a0ad')
    .attr('transform', `translate(${x}, ${y})`);

  const settings = icon
    .append('g')
    .attr('id', 'settings')
    .attr(
      'transform',
      'translate(3, 7.000000) scale(0.25, 0.25) translate(-14, -7.000000)',
    )
    .style('visibility', (d) => (isRoot(d) && config.isViewOnly ? 'hidden' : 'visible'));

  settings
    .append('path')
    .attr(
      'd',
      'M30,16c4.411,0,8-3.589,8-8s-3.589-8-8-8s-8,3.589-8,8S25.589,16,30,16z',
    );

  settings
    .append('path')
    .attr(
      'd',
      'M30,44c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S34.411,44,30,44z',
    );

  settings
    .append('path')
    .attr(
      'd',
      'M30,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S34.411,22,30,22z',
    );

  const settingsMenu = svg
    .append('g')
    .attr('class', 'settings-menu-container')
    .attr('id', (d) => `settings-menu-${d.id}`)
    .attr(
      'transform',
      'translate(230, 0)',
    )
    .style('visibility', 'hidden')
    .style('opacity', 0);

  settingsMenu
    .append('rect')
    .attr('width', 80)
    .attr('height', 90)
    .attr('fill', config.backgroundColor)
    .attr('stroke', config.borderColor)
    .attr('rx', config.nodeBorderRadius)
    .attr('ry', config.nodeBorderRadius)
    .attr('class', 'box');

  renderMenuOption({
    svg: settingsMenu,
    title: 'Add Child',
    handleClick: config.handleAdd,
    config: { ...config, height: 20 },
  });
  renderMenuOption({
    svg: settingsMenu,
    title: 'Edit',
    handleClick: config.handleEdit,
    config: { ...config, height: 40 },
  });
  renderMenuOption({
    svg: settingsMenu,
    title: 'Delete',
    handleClick: config.handleDelete,
    config: { ...config, height: 60 },
  });
  renderMenuOption({
    svg: settingsMenu,
    title: 'Focus',
    handleClick: config.handleFocus,
    config: { ...config, height: 80 },
  });

  icon
    .append('rect')
    .attr('id', 'bounds')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 24)
    .attr('height', 24)
    .attr('fill', 'transparent')
    .attr(
      'transform',
      'translate(-5,1)',
    )
    .on('click', toggleMenu);
};
