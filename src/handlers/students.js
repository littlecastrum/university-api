const moment = require('moment');
const { Types } = require('mongoose');
const { Student } = require('../models');
const { studentFormatter, studentsFormatter } = require('../util');
const { errorIDNotValid, errorRecordNotFound, errorMongoServer, errorMissingData } = require('../errors');

// GET /students
async function getAllStudents(req, res) {
  const students = await Student.find({}).exec();
  const formattedStudents = studentsFormatter(students);
  res.json(formattedStudents)
}

// POST /students
async function createStudent(req, res) {
  const { name, birthday, address, carrer_id } = req.body;
  if (name && birthday && address) {
    const newStudent = new Student({
      name,
      birthday: moment(birthday, 'YYYY-MM-DD'),
      address,
      carrer_id
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
  
  const { name, birthday, address, subjects, carrer_id } = req.body;
  const newSubjects = subjects ? Array.from(new Set([...student.subjects, ...subjects])) : student.subjects;
  student.name = name ? name : student.name;
  student.birthday = birthday ? moment(birthday, 'YYYY-MM-DD').toDate() : student.birthday;
  student.address = address ? address : student.address
  student.subjects = newSubjects;
  student.carrer_id = carrer_id ? carrer_id : student.carrer_id;

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

module.exports = {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  removeStudent
}