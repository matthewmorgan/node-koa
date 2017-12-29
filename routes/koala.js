const Router = require('koa-router')
const router = new Router()
const store = require('../db/object-store')
const athena = require('../db/athena')
const dynamo = require('../db/dynamo')

const aws = require('aws-sdk')
router.get(
    '/koala',
    async (ctx, next) => ctx.render ('hello', {items: await fetchIds()})
)

// async function fetchIds(){
//   return (await store.listIds({database: 'YPT_Database', collection: 'students', pageLimit: 1})).ids
// }

// async function fetchIds(){
//   let result = await athena.findOne()
//   if (result.length === 0){
//     return ['no results found']
//   }
//   return result
// }

async function fetchIds(){
  let result = await dynamo.findOne()
  if (result.length === 0){
    return ['no results found']
  }
  return [result]
}


module.exports = router
