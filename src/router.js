const router = require('express').Router();
const studentsHandlers = require('./handlers/students');

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

// Carrers
router.get('/carrers', (req, res) => res.send('Hello World!'));
router.post('/carrers', (req, res) => res.send('Hello World!'));

router.get('/carrers/:id', (req, res) => res.send('Hello World!'));
router.put('/carrers/:id', (req, res) => res.send('Hello World!'));
router.delete('/carrers/:id', (req, res) => res.send('Hello World!'));

router.post('/carrers/:id/students', (req, res) => res.send('Hello World!'));
router.post('/carrers/:id/subjects', (req, res) => res.send('Hello World!'));

// Subjects
router.get('/subjects', (req, res) => res.send('Hello World!'));
router.post('/subjects', (req, res) => res.send('Hello World!'));

router.get('/subjects/:id', (req, res) => res.send('Hello World!'));
router.put('/subjects/:id', (req, res) => res.send('Hello World!'));
router.delete('/subjects/:id', (req, res) => res.send('Hello World!'));

module.exports = router;