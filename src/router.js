const router = require('express').Router();
const studentsHandlers = require('./handlers/students');
const subjectsHandlers = require('./handlers/subjects');
const careersHandlers = require('./handlers/careers');

// Students
router.get('/students', studentsHandlers.getAllStudents);
router.post('/students', studentsHandlers.createStudent);

router.get('/students/:id', studentsHandlers.getStudent);
router.put('/students/:id', studentsHandlers.updateStudent);
router.delete('/students/:id', studentsHandlers.removeStudent);

router.post('/students/:id/subjects', (req, res) => res.send('Hello World!'));

router.get('/students/:id/subjects/:id', (req, res) => res.send('Hello World!'));
router.put('/students/:id/subjects/:id', (req, res) => res.send('Hello World!'));
router.delete('/students/:id/subjects/:id', (req, res) => res.send('Hello World!'));

// careers
router.get('/careers', careersHandlers.getAllCareers);
router.post('/careers', careersHandlers.createCareer);
router.get('/careers/:id', careersHandlers.getCareer);
router.put('/careers/:id', careersHandlers.updateCareer);
router.delete('/careers/:id', careersHandlers.removeCareer);
router.post('/careers/:id/subjects', careersHandlers.addSubjects);

// Subjects
router.get('/subjects', subjectsHandlers.getAllSubjects);
router.post('/subjects', subjectsHandlers.createSubject);
router.get('/subjects/:id', subjectsHandlers.getSubject);
router.put('/subjects/:id', subjectsHandlers.updateSubject);
router.delete('/subjects/:id', subjectsHandlers.removeSubject);

module.exports = router;