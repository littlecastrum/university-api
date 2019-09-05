const mongoose = require('mongoose');
const moment = require('moment');
const { mongoErrors } = require('./errors');

async function setupMongo(mongoURI) {
  if (mongoURI === '') {
    console.log('Set mongo configuration in .env file');
    process.exit(2)
  }
  try {
    mongoose.Promise = global.Promise;
    db = await mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });
    mongoose.connection.on('error', console.log.bind(console, 'MongoDB Connection error'));
  } catch (err) {
    console.log(mongoErrors[err.name]);
  }
};

function extractUris(router) {
  if (router.stack.length === 1 && router.stack[0].route === undefined) return [];
  return router.stack.map(({ route }) => {
    return Object.keys(route.methods).reduce((acc, method) => {
      return `${acc}\n    ${method.toUpperCase()} ${route.path}`;
    }, '');
  });
};

function studentFormatter(student) { 
  return {
    id: student._id,
    name: student.name,
    birthday: moment(student.birthday).format('L'),
    address: student.address,
    subjects: student.subjects ? student.subjects : [],
    carrer_id: student.carrer_id ? student.carrer_id : null,
  };
};

function studentsFormatter(students) { 
  return students.map(studentFormatter);
};

function subjectFormatter(subject) { 
  return {
    id: subject._id,
    name: subject.name,
    timeslots: subject.timeslots,
    carrer_id: subject.carrer_id ? subject.carrer_id : null,
  };
};

function subjectsFormatter(subjects) {
  return subjects.map(subjectFormatter);
}

module.exports = {
  setupMongo,
  extractUris,
  studentFormatter,
  studentsFormatter,
  subjectFormatter,
  subjectsFormatter
}