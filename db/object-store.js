const aws = require('aws-sdk')
const s3 = new aws.S3()


// params: Collection: (str) collection name, payload: (obj) data to store
//returns: s3 response as object { ETag: '"hash-of-object"'}
async function putObject({Collection, payload}) {
  let Body = JSON.stringify(payload)
  let Key = payload.id
  return await s3.putObject({Bucket: Collection, Key, Body}).promise()
}

//params: Collection: (str) collection name, id: (str) unique key per collection
//returns: JS Object stored at id in Collection
async function getObject({Collection, id}) {
  return JSON.parse((await s3.getObject({Bucket: Collection, Key: id}).promise()).Body)
}

//parmas: Collection: (str) collection/Bucket name
//returns: array of object ids (Keys) in collection
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
  console.log(results)
  return {
    ContinuationToken: response.NextContinuationToken,
    ids:               results.map(result => result.Key)
  }
}

/*
async function doGet(){
  let response = await getObject({Collection: 'YPT_Database', id: 'foo'});
  console.log(response);
}

async function doPut(){
  let response = await putObject({Bucket: 'YPT_Database', payload: {id: 'foo', body:'bar'}});
  console.log(response);
}
*/
async function doList() {
  let start = (new Date()).getTime()
  let response = await listIds({Collection: 'YPT_Database', pageLimit: 1})

  let numIds = response.ids.length;
  console.log('ids found: ', numIds);
  console.log('ContinuationToken: ', response.ContinuationToken)

  // await response.forEach(async id => {
  //   let data = await getObject({Collection: 'YPT_Database', id})
  //   // console.log(data)
  // })
  console.log('Took: ', (new Date()).getTime() - start)

}


// doList()

module.exports = {getObject, putObject, listIds}
