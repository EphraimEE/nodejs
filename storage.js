const fs = require('fs');
const path = './items.json';

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, '[]');
}

function loadItems() {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
}

function saveItems(items) {
  fs.writeFileSync(path, JSON.stringify(items, null, 2));
}

module.exports = { loadItems, saveItems };