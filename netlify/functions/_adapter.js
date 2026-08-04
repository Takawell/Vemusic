// Adapter that lets the original Vercel-style handlers `(req, res) => {}`
// (found in /api/*.js) run unmodified as Netlify Functions.
// Wraps Netlify's classic (event, context) Lambda-style invocation.

function buildReq(event) {
  let body = event.body;
  if (body && event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString('utf8');
  }
  if (body && typeof body === 'string') {
    const contentType = (event.headers['content-type'] || event.headers['Content-Type'] || '').toLowerCase();
    if (contentType.includes('application/json')) {
      try { body = JSON.parse(body); } catch (e) { /* leave as raw string */ }
    }
  }

  return {
    method: event.httpMethod,
    headers: event.headers || {},
    query: event.queryStringParameters || {},
    body: body || {},
  };
}

function buildRes() {
  const state = { statusCode: 200, headers: {}, body: '' };
  let resolveFn;
  const done = new Promise((resolve) => { resolveFn = resolve; });

  const res = {
    status(code) { state.statusCode = code; return res; },
    setHeader(key, value) { state.headers[key] = value; return res; },
    getHeader(key) { return state.headers[key]; },
    json(payload) {
      state.headers['Content-Type'] = state.headers['Content-Type'] || 'application/json';
      state.body = JSON.stringify(payload);
      resolveFn(state);
      return res;
    },
    send(payload) {
      if (typeof payload === 'object') return res.json(payload);
      state.body = payload != null ? String(payload) : '';
      resolveFn(state);
      return res;
    },
    end(payload) {
      if (payload) state.body = String(payload);
      resolveFn(state);
      return res;
    },
  };

  return { res, done };
}

function createHandler(vercelHandler) {
  return async (event, context) => {
    const req = buildReq(event);
    const { res, done } = buildRes();

    try {
      await vercelHandler(req, res);
    } catch (err) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: false, message: 'Internal error: ' + err.message }),
      };
    }

    const result = await done;
    return {
      statusCode: result.statusCode,
      headers: result.headers,
      body: result.body,
    };
  };
}

module.exports = { createHandler };
