const { createHandler } = require('./_adapter');
const handler = require('../../api/search.js');

exports.handler = createHandler(handler);
