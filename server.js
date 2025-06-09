const http = require('http');
const url = require('url');
const { routeHandler } = require('./routes');

const PORT = 3000

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  routeHandler(req, res, parsedUrl);
});

server.listen(3000, () => {
  console.log('Inventory API server running on http://localhost:3000');
});