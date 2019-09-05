const errorIDNotValid = {
  error: 'ID passed is not valid',
  status: 400
}

const errorMissingData = {
  error: 'There is missing information on the body of the request',
  status: 400
}

const errorRecordNotFound = (recordId, recordType) => ({
  error: `${recordType} with ID ${recordId} not found in data base`,
  status: 404
})

const errorMongoServer = {
  error: 'Unexpected error on server handling request',
  status: 500
}

const mongoErrors = {
  MongoParseError: 'The URI passed to connect to MongoDB could not be parsed'
}

module.exports = {
  errorIDNotValid,
  errorMissingData,
  errorRecordNotFound,
  errorMongoServer,
  mongoErrors
}