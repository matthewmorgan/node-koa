const Router = require('koa-router')
const router = new Router()

router.get('/koala', async (ctx, next) => await ctx.render ('hello', {param: 'australia!'}))

module.exports = router
