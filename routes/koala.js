const Router = require('koa-router')
const router = new Router()
const store = require('../db/object-store')

router.get(
    '/koala',
    async (ctx, next) => await ctx.render ('hello', {items: (await store.listIds({Collection: 'YPT_Database', pageLimit: 1})).ids})
)


module.exports = router
