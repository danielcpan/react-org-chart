/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg> */

const toggleMenu = (d) => {
  d.isMenuOpen = !d.isMenuOpen;
  if (d.isMenuOpen) {
    d3.select(`#settings-menu-${d.id}`).transition()
      .duration(200)
      .style('opacity', 1);
  } else {
    d3.select(`#settings-menu-${d.id}`).transition()
      .duration(350)
      .style('opacity', 0);
  }
};


const renderMenuOption = ({
  svg: settingsMenu, title, handleClick, config,
}) => {
  // console.log('config menu:', config);
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
    .style('cursor', 'pointer')
    .style('font-size', 14)
    .text(title);

  optionContainer
    .on('mouseover', (d) => {
      optionBackground.style('fill', config.borderColor);
      optionBackground.style('cursor', 'pointer');
    })
    .on('mouseout', (d) => {
      optionBackground.style('fill', config.backgroundColor);
      optionBackground.style('cursor', 'default');
    })
    .on('click', (datum) => {
      if (datum.isMenuOpen) {
        // console.log('datum:', datum);
        handleClick(datum, d3.event);
        toggleMenu(datum);
      }
    });
};

module.exports = function iconLink({
  svg, x = 5, y = 5, config,
}) {
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
    );

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
    .attr('id', (d) => `settings-menu-${d.id}`)
    .attr(
      'transform',
      'translate(230, 0)',
    )
    .style('opacity', 0);

  const cardContainer = settingsMenu
    .append('rect')
    .attr('width', 80)
    .attr('height', 70)
    .attr('fill', config.backgroundColor)
    .attr('stroke', config.borderColor)
    .attr('rx', config.nodeBorderRadius)
    .attr('ry', config.nodeBorderRadius)
    .attr('class', 'box');

  renderMenuOption({
    svg: settingsMenu,
    title: 'Edit',
    handleClick: config.handleEdit,
    config: { ...config, height: 20 },
  });
  renderMenuOption({
    svg: settingsMenu,
    title: 'Move',
    handleClick: config.handleMove,
    config: { ...config, height: 40 },
  });
  renderMenuOption({
    svg: settingsMenu,
    title: 'Add Child',
    handleClick: config.handleAdd,
    config: { ...config, height: 60 },
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
