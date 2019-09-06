const moment = require('moment');
const { Types } = require('mongoose');
const { Career, Student, Subject } = require('../models');
const { careerFormatter, careersFormatter, validateParams } = require('../util');

const {
  errorIDNotValid,
  errorRecordNotFound,
  errorMongoServer,
  errorMissingData,
  errorBodyInvalidData,
  errorAssignmentNotFound
} = require('../errors');

// GET /careers
async function getAllCareers(req, res) {
  try {
    const careers = await Career.find({}).exec();
    const formattedcareers = careersFormatter(careers);
    res.json(formattedcareers)
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// POST /careers
async function createCareer(req, res) {
  const { name, title } = req.body;
  
  if (validateParams(name, title)) {
    res.status(400).json(errorMissingData)
  }

  const newCareer = new Career({ name, title })
  try {
    await newCareer.save();
    res.json(careerFormatter(newCareer))
  } catch(err) {
    console.log(err)
    res.send(errorMongoServer)
  }
}

// GET /careers/:id
async function getCareer(req, res) {
  const id = req.params.id;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const career = await Career.findById(id);

  if (!career) {
    res.status(404).json(errorRecordNotFound(id, 'Career'));
  }
  
  res.json(careerFormatter(career));
}

// PUT /careers/:id
async function updateCareer(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const career = await Career.findById(id);

  if (!career) {
    res.status(404).json(errorRecordNotFound(id, 'Career'))
  }
  
  const { name, title } = req.body;
  career.name = name || career.name;
  career.title = title || career.title;

  try {
    await career.save();
    res.json(careerFormatter(career))
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// DELETE /careers/:id
async function removeCareer(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid);
  }
  try {
    const deletedCareer = await Career.findOneAndDelete(id);
    res.json(careerFormatter(deletedCareer));
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// POST /careers/:id/students
async function addStudents(req, res) {
  const id = req.params.id;
  const { studentsIds } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  if (!studentsIds.every((id) => Types.ObjectId.isValid(id))) {
    res.status(400).json(errorBodyInvalidData)
  }

  const career = await Career.findById(id);

  if (!career) {
    res.status(404).json(errorRecordNotFound(id, 'Career'));
  }
  
  const students = await Student.find({ '_id': { $in: studentsIds.map((id) => Types.ObjectId(id)) } })

  if (students.length !== studentsIds.length) {
    res.status(404).json(errorAssignmentNotFound);
  }

  if (!students) {
    res.status(400).json(errorMissingData)
  }

  try {
    career.students = career.students ? [...career.students, ...studentsIds] : studentsIds;
    await career.save();
    res.json(careerFormatter(career))
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// POST /careers/:id/subjects
async function addSubjects(req, res) {
  const id = req.params.id;
  const { subjectsIds } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  if (!subjectsIds.every((id) => Types.ObjectId.isValid(id))) {
    res.status(400).json(errorBodyInvalidData)
  }

  const career = await Career.findById(id);

  if (!career) {
    res.status(404).json(errorRecordNotFound(id, 'Career'));
  }
  
  const subjects = await Subject.find({ '_id': { $in: subjectsIds.map((id) => Types.ObjectId(id)) } })

  if (subjects.length !== subjectsIds.length) {
    res.status(404).json(errorAssignmentNotFound);
  }

  if (!subjects) {
    res.status(400).json(errorMissingData)
  }

  try {
    career.subjects = career.subjects ? [...career.subjects, ...subjectsIds] : subjectsIds;
    await career.save();
    res.json(careerFormatter(career))
  } catch(err) {
    res.send(errorMongoServer)
  }
}

module.exports = {
  getAllCareers,
  createCareer,
  getCareer,
  updateCareer,
  removeCareer,
  addSubjects
}