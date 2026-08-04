const { createHandler } = require('./_adapter');
const handler = require('../../api/lyrics.js');

exports.handler = createHandler(handler);
