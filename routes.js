const { getAllItems, getItem, createItem, updateItem, deleteItem } = require('./controller');

function routeHandler(req, res, parsedUrl) {
  const path = parsedUrl.pathname;
  const method = req.method;
  const segments = path.split('/').filter(Boolean);

  if (path === '/items' && method === 'GET') {
    return getAllItems(req, res);
  } else if (path === '/items' && method === 'POST') {
    return createItem(req, res);
  } else if (segments[0] === 'items' && segments[1]) {
    const id = segments[1];
    if (method === 'GET') return getItem(req, res, id);
    if (method === 'PUT') return updateItem(req, res, id);
    if (method === 'DELETE') return deleteItem(req, res, id);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: 'Route not found' }));
}

module.exports = { routeHandler };
