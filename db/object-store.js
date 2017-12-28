const aws = require('aws-sdk')
const s3 = new aws.S3()


// params: Collection: (str) collection name, payload: (obj) data to store
// returns: s3 response as object { ETag: '"hash-of-object"'}
async function putObject({Collection, payload}) {
  let Body = JSON.stringify(payload)
  let Key = payload.id
  return await s3.putObject({Bucket: Collection, Key, Body}).promise()
}

// params: Collection: (str) collection name, id: (str) unique key per collection
// returns: JS Object stored at id in Collection
async function getObject({Collection, id}) {
  return JSON.parse((await s3.getObject({Bucket: Collection, Key: id}).promise()).Body)
}

// params: Collection: (str) collection/Bucket name
// returns: array of object ids (Keys) in collection
async function listIds({Collection, ContinuationToken = null, pageLimit = Infinity}) {
  let Bucket = Collection
  let response = await s3.listObjectsV2({Bucket, ContinuationToken}).promise()
  let results = response.Contents
  let pageNumber = 1
  while (response.IsTruncated && pageNumber < pageLimit) {
    response = await s3.listObjectsV2({Bucket, ContinuationToken: response.NextContinuationToken}).promise()
    results = results.concat(response.Contents)
    pageNumber++
  }
  return {
    ContinuationToken: response.NextContinuationToken,
    ids:               results.map(result => result.Key)
  }
}


module.exports = {getObject, putObject, listIds}
