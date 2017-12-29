const serve = require('koa-static')
const Koa = require('koa')
const compress = require('koa-compress')
const app = new Koa
const koaNunjucks = require('koa-nunjucks-2')
const path = require('path')
const {PORT = 3000} = process.env

const koalaRouter = require('./routes/koala')


app.use(koaNunjucks({
  ext:            'njk',
  path:           path.join(__dirname, 'views'),
  configureEnvironment: (env) => {
    env.addFilter('json', str => JSON.stringify(str, null, 2));
  },
  nunjucksConfig: {
    trimBlocks: true
  }
}))
app.use(koalaRouter.routes())

app.use(serve('public'))
app.listen(PORT)
