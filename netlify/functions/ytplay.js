const { createHandler } = require('./_adapter');
const handler = require('../../api/ytplay.js');

exports.handler = createHandler(handler);
