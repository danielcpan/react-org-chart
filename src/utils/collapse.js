module.exports = function collapseNode(node) {
  // console.log('inside collapse:', node);
  // Check if this node has children
  // if (node.children && !node.isCollapsed) {
  if (node.children && !node.isCollapsed) {
    node._children = node.children;
    node._children.forEach(collapseNode);
    node.children = null;
  }
};
