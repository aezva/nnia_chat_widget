const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const cssPath = path.join(__dirname, '..', 'public', 'nia-style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  res.setHeader('Content-Type', 'text/css');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(cssContent);
};
