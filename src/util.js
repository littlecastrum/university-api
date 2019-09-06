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
    ...student,
    id: student._id,
    birthday: moment(student.birthday).format('DD/MM/YYYY'),
    subjects: student.subjects || [],
    career_id: student.career_id || null,
  };
};

function studentsFormatter(students) { 
  return students.map(studentFormatter);
};

function subjectFormatter(subject) { 
  return {
    ...subject,
    id: subject._id,
    career_id: subject.career_id || null,
  };
};

function subjectsFormatter(subjects) {
  return subjects.map(subjectFormatter);
}

function careerFormatter(career) { 
  return {
    ...career,
    id: career._id,
    subjects: career.subjects || [],
    students: career.students || [],
  };
};

function careersFormatter(careers) {
  return careers.map(careerFormatter);
}

function validateParams(...args) {
  return [...args].every(val => Boolean(val));
}

function studentSubjectFormatter(studentSubject) { 
  return {
    ...studentSubject,
    id: student._id,
  };
};

module.exports = {
  setupMongo,
  extractUris,
  studentFormatter,
  studentsFormatter,
  subjectFormatter,
  subjectsFormatter,
  careerFormatter,
  careersFormatter,
  studentSubjectFormatter,
  validateParams
}