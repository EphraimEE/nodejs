const { loadItems, saveItems } = require('./storage');

function getAllItems(req, res) {
  const items = loadItems();
  sendResponse(res, 200, items);
}

function getItem(req, res, id) {
  const items = loadItems();
  const item = items.find(i => i.id === id);
  item ? sendResponse(res, 200, item) : sendError(res, 404, 'Item not found');
}

function createItem(req, res) {
  getRequestBody(req, body => {
    if (!body || !body.id || !body.name || !body.price || !['s', 'm', 'l'].includes(body.size)) {
      return sendError(res, 400, 'Invalid item data');
    }
    const items = loadItems();
    if (items.find(item => item.id === body.id)) {
      return sendError(res, 409, 'Item with this ID already exists');
    }
    items.push(body);
    saveItems(items);
    sendResponse(res, 201, body);
  });
}

function updateItem(req, res, id) {
  getRequestBody(req, body => {
    if (!body || !body.name || !body.price || !['s', 'm', 'l'].includes(body.size)) {
      return sendError(res, 400, 'Invalid item data');
    }
    const items = loadItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return sendError(res, 404, 'Item not found');
    items[index] = { ...items[index], ...body, id: items[index].id }; // Prevent ID overwrite
    saveItems(items);
    sendResponse(res, 200, items[index]);
  });
}

function deleteItem(req, res, id) {
  const items = loadItems();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return sendError(res, 404, 'Item not found');
  const deleted = items.splice(index, 1);
  saveItems(items);
  sendResponse(res, 200, deleted[0]);
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, data }));
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: message }));
}

function getRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch (e) {
      callback(null);
    }
  });
}

module.exports = { getAllItems, getItem, createItem, updateItem, deleteItem };
