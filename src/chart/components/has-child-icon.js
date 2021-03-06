module.exports = function hasChildIcon({ svg, x = 5, y = 5 }) {
  const container = svg
    .append('g')
    .attr('id', 'icon')
    .attr('fill', '#92a0ad')
    .attr('transform', `translate(${x}, ${y}) scale(0.05, 0.05)`);

  container
    .append('path')
    .attr(
      'd',
      'M220.088,57.667l-99.671,99.695L20.746,57.655c-4.752-4.752-12.439-4.752-17.191,0c-4.74,4.752-4.74,12.451,0,17.203l108.261,108.297l0,0l0,0c4.74,4.752,12.439,4.752,17.179,0L237.256,74.859c4.74-4.752,4.74-12.463,0-17.215C232.528,52.915,224.828,52.915,220.088,57.667z',
    );
};
