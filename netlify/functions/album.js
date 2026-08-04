const { createHandler } = require('./_adapter');
const handler = require('../../api/album.js');

exports.handler = createHandler(handler);
