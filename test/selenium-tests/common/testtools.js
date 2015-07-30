var fs = require('fs');

exports.writeScreenshot = function(data, name) {
  fs.writeFileSync('images/' + name, data, 'base64');
};
