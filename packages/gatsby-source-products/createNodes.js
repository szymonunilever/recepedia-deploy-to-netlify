exports.createPagesNodes = (
  page,
  { createNodeId, createContentDigest, createNode }
) => {
  page.nutritionFacts = JSON.stringify(page.nutritionFacts);
  const nodeId = createNodeId(`page-product-${page.id}`);
  const nodeContent = JSON.stringify(page);
  const nodeData = Object.assign({}, page, {
    id: nodeId,
    brand: page.brand.replace(/[^a-zA-Z0-9\s-]+/g, '').toLowerCase(),
    productId: page.id,
    parent: null,
    EANparent: page.EANparent || '',
    children: [],
    internal: {
      type: 'Product',
      content: nodeContent,
      contentDigest: createContentDigest(page),
    },
  });

  createNode(nodeData);
  return nodeData;
};
