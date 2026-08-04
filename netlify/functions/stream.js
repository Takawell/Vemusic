const { createHandler } = require('./_adapter');
const handler = require('../../api/stream.js');

exports.handler = createHandler(handler);
