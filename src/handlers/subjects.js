const moment = require('moment');
const { Types } = require('mongoose');
const { Subject } = require('../models');
const { subjectFormatter, subjectsFormatter } = require('../util');
const { errorIDNotValid, errorRecordNotFound, errorMongoServer, errorMissingData } = require('../errors');

// GET /subjects
async function getAllSubjects(req, res) {
  const subjects = await Subject.find({}).exec();
  const formattedSubjects = subjectsFormatter(subjects);
  res.json(formattedSubjects)
}

// POST /subjects
async function createSubject(req, res) {
  const { name, timeslots, career_id } = req.body;
  if (name && timeslots) {
    const newSubject = new Subject({
      name,
      timeslots,
      career_id
    })
    try {
      await newSubject.save();
      res.json(subjectFormatter(newSubject))
    } catch(err) {
      res.send(errorMongoServer)
    }
  } else {
    res.status(400).json(errorMissingData)
  }
}

// GET /subjects/:id
async function getSubject(req, res) {
  const id = req.params.id;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const subject = await Subject.findById(id);

  if (!subject) {
    res.status(404).json(errorRecordNotFound(id, 'Subject'));
  }
  
  res.json(subjectFormatter(subject));
}

// PUT /subjects/:id
async function updateSubject(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid)
  }

  const subject = await Subject.findById(id);

  if (!subject) {
    res.status(404).json(errorRecordNotFound(id, 'Subject'))
  }
  
  const { name, timeslots, career_id } = req.body;
  subject.name = name || subject.name;
  subject.timeslots = timeslots || subject.timeslots;
  subject.career_id = career_id || subject.career_id;

  try {
    await subject.save();
    res.json(subjectFormatter(subject))
  } catch(err) {
    res.send(errorMongoServer)
  }
}

// DELETE /subjects/:id
async function removeSubject(req, res) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json(errorIDNotValid);
  }
  const deletedSubject = await Subject.findOneAndDelete(id);
  res.json(subjectFormatter(deletedSubject));
}

module.exports = {
  getAllSubjects,
  createSubject,
  getSubject,
  updateSubject,
  removeSubject
}