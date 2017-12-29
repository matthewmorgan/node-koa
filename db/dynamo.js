const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB({region: 'us-east-1'})

const params = {
  TableName: 'Students'
}


async function findOne(){
  let result = await dynamoDB.getItem({...params, Key: {'id':{'S': '12345'}}}).promise()
  console.log(result)
  return result
}


module.exports = {findOne}
