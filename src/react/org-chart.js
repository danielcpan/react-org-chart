const { createElement, useEffect } = require('react')
const { init } = require('../chart')

const OrgChart = ({ id = 'react-org-chart', tree, nodeStyles, ...options }) => {

  useEffect(() => {
    init({ id: `#${id}`, data: tree, ...options})
  }, [])

  return createElement('div', id);
}

module.exports = OrgChart

// const nodeStyles = {
//   shape: 'rect',
//   width: 240,
//   height: 120,
  
// }

