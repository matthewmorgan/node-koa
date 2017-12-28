const aws = require('aws-sdk')
const s3 = new aws.S3()


// params: database: (str) dbname, collection: (str) collection name, payload: (obj) data to store
// returns: s3 response as object { ETag: '"hash-of-object"'}
async function putObject({database, collection, payload}) {
  let Bucket = database
  let Prefix = collection
  let Body = JSON.stringify(payload)
  let Key = `${Prefix}/${payload.id}`  //node sdk quirk
  return await s3.putObject({Bucket, Key, Body}).promise()
}

// params: database: (str) dbname, collection: (str) collection name
// returns: JS Object stored at id in collection
async function getObject({database, collection, id}) {
  let Bucket = database
  let Prefix = collection
  let Key = `${Prefix}/${id}`  //node sdk quirk
  return JSON.parse((await s3.getObject({Bucket, Key}).promise()).Body)
}

// params: Collection: (str) collection/Bucket name
// returns: array of object ids (Keys) in collection
async function listIds({database, collection, ContinuationToken = null, pageLimit = Infinity}) {
  let Bucket = database
  let Prefix = collection
  let response = await s3.listObjectsV2({Bucket, Prefix, ContinuationToken}).promise()
  let results = response.Contents
  let pageNumber = 1
  while (response.IsTruncated && pageNumber < pageLimit) {
    response = await s3.listObjectsV2({Bucket, Prefix, ContinuationToken: response.NextContinuationToken}).promise()
    results = results.concat(response.Contents)
    pageNumber++
  }
  let r = new RegExp(`^${collection}/`)
  return {
    ContinuationToken: response.NextContinuationToken,
    ids:               results.map(result => result.Key.replace(r, ''))
  }
}


module.exports = {getObject, putObject, listIds}
