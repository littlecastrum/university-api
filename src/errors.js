const errorIDNotValid = {
  error: 'ID passed is not valid',
  status: 400
}

const errorMissingData = {
  error: 'There is missing information on the body of the request',
  status: 400
}

const errorRecordNotFound = (recordId, recordType) => ({
  error: `${recordType} with ID ${recordId} not found in database`,
  status: 404
})

const errorAssignmentNotFound = {
  error: 'Records trying to be assigned were not found in database',
  status: 404
}

const errorMongoServer = {
  error: 'Unexpected error on server handling request',
  status: 500
}

const mongoErrors = {
  MongoParseError: 'The URI passed to connect to MongoDB could not be parsed'
}

const errorBodyInvalidData = {
  error: 'Request body have invalid values',
  status: 400
}

module.exports = {
  errorIDNotValid,
  errorMissingData,
  errorRecordNotFound,
  errorMongoServer,
  errorBodyInvalidData,
  errorAssignmentNotFound,
  mongoErrors
}