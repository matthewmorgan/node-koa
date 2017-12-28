const serve = require('koa-static')
const Koa = require('koa')
const compress = require('koa-compress')
const app = new Koa
const njk = require('./utils/nunjucks');
const path = require('path')
const { PORT = 3000 } = process.env

const koalaRouter = require('./routes/koala')
// Uncomment this middleware to enable origin compression. This means
// Koa will perform the compression instead of Up, either techinque
// works fine.

app.use(compress())
// Templating - Must be used before any router
app.use(njk(path.join(__dirname, 'views'), {
  extname: '.html',
  noCache: process.env.NODE_ENV !== 'production',
  throwOnUndefined: true,
  filters: {
    json: function (str) {
      return JSON.stringify(str, null, 2);
    },
    upperCase: str => str.toUpperCase(),
  },
  globals: {
    version: 'v3.0.0',
  },
}));
app.use(koalaRouter.routes());

app.use(serve('public'))
app.listen(PORT)
