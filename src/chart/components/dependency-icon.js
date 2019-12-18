/*
<rect x="9.5" y="14.5" width="14" height="6" rx="0.5" stroke="#727678"/>
<path d="M4 12V18H10" stroke="#727678"/>
<rect x="0.5" y="5.5" width="15" height="6" rx="0.5" stroke="#727678"/>
*/

module.exports = function dependencyIcon({ svg, x = 5, y = 5 }) {
  const container = svg
    .append('g')
    .attr('transform', `translate(${x}, ${y})`);

  container
    .append('rect')
    .attr('x', 9.5)
    .attr('y', 15.5)
    .attr('width', 10)
    .attr('height', 5)
    .attr('rx', 0.5)
    .attr('stroke', '#727678')
    .attr('fill', 'white');

  container
    .append('path')
    .attr('stroke', '#727678')
    .attr('fill', 'white')
    .attr(
      'd',
      'M4 12V18H10',
    );

  container
    .append('rect')
    .attr('x', 0.5)
    .attr('y', 6.5)
    .attr('width', 11)
    .attr('height', 5)
    .attr('rx', 0.5)
    .attr('stroke', '#727678')
    .attr('fill', 'white');
};
