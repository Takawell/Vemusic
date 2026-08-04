# NanzMusify

A web music player backed by YouTube Music search/streaming, packaged for
one-click deployment on **Netlify**.

## Project structure

```
public/                  -> static site (Netlify "publish" directory)
api/                      -> original handler logic (req, res) — shared source
netlify/functions/        -> thin Netlify Function wrappers around api/*.js (JSON endpoints)
netlify/edge-functions/   -> Edge Function for /api/proxy-audio (true audio streaming)
netlify.toml               -> Netlify build & routing configuration
```

No build step is required — the site is plain HTML/CSS/JS and the backend
runs entirely as Netlify Functions / Edge Functions.

## Deploy to Netlify

### Option A — Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option B — Git integration
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**.
3. Build settings are already defined in `netlify.toml` (publish = `public`,
   functions = `netlify/functions`) — no changes needed.
4. Deploy.

### Option C — Drag & drop
Zip the whole project folder (including `netlify.toml`, `netlify/`, `api/`
and `public/`) and drag it onto the Netlify dashboard deploy area.

No environment variables are required — the app doesn't call any API that
needs a secret key. CORS is off (no `Access-Control-Allow-Origin` headers
are sent anywhere), so only the site itself can call its own `/api/*`
endpoints from a browser — other websites' JS can't call them cross-origin.

## API routes

| Route                | Backend                                   |
|-----------------------|--------------------------------------------|
| `/api/search`         | Netlify Function (`netlify/functions/search.js`) |
| `/api/lyrics`         | Netlify Function |
| `/api/artist`         | Netlify Function |
| `/api/album`          | Netlify Function |
| `/api/suggest`        | Netlify Function |
| `/api/ytplay`         | Netlify Function |
| `/api/stream`         | Netlify Function |
| `/api/proxy-audio`    | **Edge Function** (streams audio bytes + Range/206 support for seeking) |

`proxy-audio` is implemented as an Edge Function instead of a regular
Function because regular (Lambda-based) functions buffer the whole response
in memory with a small payload limit, which breaks playback of longer
tracks and range-request seeking. The Edge Function streams bytes directly.

## Local development

Any static server works, e.g.:
```bash
npx netlify dev
```
`netlify dev` runs the static site together with the Functions and Edge
Functions locally, matching production behavior.
