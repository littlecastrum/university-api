const moment = require('moment');
const { Types } = require('mongoose');
const { Career, Student, Subject, StudentSubject } = require('../models');
const { studentFormatter, studentsFormatter, studentSubjectFormatter, validateParams } = require('../util');

const {
  errorIDNotValid,
  errorRecordNotFound,
  errorMongoServer,
  errorMissingData,
  errorBodyInvalidData,
  errorAssignmentNotFound
} = require('../errors');

// GET /students
async function getAllStudents(req, res) {
  const students = await Student.find({}).exec();
  const formattedStudents = studentsFormatter(students);
  res.json(formattedStudents)
}

// POST /students
async function createStudent(req, res) {
  const { name, birthday, address, student_id } = req.body;
  if (name && birthday && address) {
    const newStudent = new Student({
      name,
      birthday: moment(birthday, 'YYYY-MM-DD'),
      address,
      career_id
    })
    try {
      await newStudent.save();
      res.json(studentFormatter(newStudent))
    } catch(err) {
      res.send(errorMongoServer)
    }
  } else {
    res.status(400).json(errorMissingData)
  }
}

// GET /students/:id
async function getStudent(req, res) {
  const id = req.params.id;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const student = await Student.findById(id);

  if (!student) {
    res.status(404).json(errorRecordNotFound(id, 'Student'));
  }
  
  res.json(studentFormatter(student));
}

// PUT /students/:id
async function updateStudent(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const student = await Student.findById(id);

  if (!student) {
    res.status(404).json(errorRecordNotFound(id, 'Student'))
  }
  
  const { name, birthday, address, subjects, career_id } = req.body;

  if (career_id && !Types.ObjectId.isValid(career_id)) {
    res.status(400).json(errorIDNotValid)
  }

  const career = career_id && await Career.findById(career_id);

  if (career_id && !career) {
    res.status(404).json(errorRecordNotFound(id, 'Career'))
  }

  const newSubjects = subjects ? Array.from(new Set([...student.subjects, ...subjects])) : student.subjects;
  student.name = name || student.name;
  student.birthday = birthday ? moment(birthday, 'YYYY-MM-DD').toDate() : student.birthday;
  student.address = address || student.address
  student.subjects = newSubjects;
  student.career_id = career_id || student.career_id;

  try {
    await student.save();
    res.json(studentFormatter(student))
  } catch(err) {
    console.log({
      name: err.name,
      message: err.message
    })
    res.send(errorMongoServer)
  }
}

// DELETE /students/:id
async function removeStudent(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid);
  }
  const deletedStudent = await Student.findOneAndDelete(id);
  res.json(studentFormatter(deletedStudent));
}

// POST /students/:id/subjects
async function addSubjects(req, res) {
  const id = req.params.id;
  const { subjectsIds } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  if (!subjectsIds.every((id) => Types.ObjectId.isValid(id))) {
    res.status(400).json(errorBodyInvalidData)
  }

  if (!subjectsIds) {
    res.status(400).json(errorMissingData)
  }

  const student = await Student.findById(id);

  if (!student) {
    res.status(404).json(errorRecordNotFound(id, 'Student'));
  }
  
  const subjects = await Subject.find({ '_id': { $in: subjectsIds.map((id) => Types.ObjectId(id)) } })

  if (subjects.length !== subjectsIds.length) {
    res.status(404).json(errorAssignmentNotFound);
  }

  const studentSubjects = subjects.map((subject) => ({
    student_id: id,
    subject_id: subject._id,
    state: 'IN_COURSE',
    score: null
  }));

  student.subjects = student.subjects ? [...student.subjects, ...subjectsIds] : subjectsIds;

  try {
    await StudentSubject.insertMany(studentSubjects);
    await student.save();
    res.json(studentFormatter(student))
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// GET /students/:id/subjects/:id
async function getStudentSubject(req, res) {
  const id = req.params.id;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const studentSubject = await StudentSubject.findById(id);

  if (!studentSubject) {
    res.status(404).json(errorRecordNotFound(id, 'StudentSubject'));
  }
  
  res.json(studentSubjectFormatter(studentSubject));
}

// PUT /students/:id/subjects/:id
async function updateStudentSubject(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const studentSubject = await StudentSubject.findById(id);

  if (!studentSubject) {
    res.status(404).json(errorRecordNotFound(id, 'StudentSubject'))
  }
  
  const { state, score } = req.body;

  studentSubject.state = state || studentSubject.state;
  studentSubject.score = score || studentSubject.score;

  try {
    await studentSubject.save();
    res.json(studentSubjectFormatter(studentSubject))
  } catch(err) {
    console.log({
      name: err.name,
      message: err.message
    })
    res.send(errorMongoServer)
  }
}

// DELETE /students/:id/subjects/:id
async function removeStudentSubject(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid);
  }
  try {
    const deletedStudentSubject = await StudentSubject.findOneAndDelete(id);
    res.json(studentSubjectFormatter(deletedStudentSubject));
  } catch(err) {
    console.log({
      name: err.name,
      message: err.message
    })
    res.send(errorMongoServer)
  }
}

module.exports = {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  removeStudent,
  addSubjects,
  getStudentSubject,
  updateStudentSubject,
  removeStudentSubject
}