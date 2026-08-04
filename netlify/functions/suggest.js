const { createHandler } = require('./_adapter');
const handler = require('../../api/suggest.js');

exports.handler = createHandler(handler);
