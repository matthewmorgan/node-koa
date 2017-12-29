const Router = require('koa-router')
const router = new Router()
const store = require('../db/object-store')
const athena = require('../db/athena')

const aws = require('aws-sdk')
router.get(
    '/koala',
    async (ctx, next) => ctx.render ('hello', {items: await fetchIds()})
)

// async function fetchIds(){
//   return (await store.listIds({database: 'YPT_Database', collection: 'students', pageLimit: 1})).ids
// }

async function fetchIds(){
  return await athena.findOne()
}

module.exports = router
