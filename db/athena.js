const aws = require('aws-sdk')
const Athena = require('athena-client');

const config = {
  bucketUri: 's3://dulcet-scratch-bucket/'
}

const options = {
  timeout: 3000,
  format: 'raw'
}

async function findOne(){
  const queryString = `SELECT *
    FROM ypt.students
    WHERE body='fizzbuzz'`

  return await Athena
      .Client({region: 'us-east-1'}, config)
      .execute(queryString)
}

module.exports = {findOne}
